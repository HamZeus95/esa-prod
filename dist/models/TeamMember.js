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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMember = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Team Member Schema
const teamMemberSchema = new mongoose_1.Schema({
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
exports.TeamMember = mongoose_1.default.model('TeamMember', teamMemberSchema);
//# sourceMappingURL=TeamMember.js.map