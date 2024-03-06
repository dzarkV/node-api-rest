const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res, next)=>{
    Product.find()
    .select('-__v')
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc=>{
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'https://shiny-potato-jwgx6v7699v35vv-3000.app.github.dev/products/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    });
}

exports.products_create_product = (req, res, next)=>{
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product saved',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                    url: 'https://shiny-potato-jwgx6v7699v35vv-3000.app.github.dev/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('-__v')
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'https://shiny-potato-jwgx6v7699v35vv-3000.app.github.dev/products/'
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided id'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_update_product = (req, res, next)=>{
    const id = req.params.productId;

    Product.findById(id)
    .then(product => {
        if(product){
            if (req.body.name) product.name = req.body.name;
            if (req.body.price) product.price = req.body.price;
            product.save()
            .then(result =>{
                res.status(200).json({
                    message: 'Product updated',
                    result: result
                });
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided id'
            });
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
   
}

exports.products_delete_product = (req, res, next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .then(result => {
        if (result.deletedCount >=1 ){
            res.status(200).json({
                message: 'Product deleted',
                result: result,
                request: {
                    type: 'POST',
                    url: 'https://shiny-potato-jwgx6v7699v35vv-3000.app.github.dev/products/',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided id'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}