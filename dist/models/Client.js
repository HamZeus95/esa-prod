import mongoose from 'mongoose';
const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    image: {
        type: String,
        required: false // Make image optional
    },
    type: {
        type: String,
        enum: ['client', 'partner'],
        required: [true, 'Client type is required'],
        default: 'client'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Index for better query performance
clientSchema.index({ type: 1, order: 1 });
clientSchema.index({ isActive: 1 });
export const Client = mongoose.model('Client', clientSchema);
//# sourceMappingURL=Client.js.map