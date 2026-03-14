import express from 'express';
import User from '../models/User.model.js';
import Audit from '../models/Audit.model.js';

const router = express.Router();

// Get all users
router.get('/admin/all', async (req, res) => {
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
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name: name || email.split('@')[0],
        lastActive: new Date()
      });
    } else {
      user.lastActive = new Date();
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

// Delete user and all their audits
router.delete('/admin/:userEmail', async (req, res) => {
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
