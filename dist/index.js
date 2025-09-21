import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contacts.js';
import contentRoutes from './routes/content.js';
import serviceRoutes from './routes/services.js';
import dashboardRoutes from './routes/dashboard.js';
import clientRoutes from './routes/clients.js';
import heroVideoRoutes from './routes/heroVideo.js';
import teamMemberRoutes from './routes/teamMember.js';
import aboutContentRoutes from './routes/aboutContent.js';
import aboutUsRoutes from './routes/aboutUs.js';
import newServiceRoutes from './routes/service.js';
import expertiseDomainRoutes from './routes/expertiseDomain.js';
import contactInfoRoutes from './routes/contactInfo.js';
import mediaRoutes from './routes/media.js';
import userRoutes from './routes/users.js';
// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { requirePasswordChange, authenticateToken } from './middleware/auth.js';
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Rate limiting
// const limiter = rateLimit({
//   windowMs: process.env.NODE_ENV === "development" ? 15 * 60 * 10000000 : 5 * 60 * 1000, // 15 minutes for development, 5 minutes for production
//   max: process.env.NODE_ENV === "development" ? 1000000 : 100, // 1 million for development, 100 for production
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);
// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: process.env.NODE_ENV === "development" ? 15 * 600 * 1000000 : 5 * 60 * 1000, // 15 minutes for development, 5 minutes for production
    max: process.env.NODE_ENV === "development" ? 5000000 : 50, // 5 million for development, 50 for production
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
});
// More lenient rate limiting for refresh token endpoint
// const refreshLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 100, // Allow more refresh attempts
//   message: 'Too many refresh attempts, please try again later.',
//   skipSuccessfulRequests: true,
// });
// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Cookie parsing middleware
app.use(cookieParser());
// Compression middleware
app.use(compression());
// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
else {
    app.use(morgan('combined'));
}
// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ESA Backend API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API Routes
//app.use('/api/auth/refresh'); // Apply lenient rate limiting to refresh endpoint
app.use('/api/auth', authRoutes);
// Public routes (no authentication required)
app.use('/api/contacts', contactRoutes); // Contact form should be public
app.use('/api/contact-info', contactInfoRoutes); // Contact info should be public
app.use('/api/hero-video', heroVideoRoutes); // Hero video should be public
app.use('/api/about-content', aboutContentRoutes); // About content should be public
app.use('/api/about-us', aboutUsRoutes); // About us should be public
app.use('/api/new-services', newServiceRoutes); // Services should be public
app.use('/api/projects', projectRoutes); // Projects should be public (read-only)
app.use('/api/clients', clientRoutes); // Clients should be public
app.use('/api/team', teamMemberRoutes); // Team should be public
app.use('/api/expertise-domains', expertiseDomainRoutes); // Expertise domains should be public
// Protected admin routes (require authentication and password change)
app.use('/api/users', authenticateToken, requirePasswordChange, userRoutes);
app.use('/api/content', authenticateToken, requirePasswordChange, contentRoutes);
app.use('/api/services', authenticateToken, requirePasswordChange, serviceRoutes);
app.use('/api/dashboard', authenticateToken, requirePasswordChange, dashboardRoutes);
app.use('/api/media', authenticateToken, requirePasswordChange, mediaRoutes);

// Serve static files from dist-frontend
app.use(express.static(path.join(__dirname, "../dist-frontend")));

// Handle React Router - serve index.html for all non-API routes
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }
    // Serve index.html for all other routes (React Router)
    res.sendFile(path.join(__dirname, "../dist-frontend", "index.html"));
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);
// Database connection
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/esa_database';
        await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        });
        console.log('✅ MongoDB connected successfully');
        // Create admin user if it doesn't exist
        await createAdminUser();
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
// Create default admin user
const createAdminUser = async () => {
    try {
        const { User } = await import('./models/User.js');
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const adminUser = new User({
                email: process.env.ADMIN_EMAIL || 'admin@esa-structures.tn',
                password: process.env.ADMIN_PASSWORD || 'admin123',
                name: 'ESA Admin',
                role: 'admin',
                status: 'active'
            });
            await adminUser.save();
            console.log('✅ Default admin user created');
        }
    }
    catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
};
// Graceful shutdown
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    mongoose.connection.close().then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// Start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 ESA Backend API running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
        console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    });
};

startServer().catch(console.error);
export default app;
//# sourceMappingURL=index.js.map