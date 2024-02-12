const { mongo, default: mongoose } = require('mongoose');
const { Article } = require('../models/article');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function(req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async(req, res) => {
    articleList = await Article.find();
    if (!articleList) {
        res.status(500).json({ success: false });
    }

    res.send(articleList);
});

router.post(`/`, uploadOptions.single('image'), async(req, res) => {

    const category = await Category.findById(req.body.category_id);
    if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const fileName = req.file.filename;
    let article = new Article({
        title: req.body.title,
        body: req.body.body,
        author_id: req.body.author_id,
        published: req.body.published,
        category_id: req.body.category_id,
        main_photo: `${basePath}${fileName}`,
        keyword: req.body.keyword,
        created_at: req.body.created_at
    });

    article = await article.save();

    if (!article) {
        return res.status(400).send('The article cannot be created!');
    }

    res.send(article);
});

router.put('/:id', async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Article Id');
    }

    const category = await Category.findById(req.body.category_id);
    if (!category) return res.status(400).send('Invalid Category');

    const article = await Article.findById(req.params.id);
    if (!article) return res.status(400).send('Invalid Article');

    const file = req.file;
    let imagePath;
    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagePath = `${basePath}${fileName}`;
    } else {
        imagePath = article.main_photo;
    }

    const updatedArticle = await Article.findByIdAndUpdate(
        req.params.id, {
            title: req.body.title,
            body: req.body.body,
            author_id: req.body.author_id,
            published: req.body.published,
            category_id: req.body.category_id,
            main_photo: req.body.main_photo,
            keyword: req.body.keyword,
            created_at: req.body.created_at
        }, { new: true }
    );

    if (!updatedArticle) {
        return res.status(400).send('The article cannot be updated!');
    }

    res.send(updatedArticle);
});

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Article Id');
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map(file => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    const article = await Article.findByIdAndUpdate(
        req.params.id, {
            images: imagesPaths
        }, { new: true }
    );

    if (!article) {
        return res.status(400).send('The article cannot be updated!');
    }

    res.send(article);
});

module.exports = router;