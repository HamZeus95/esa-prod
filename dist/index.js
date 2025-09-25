"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fileURLToPath_1 = __importDefault(require("url"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const content_1 = __importDefault(require("./routes/content"));
const services_1 = __importDefault(require("./routes/services"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const clients_1 = __importDefault(require("./routes/clients"));
const heroVideo_1 = __importDefault(require("./routes/heroVideo"));
const teamMember_1 = __importDefault(require("./routes/teamMember"));
const aboutContent_1 = __importDefault(require("./routes/aboutContent"));
const aboutUs_1 = __importDefault(require("./routes/aboutUs"));
const service_1 = __importDefault(require("./routes/service"));
const expertiseDomain_1 = __importDefault(require("./routes/expertiseDomain"));
const contactInfo_1 = __importDefault(require("./routes/contactInfo"));
const media_1 = __importDefault(require("./routes/media"));
const users_1 = __importDefault(require("./routes/users"));
const videoProcessing_1 = __importDefault(require("./routes/videoProcessing"));
const seo_1 = __importDefault(require("./routes/seo"));
// Import middleware
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const auth_2 = require("./middleware/auth");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security middleware
app.use((0, helmet_1.default)({
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
const authLimiter = (0, express_rate_limit_1.default)({
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
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Cookie parsing middleware
app.use((0, cookie_parser_1.default)());
// Compression middleware
app.use((0, compression_1.default)());
// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
// Serve static files (uploads)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ESA Backend API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        version: process.env.npm_package_version || '1.0.0'
    });
});
// API Routes
//app.use('/api/auth/refresh'); // Apply lenient rate limiting to refresh endpoint
app.use('/api/auth', auth_1.default);
// Public routes (no authentication required)
app.use('/api/contacts', contacts_1.default); // Contact form should be public
app.use('/api/contact-info', contactInfo_1.default); // Contact info should be public
app.use('/api/hero-video', heroVideo_1.default); // Hero video should be public
app.use('/api/about-content', aboutContent_1.default); // About content should be public
app.use('/api/about-us', aboutUs_1.default); // About us should be public
app.use('/api/new-services', service_1.default); // Services should be public
app.use('/api/projects', projects_1.default); // Projects should be public (read-only)
app.use('/api/clients', clients_1.default); // Clients should be public
app.use('/api/team', teamMember_1.default); // Team should be public
app.use('/api/expertise-domains', expertiseDomain_1.default); // Expertise domains should be public
app.use('/api/seo', seo_1.default); // SEO routes should be public
// Protected admin routes (require authentication and password change)
app.use('/api/users', auth_2.authenticateToken, auth_2.requirePasswordChange, users_1.default);
app.use('/api/content', auth_2.authenticateToken, auth_2.requirePasswordChange, content_1.default);
app.use('/api/services', auth_2.authenticateToken, auth_2.requirePasswordChange, services_1.default);
app.use('/api/dashboard', auth_2.authenticateToken, auth_2.requirePasswordChange, dashboard_1.default);
app.use('/api/media', auth_2.authenticateToken, auth_2.requirePasswordChange, media_1.default);
app.use('/api/video-processing',auth_2.authenticateToken, auth_2.requirePasswordChange, videoProcessing_1.default);

// Serve static files from dist-frontend
app.use(express_1.default.static(path_1.default.join(__dirname, "../dist-frontend")));

// Handle React Router - serve index.html for all non-API routes
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }
    // Serve index.html for all other routes (React Router)
    res.sendFile(path_1.default.join(__dirname, "../dist-frontend", "index.html"));
});

// Error handling middleware (must be last)
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
// Database connection
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/esa_database';
        await mongoose_1.default.connect(mongoUri, {
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
        const { User } = await Promise.resolve().then(() => __importStar(require('./models/User')));
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
    mongoose_1.default.connection.close().then(() => {
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
// Static files for frontend
//app.use(express.static(path.join(process.cwd(), "dist")));
//app.get("/*", function (req, res) {
//  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
//});
startServer().catch(console.error);
exports.default = app;
//# sourceMappingURL=index.js.map