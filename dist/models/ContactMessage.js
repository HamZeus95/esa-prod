import mongoose, { Schema } from 'mongoose';
const contactNoteSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });
const contactMessageSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    projectType: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
        maxlength: 2000
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied', 'archived'],
        default: 'unread'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: [contactNoteSchema]
}, {
    timestamps: true
});
// Index for better query performance
contactMessageSchema.index({ status: 1, priority: 1 });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ email: 1 });
// Virtual for response time tracking
contactMessageSchema.virtual('responseTime').get(function () {
    if (this.status === 'replied' && this.updatedAt && this.createdAt) {
        return this.updatedAt.getTime() - this.createdAt.getTime();
    }
    return null;
});
// Pre-save hook to auto-assign priority based on keywords
contactMessageSchema.pre('save', function (next) {
    if (this.isNew && this.priority === 'medium') {
        const urgentKeywords = ['urgent', 'emergency', 'immediate', 'asap', 'critical'];
        const lowKeywords = ['general inquiry', 'information', 'question'];
        const messageText = this.message.toLowerCase();
        if (urgentKeywords.some(keyword => messageText.includes(keyword))) {
            this.priority = 'high';
        }
        else if (lowKeywords.some(keyword => messageText.includes(keyword))) {
            this.priority = 'low';
        }
    }
    next();
});
export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
//# sourceMappingURL=ContactMessage.js.map