import { Project } from '../models/Project.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { User } from '../models/User.js';
// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
    try {
        // Project statistics
        const totalProjects = await Project.countDocuments();
        const activeProjects = await Project.countDocuments({ status: 'active' });
        const completedProjects = await Project.countDocuments({ status: 'completed' });
        const featuredProjects = await Project.countDocuments({ featured: true });
        // Contact statistics
        const totalMessages = await ContactMessage.countDocuments();
        const unreadMessages = await ContactMessage.countDocuments({ status: 'unread' });
        const recentMessages = await ContactMessage.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });
        // User statistics
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        // Recent projects (last 5)
        const recentProjects = await Project.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title status createdAt featured')
            .lean();
        // Recent messages (last 5)
        const recentContactMessages = await ContactMessage.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email projectType status priority createdAt')
            .lean();
        // Monthly project creation stats (last 12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const monthlyProjects = await Project.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);
        // Monthly contact stats (last 12 months)
        const monthlyContacts = await ContactMessage.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);
        // Project status distribution
        const projectStatusStats = await Project.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        // Contact priority distribution
        const contactPriorityStats = await ContactMessage.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);
        const stats = {
            projects: {
                total: totalProjects,
                active: activeProjects,
                completed: completedProjects,
                featured: featuredProjects,
                recent: recentProjects,
                monthlyStats: monthlyProjects,
                statusDistribution: projectStatusStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {})
            },
            contacts: {
                total: totalMessages,
                unread: unreadMessages,
                recentWeek: recentMessages,
                recent: recentContactMessages,
                monthlyStats: monthlyContacts,
                priorityDistribution: contactPriorityStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {})
            },
            users: {
                total: totalUsers,
                active: activeUsers
            },
            summary: {
                totalProjects,
                totalMessages,
                unreadMessages,
                recentActivity: {
                    projects: recentProjects.length,
                    messages: recentContactMessages.length
                }
            }
        };
        res.status(200).json({
            success: true,
            data: stats,
            message: 'Dashboard statistics retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// @desc    Get recent activity
// @route   GET /api/dashboard/activity
// @access  Private (Admin)
export const getRecentActivity = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const days = parseInt(req.query.days) || 7;
        const dateFilter = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        // Get recent projects
        const recentProjects = await Project.find({
            createdAt: { $gte: dateFilter }
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('title status createdAt')
            .lean();
        // Get recent contacts
        const recentContacts = await ContactMessage.find({
            createdAt: { $gte: dateFilter }
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('name email projectType status createdAt')
            .lean();
        // Combine and sort all activities
        const activities = [
            ...recentProjects.map(project => ({
                type: 'project',
                title: `New project: ${project.title}`,
                data: project,
                timestamp: project.createdAt
            })),
            ...recentContacts.map(contact => ({
                type: 'contact',
                title: `New message from ${contact.name}`,
                data: contact,
                timestamp: contact.createdAt
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
        res.status(200).json({
            success: true,
            data: activities,
            message: 'Recent activity retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get recent activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// @desc    Get system health
// @route   GET /api/dashboard/health
// @access  Private (Admin)
export const getSystemHealth = async (req, res) => {
    try {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: {
                status: 'connected',
                responseTime: Date.now()
            },
            server: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: process.version,
                environment: process.env.NODE_ENV || 'development'
            },
            api: {
                version: '1.0.0',
                endpoints: {
                    total: 50, // Approximate count
                    healthy: 50
                }
            }
        };
        // Test database connection
        const dbStartTime = Date.now();
        await Project.findOne().limit(1);
        health.database.responseTime = Date.now() - dbStartTime;
        res.status(200).json({
            success: true,
            data: health,
            message: 'System health retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get system health error:', error);
        res.status(500).json({
            success: false,
            data: {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: 'Database connection failed'
            },
            message: 'System health check failed'
        });
    }
};
//# sourceMappingURL=dashboard.js.map