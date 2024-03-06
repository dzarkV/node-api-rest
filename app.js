
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

mongoose.connect(process.env.MONGO_CONN_STR)
//Here we define middleware settings

// Morgan to allow api log
app.use(morgan('dev'));
// Become uploads static folder
app.use('/uploads', express.static('uploads'));
// Body parser to allow receive json body and urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Allow CORS accees
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Adding prefix to endpoints routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

// Handling general errors from middleware
app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;