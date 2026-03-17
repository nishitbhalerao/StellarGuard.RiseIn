import { useAuth } from '../context/AuthContext';

/**
 * Admin API Service - Handles requests to admin endpoints with proper authentication headers
 */
export const createAdminApiService = (user) => {
  const getHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Add user email header for authentication if user is logged in
    if (user && user.email) {
      headers['x-user-email'] = user.email;
    }

    return headers;
  };

  return {
    /**
     * Fetch all users (admin only)
     */
    fetchAllUsers: async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/admin/all', {
          method: 'GET',
          headers: getHeaders()
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch users');
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },

    /**
     * Fetch all audits (admin only)
     */
    fetchAllAudits: async () => {
      try {
        const response = await fetch('http://localhost:3000/api/audit/admin/all', {
          method: 'GET',
          headers: getHeaders()
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch audits');
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching audits:', error);
        throw error;
      }
    },

    /**
     * Delete user by email (admin only)
     */
    deleteUser: async (userEmail) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/user/admin/${encodeURIComponent(userEmail)}`,
          {
            method: 'DELETE',
            headers: getHeaders()
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete user');
        }

        return await response.json();
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },

    /**
     * Delete audit by ID (admin only)
     */
    deleteAudit: async (auditId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/audit/admin/${encodeURIComponent(auditId)}`,
          {
            method: 'DELETE',
            headers: getHeaders()
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete audit');
        }

        return await response.json();
      } catch (error) {
        console.error('Error deleting audit:', error);
        throw error;
      }
    },

    /**
     * Get user details with audits
     */
    fetchUserDetails: async (userEmail) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/user/${encodeURIComponent(userEmail)}`,
          {
            method: 'GET',
            headers: getHeaders()
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch user details');
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }
    },

    /**
     * Get audit details
     */
    fetchAuditDetails: async (auditId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/audit/${encodeURIComponent(auditId)}`,
          {
            method: 'GET',
            headers: getHeaders()
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch audit');
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching audit:', error);
        throw error;
      }
    }
  };
};

/**
 * Hook for using admin API service
 */
export const useAdminApi = () => {
  const { user } = useAuth();
  return createAdminApiService(user);
};
