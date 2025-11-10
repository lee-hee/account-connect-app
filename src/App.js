import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AccountantDashboard from './components/accountant/AccountantDashboard';
import ClientRegistrationForm from './components/client/ClientRegistrationForm';
import AccountantSignup from './components/accountant/AccountantSignup';
import Dashboard from './components/client/Dashboard';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    // Handle successful login for both accountants and clients
    const handleLoginSuccess = (data) => {
        console.log('Login successful, user data:', data);

        // Normalize the user data structure for both user types
        const accountConnectUser = {
            ...data,
            // For clients: use externalId as clientId if it exists
            clientId: data.userRole === 'CLIENT' ? (data.externalId || data.clientId || null) : null,
            // For accountants: use externalId as accountantId if it exists
            accountantId: data.userRole === 'ACCOUNTANT' ? (data.externalId || data.accountantId || null) : null,
        };

        console.log('Account Connect User:', accountConnectUser);

        setUserData(accountConnectUser);
        setIsAuthenticated(true);
    };

    // Handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserData(null);
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to={getDefaultRoute(userData?.userRole, userData)} replace />
                        ) : (
                            <Login onLoginSuccess={handleLoginSuccess} />
                        )
                    }
                />

                <Route
                    path="/accountant/signup"
                    element={<AccountantSignup />}
                />

                {/* Protected Routes - Accountant */}
                <Route
                    path="/accountant/dashboard"
                    element={
                        isAuthenticated && userData?.userRole === 'ACCOUNTANT' ? (
                            <AccountantDashboard userData={userData} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Protected Routes - Client */}
                <Route
                    path="/client/registration"
                    element={
                        isAuthenticated && userData?.userRole === 'CLIENT' ? (
                            <ClientRegistrationForm userData={userData} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/client/dashboard"
                    element={
                        isAuthenticated && userData?.userRole === 'CLIENT' ? (
                            <Dashboard userData={userData} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Default Route */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to={getDefaultRoute(userData?.userRole, userData)} replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Catch-all route for 404 */}
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">404 - Page Not Found</h2>
                                <p className="text-gray-600 mb-6">
                                    The page you're looking for doesn't exist.
                                </p>

                            <a href="/login"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block">
                                Go to Login
                            </a>
                        </div>
                        </div>
                    }
                    />
            </Routes>
        </Router>
    );
}

// Helper function to get default route based on user role and registration status
function getDefaultRoute(userRole, accountConnectUser) {
    switch (userRole) {
        case 'ACCOUNTANT':
            return '/accountant/dashboard';
        case 'CLIENT':
            // Check if client has completed registration
            if (accountConnectUser?.registrationComplete === true) {
                return '/client/dashboard';
            } else {
                return '/client/registration';
            }
        default:
            return '/login';
    }
}

export default App;