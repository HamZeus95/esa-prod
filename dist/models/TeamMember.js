import mongoose, { Schema } from 'mongoose';
// Team Member Schema
const teamMemberSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
        maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    position: {
        type: String,
        required: [true, 'Le poste est requis'],
        trim: true,
        maxlength: [100, 'Le poste ne peut pas dépasser 100 caractères']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
    },
    image: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Format d\'email invalide']
    },
    phone: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0,
        min: [0, 'L\'ordre doit être un nombre positif']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    department: {
        type: String,
        trim: true,
        maxlength: [50, 'Le département ne peut pas dépasser 50 caractères']
    },
    hierarchy: {
        type: String,
        enum: ['executive', 'senior', 'engineer', 'technician'],
        default: 'engineer',
        required: [true, 'La hiérarchie est requise']
    }
}, {
    timestamps: true
});
// Index for efficient querying
teamMemberSchema.index({ order: 1, isActive: 1 });
teamMemberSchema.index({ hierarchy: 1, order: 1 });
teamMemberSchema.index({ managerId: 1 });
export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
//# sourceMappingURL=TeamMember.js.map