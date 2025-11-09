import React from 'react';
import { Users, FileText, Calendar, Settings, LogOut, Plus, Search } from 'lucide-react';

const AccountantDashboard = ({ userData, onLogout }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Account Connect</h1>
                            <p className="text-sm text-gray-600">Tax Agent Portal</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {userData.firstName} {userData.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{userData.email}</p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {userData.firstName}!
                    </h2>
                    <p className="text-gray-600">
                        Manage your clients and their tax information from your dashboard.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <QuickActionCard
                        icon={<Plus size={24} />}
                        title="New Client"
                        description="Add a new client"
                        color="blue"
                    />
                    <QuickActionCard
                        icon={<Search size={24} />}
                        title="Find Client"
                        description="Search client records"
                        color="green"
                    />
                    <QuickActionCard
                        icon={<FileText size={24} />}
                        title="Documents"
                        description="View all documents"
                        color="purple"
                    />
                    <QuickActionCard
                        icon={<Calendar size={24} />}
                        title="Appointments"
                        description="Manage schedule"
                        color="orange"
                    />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Clients */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
                                <button className="text-sm text-indigo-600 hover:text-indigo-700">
                                    View all
                                </button>
                            </div>
                            <div className="space-y-3">
                                <EmptyState
                                    icon={<Users size={48} />}
                                    message="No clients yet"
                                    description="Start by adding your first client"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <StatCard
                            title="Total Clients"
                            value="0"
                            icon={<Users size={20} />}
                            color="blue"
                        />
                        <StatCard
                            title="Pending Reviews"
                            value="0"
                            icon={<FileText size={20} />}
                            color="yellow"
                        />
                        <StatCard
                            title="Completed This Month"
                            value="0"
                            icon={<Calendar size={20} />}
                            color="green"
                        />
                    </div>
                </div>

                {/* Notifications/Updates Section */}
                <div className="mt-6 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <EmptyState
                        icon={<FileText size={48} />}
                        message="No recent activity"
                        description="Activity will appear here as you work with clients"
                    />
                </div>
            </main>
        </div>
    );
};

// Quick Action Card Component
const QuickActionCard = ({ icon, title, description, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
        green: 'bg-green-50 text-green-600 hover:bg-green-100',
        purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
        orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    };

    return (
        <button className={`${colorClasses[color]} p-6 rounded-lg transition-colors text-left w-full`}>
            <div className="mb-3">{icon}</div>
            <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </button>
    );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        green: 'bg-green-50 text-green-600'
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{title}</span>
                <div className={`${colorClasses[color]} p-2 rounded-lg`}>
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

// Empty State Component
const EmptyState = ({ icon, message, description }) => {
    return (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 text-gray-400">
                {icon}
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-1">{message}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
};

export default AccountantDashboard;