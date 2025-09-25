"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const clientSchema = new mongoose_1.default.Schema({
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
exports.Client = mongoose_1.default.model('Client', clientSchema);
//# sourceMappingURL=Client.js.map