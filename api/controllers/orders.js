const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next)=>{
    Order.find().select('-__v')
    .populate('product', 'name')
    .then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc=>{
                return {
                    productId: doc.product,
                    quantity: doc.quantity,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'https://shiny-potato-jwgx6v7699v35vv-3000.app.github.dev/orders/' + doc._id
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

exports.orders_create_order = (req, res, next)=>{
    Product.findById(req.body.productId)
    .then(product => {
        if (product){
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: product._id,
                quantity: req.body.quantity
            });
            return order.save()
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided id'
            });
        }
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order created',
            orderCreated: {
                productId: result.product,
                quantity: result.quantity,
                _id: result._id
            },
            request: {
                type: 'GET',
                url: 'https://shiny-potato-jwgx6v7699v35vv-3000.app.github.dev/orders/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Product not found',
            error: err
        });
    });
    
}

exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .select('-__v')
    .populate('product', '-__v')
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json({
                message: 'Order details',
                order: doc,
                request: {
                    type: 'GET',
                    description: 'Get all orders',
                    url: 'https://shiny-potato-jwgx6v7699v35vv-3000.app.github.dev/orders/'
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

exports.orders_delete_order = (req, res, next)=>{
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
    .then(result => {
        if (result.deletedCount >=1 ){
            res.status(200).json({
                message: 'Order deleted',
                result: result,
                request: {
                    type: 'POST',
                    url: 'https://shiny-potato-jwgx6v7699v35vv-3000.app.github.dev/orders/',
                    body: {
                        productId: 'String',
                        quantity: 'Number'
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