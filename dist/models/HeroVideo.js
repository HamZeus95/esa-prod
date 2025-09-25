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
exports.HeroVideo = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const heroVideoSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: false,
        maxlength: 500
    },
    videoUrl: {
        type: String,
        required: true
    },
    videoUrlWebm: {
        type: String,
        required: false
    },
    thumbnailUrl: {
        type: String,
        required: false
    },
    duration: {
        type: Number,
        required: false
    },
    fileSize: {
        mp4: {
            type: Number,
            required: false
        },
        webm: {
            type: Number,
            required: false
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Ensure only one hero video exists (singleton pattern)
heroVideoSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Delete any existing hero video before creating a new one
        await mongoose_1.default.model('HeroVideo').deleteMany({});
    }
    next();
});
exports.HeroVideo = mongoose_1.default.model('HeroVideo', heroVideoSchema);
//# sourceMappingURL=HeroVideo.js.map