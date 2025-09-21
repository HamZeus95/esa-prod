import mongoose, { Schema } from 'mongoose';
const contentSchema = new Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        enum: ['home', 'about', 'services', 'settings']
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});
export const Content = mongoose.model('Content', contentSchema);
//# sourceMappingURL=GenericContent.js.map