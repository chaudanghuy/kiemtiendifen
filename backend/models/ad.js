const mongoose = require('mongoose');

// define the Ad model schema
const adSchema = mongoose.Schema({
    name: {
        type: String,
        index: { unique: true }
    },
    content: {
        type: String,
        default: ''
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        default: Date.now
    },
    is_active: {
        type: Boolean,
        default: false
    }
});

adSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

adSchema.set('toJSON', {
    virtual: true
});

exports.Ad = mongoose.model('Ad', adSchema);