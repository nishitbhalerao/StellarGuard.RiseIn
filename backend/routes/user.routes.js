import express from 'express';
import User from '../models/User.model.js';
import Audit from '../models/Audit.model.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin credentials - Only this combination grants admin access
const ADMIN_CREDENTIALS = {
  email: 'bhaleraonishit@gmail.com',
  password: 'nishit@stellarguard2026'
};

// Get all users (protected - admin only)
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    // Fetch audit counts for each user
    const usersWithData = await Promise.all(
      users.map(async (user) => {
        const auditCount = await Audit.countDocuments({ walletAddress: user.email });
        return {
          ...user.toObject(),
          auditCount
        };
      })
    );

    res.json({
      success: true,
      data: usersWithData
    });
  } catch (error) {
    console.error('Fetch all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Create/update user record (called on login/signup)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if this is the admin account with correct credentials
    const isAdmin = email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() && 
                    password === ADMIN_CREDENTIALS.password;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name: name || email.split('@')[0],
        isAdmin,
        lastActive: new Date()
      });
    } else {
      user.lastActive = new Date();
      // Update admin status only if correct credentials provided
      user.isAdmin = isAdmin;
    }

    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

// Delete user and all their audits (protected - admin only)
router.delete('/admin/:userEmail', authenticate, requireAdmin, async (req, res) => {
  try {
    const { userEmail } = req.params;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'User email is required'
      });
    }

    // Delete all audits for this user
    const deleteAuditsResult = await Audit.deleteMany({ walletAddress: userEmail });

    // Delete the user
    const user = await User.findOneAndDelete({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${userEmail} and all their audits deleted successfully`,
      data: {
        user,
        auditsDeleted: deleteAuditsResult.deletedCount
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// Get user details with audits
router.get('/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const audits = await Audit.find({ walletAddress: userEmail }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user,
        audits,
        auditCount: audits.length
      }
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

export default router;
