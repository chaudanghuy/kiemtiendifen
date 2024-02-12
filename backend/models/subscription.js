const mongoose = require('mongoose');

// define the Subscription model schema
const subscriptionSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subscription_date: {
        type: Date,
        default: Date.now
    },
    expiry_date: {
        type: Date,
        default: Date.now
    }
});

subscriptionSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

subscriptionSchema.set('toJSON', {
    virtual: true
});

exports.Subscription = mongoose.model('Subscription', subscriptionSchema);