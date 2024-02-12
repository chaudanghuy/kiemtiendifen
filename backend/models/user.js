const mongoose = require('mongoose');

// define the User model schema
const userSchema = mongoose.Schema({
    email: {
        type: String,
        index: { unique: true }
    },
    passwordHash: String,
    profile: {
        name: { type: String, default: '' },
        picture: { type: String, default: '' }
    },
    address: String,
    history: [{
        date: Date,
        paid: { type: Number, default: 0 },
    }]
});

userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtual: true
});


exports.User = mongoose.model('User', userSchema);