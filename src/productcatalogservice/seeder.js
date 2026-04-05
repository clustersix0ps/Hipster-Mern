const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const fs = require('fs');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();
        
        const data = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
        
        await Product.insertMany(data.products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
