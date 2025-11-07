import React from 'react';
import { User, FileText, Settings, LogOut, CheckCircle } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Account Connect</h1>
                            <p className="text-sm text-gray-600">Client Dashboard</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome Banner */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-start">
                        <CheckCircle className="text-green-500 mr-4 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Welcome back, {user.email}!
                            </h2>
                            <p className="text-gray-600">
                                Your registration is complete. You can now access all features of your account.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <User className="text-indigo-600" size={24} />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-gray-800">My Profile</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            View and update your personal information and contact details.
                        </p>
                    </div>

                    {/* Documents Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FileText className="text-green-600" size={24} />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-gray-800">My Documents</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Access your tax returns, financial statements, and other documents.
                        </p>
                    </div>

                    {/* Settings Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Settings className="text-purple-600" size={24} />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-gray-800">Settings</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Manage your account settings, notifications, and preferences.
                        </p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center py-3 border-b border-gray-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">Registration completed</p>
                                <p className="text-xs text-gray-500">All required information has been submitted</p>
                            </div>
                            <span className="text-xs text-gray-500">Today</span>
                        </div>
                        <div className="flex items-center py-3 border-b border-gray-200">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">Account created</p>
                                <p className="text-xs text-gray-500">Your account has been successfully created</p>
                            </div>
                            <span className="text-xs text-gray-500">Today</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;