const mongoose = require('mongoose');

// define the Category model schema
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        index: { unique: true }
    }
});

categorySchema.virtual('id').get(function() {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtual: true
});

exports.Category = mongoose.model('Category', categorySchema);