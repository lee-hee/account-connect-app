import React, { useState } from 'react';
import Login from './components/Login';
import AccountantDashboard from './components/AccountantDashboard';
import ClientRegistrationForm from './components/ClientRegistrationForm'; // Your existing client registration component

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    // Handle successful login
    const handleLoginSuccess = (data) => {
        console.log('Login successful, user data:', data);
        setUserData(data);
        setIsAuthenticated(true);
    };

    // Handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserData(null);
    };

    // Not logged in - show login page
    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    // Logged in - route based on user role
    const userRole = userData?.userRole;

    switch (userRole) {
        case 'ACCOUNTANT':
            return <AccountantDashboard userData={userData} onLogout={handleLogout} />;

        case 'CLIENT':
            return <ClientRegistrationForm userData={userData} onLogout={handleLogout} />;

        default:
            // Fallback for unknown roles
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid User Role</h2>
                        <p className="text-gray-600 mb-6">
                            Your account role ({userRole || 'unknown'}) is not recognized. Please contact support.
                        </p>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            );
    }
}

export default App;