const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    source: {
        type: String,
        required: true,
        enum: ['Website', 'LinkedIn', 'Referral', 'Email', 'Phone', 'Other'],
        default: 'Website'
    },
    status: {
        type: String,
        required: true,
        enum: ['New', 'Contacted', 'Converted', 'Lost'],
        default: 'New'
    },
    notes: [NoteSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
LeadSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Lead', LeadSchema);