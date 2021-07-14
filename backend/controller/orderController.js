const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError');
const order = require('../models/order');


// create a new order  => /api/v1/order/new
exports.newOrder = catchAsyncError(async (req,res,next)=>{
    const{
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentinfo,
    }=req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentinfo,
        paidAt:Date.now(),
        user:req.user._id
    })

    res.status(200).json({
        success:true,
        order
    })
})

//get single order => /api/v1/orders/:id
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order =await Order.findById(req.params.id).populate('user','name email');

    if(!order){
        return next(new ErrorHandler('No order found with this id',404))
    }
    res.status(200).json({
        success:true,
        order
    })
})

//get logged in user orders  => /api/v1/orders/me
exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const orders =await Order.find({user:req.user.id});

    if(!orders){
        return next(new ErrorHandler('No order found with this id',404))
    }
    res.status(200).json({
        success:true,
        orders
    })
})


//get all orders -ADMIN => /api/v1/admin/orders
exports.allOrders = catchAsyncError(async(req,res,next)=>{
    const orders =await Order.find();

    let totalAmount = 0;

    orders.forEach(order =>{
        totalAmount += order.totalPrice;
    })
    

    if(!orders){
        return next(new ErrorHandler('No order found with this id',404))
    }
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

//update/process order -ADMIN => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order =await Order.findById(req.params.id);

    
    if(order.orderStatus === 'Delivered'){
      return next(new ErrorHandler('Your have delivered this order ',400))
    }

    order.orderItems.forEach(async item =>{
        await updateStock(item.product, item.quantity);
    })

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success:true,
    })
})


async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.stock = product.stock -quantity;

    await product.save({validateBeforeSave:false});
}

//delete order => /api/v1/order/:id
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler('No order found with this id',404))
    }

    await order.remove();
    res.status(200).json({
        success:true,
    })
})