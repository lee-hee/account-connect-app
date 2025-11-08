import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ClientRegistrationForm from './components/ClientRegistrationForm';
import Dashboard from './components/Dashboard';
import AccountantSignup from './components/AccountantSignup';

function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in (from localStorage or session)
    useEffect(() => {
        const checkAuth = () => {
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
        };

        checkAuth();
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        // Store user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const handleRegistrationComplete = () => {
        // Update user's registration status
        const updatedUser = { ...user, registrationCompleted: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Public route - Accountant Signup */}
                <Route path="/accountant/signup" element={<AccountantSignup />} />
                
                {/* Protected routes based on authentication and registration status */}
                <Route 
                    path="/*" 
                    element={
                        !user ? (
                            // Not logged in - show login
                            <Login onLoginSuccess={handleLoginSuccess} />
                        ) : !user.registrationCompleted ? (
                            // Logged in but registration incomplete - show registration form
                            <ClientRegistrationForm
                                user={user}
                                onRegistrationComplete={handleRegistrationComplete}
                                onLogout={handleLogout}
                            />
                        ) : (
                            // Logged in and registration complete - show dashboard
                            <Dashboard user={user} onLogout={handleLogout} />
                        )
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;
