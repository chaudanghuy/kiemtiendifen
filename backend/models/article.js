const mongoose = require('mongoose');

// define the Article model schema
const articleSchema = mongoose.Schema({
    title: String,
    body: String,
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    published: {
        type: Boolean,
        default: false
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    images: [String],
    main_photo: String,
    keyword: String,
    created_at: {
        type: Date,
        default: Date.now
    },
});

articleSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

articleSchema.set('toJSON', {
    virtual: true
});

exports.Article = mongoose.model('Article', articleSchema);