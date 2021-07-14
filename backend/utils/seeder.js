const Product = require('../models/product');
const dotenv = require('dotenv');

const connectDatabase = require('../config/database');

const products = require('../data/products.json');


dotenv.config({path:'backend/config/config.env'});

connectDatabase();

const seedProducts= async ()=>{
    try{        

        await Product.deleteMany();
        console.log('products deleted');
        await Product.insertMany(products);
        console.log('inserted all products');
        process.exit();
    }catch(error){
        console.log(error.message);
        process.exit();
    }
}

seedProducts();