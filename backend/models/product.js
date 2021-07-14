const mongoose =require('mongoose');


const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter product name!'],
        trim:true,
        maxLenght:[100,'Product name cannot exeed 100 charcters!']
    },
    price:{
        type:String,
        required:[true,'Please enter product price!'],
        maxLenght:[5,'Product name cannot exeed 5 charcters!'],
        default:0.0
    },
    description:{
        type:String,
        required:[true,'Please enter product description!']
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:true,
        enum:{
            values:[
                'Electronic',
                'Cameras',
                'Laptop',
                'Accessories',
                'Headphone',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message:'Please select correct category for product'
        }
    },
    seller:{
        type:String,
        required:[true,'please enter seller']
    },
    stock:{
        type:Number,
        required:[true, 'please enter stock'],
        maxLenght:[5,'product stock cannot exeed 5 charcter'],
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            name:{
                type:String,
                required:true
            },
            ratings:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports =mongoose.model('Product',productSchema)