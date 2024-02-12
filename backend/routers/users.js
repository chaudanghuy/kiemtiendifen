const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async(req, res) => {
    const userList = await User.find().select('-passwordHash');
    if (!userList) {
        res.status(500).json({ success: false });
    }

    res.send(userList);
});

router.get('/:id', async(req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
        res.status(500).json({ message: 'The user with the given ID was not found.' });

    }
    res.status(200).send(user);
});

router.post('/register', async(req, res) => {
    let user = new User({
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        profile: req.body.profile,
        address: req.body.address,
        history: req.body.history
    });

    user = await user.save();

    if (!user) {
        return res.status(400).send('The user cannot be created!');
    }

    res.send(user);
});

router.post('/login', async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.SECRET_KEY;
    if (!user) {
        return res.status(400).send('The user not found');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
                userId: user.id
            },
            secret, { expiresIn: '1d' }
        );
        res.status(200).send({ user: user.email, token: token });
    } else {
        res.status(400).send('The password is wrong!');
    }
});

module.exports = router;