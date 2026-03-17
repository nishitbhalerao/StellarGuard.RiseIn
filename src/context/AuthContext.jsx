import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Verify user still exists in backend and get updated admin status
        verifyAndSyncUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyAndSyncUser = async (userData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${userData.email}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.user) {
          // Update user with latest backend data
          const updatedUser = {
            ...userData,
            isAdmin: data.data.user.isAdmin
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error verifying user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        // Basic validation - just check email format
        if (!email || !password) {
          reject(new Error('Email and password are required'));
          return;
        }

        // Simulate API call - in production, validate against backend
        setTimeout(async () => {
          try {
            const userData = {
              id: Math.random().toString(36).substr(2, 9),
              email,
              name: email.split('@')[0],
              isAdmin: false // Will be updated from backend
            };
            
            // Register user in backend - IMPORTANT: Send password so backend can verify admin credentials
            const registerResponse = await fetch('http://localhost:3000/api/user/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                email, 
                password, // Send password for admin verification
                name: userData.name 
              })
            });

            if (registerResponse.ok) {
              const registerData = await registerResponse.json();
              if (registerData.success && registerData.data) {
                // Get isAdmin status from backend
                userData.isAdmin = registerData.data.isAdmin || false;
              }
            }
            
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            resolve(userData);
          } catch (error) {
            console.error('Error registering user:', error);
            reject(new Error('Login failed. Please try again.'));
          }
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
  };

  const signup = (email, password, confirmPassword) => {
    return new Promise((resolve, reject) => {
      try {
        if (password !== confirmPassword) {
          reject(new Error('Passwords do not match'));
          return;
        }

        // Simulate API call - in production, this would call your backend
        setTimeout(async () => {
          try {
            const userData = {
              id: Math.random().toString(36).substr(2, 9),
              email,
              name: email.split('@')[0],
              isAdmin: false // Will be updated from backend
            };
            
            // Register user in backend - Send password for admin verification
            const registerResponse = await fetch('http://localhost:3000/api/user/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                email, 
                password, // Send password for admin verification
                name: userData.name 
              })
            });

            if (registerResponse.ok) {
              const registerData = await registerResponse.json();
              if (registerData.success && registerData.data) {
                // Get isAdmin status from backend
                userData.isAdmin = registerData.data.isAdmin || false;
              }
            }
            
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            resolve(userData);
          } catch (error) {
            console.error('Error registering user:', error);
            reject(new Error('Signup failed. Please try again.'));
          }
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
