import User from '../models/User.model.js';

/**
 * Authenticate user based on email (from request header)
 * Validates that the user exists in the database
 */
export const authenticate = async (req, res, next) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        error: 'User email is required in headers (x-user-email)'
      });
    }

    // Verify user exists in database
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * Check if authenticated user is an admin
 * Must be called after authenticate middleware
 */
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({
      success: false,
      error: 'Authorization failed'
    });
  }
};

/**
 * Optional authentication - doesn't fail if user not authenticated
 * Useful for endpoints that work both authenticated and unauthenticated
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (userEmail) {
      const user = await User.findOne({ email: userEmail });
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // Continue even if error
  }
};
