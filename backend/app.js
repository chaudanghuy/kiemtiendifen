const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authJwt = require('./helpers/jwt');
const api = process.env.API_URL;
const articleRouter = require('./routers/articles');
const userRouter = require('./routers/users');
const categoryRouter = require('./routers/categories');
const crawlRouter = require('./routers/crawl');

// cors
app.use(cors());
app.options('*', cors());

// middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Unauthorized' });
    }
    next();
});

// routers
app.use(`${api}/articles`, articleRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/crawl`, crawlRouter);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Database connection is ready...');
    })
    .catch((err) => {
        console.log(err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running...');
});

app.use("/public", express.static(path.join(__dirname, "public")));