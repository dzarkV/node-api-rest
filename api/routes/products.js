const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', (req, res, next)=>{
    Product.find()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    });
});

router.post('/', (req, res, next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product saved',
            createdProduct: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json(doc);
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
});

router.patch('/:productId', (req, res, next)=>{
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
   
});

router.delete('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            result: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;