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
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        // Check if login credentials match admin credentials
        const isAdmin = email === 'bhaleraonishit@gmail.com' && password === 'nishit@stellarguard2026';

        // Simulate API call - in production, this would call your backend
        setTimeout(async () => {
          const userData = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
            isAdmin: isAdmin
          };
          
          // Register user in backend
          try {
            await fetch('http://localhost:3000/api/user/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, name: userData.name })
            });
          } catch (error) {
            console.error('Error registering user:', error);
          }
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          resolve(userData);
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
          const userData = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
            isAdmin: false
          };
          
          // Register user in backend
          try {
            await fetch('http://localhost:3000/api/user/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, name: userData.name })
            });
          } catch (error) {
            console.error('Error registering user:', error);
          }
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          resolve(userData);
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
