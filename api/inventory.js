const app = require( "express" )();
const server = require( "http" ).Server( app );
const bodyParser = require( "body-parser" );
const mongoose = require('mongoose')
const Inventory = require('../mongodb/models/inventory')
const fileUpload = require('express-fileupload');
const multer = require("multer");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: process.env.APPDATA+'/POS/uploads',
    filename: function(req, file, callback){
        callback(null, Date.now() + '.jpg'); // 
    }
});

let upload = multer({storage: storage});

app.use(bodyParser.json());

module.exports = app;

app.get( "/", function ( req, res ) {
    res.send( "Inventory API" );
} );
 
app.get( "/product/:productId", async function ( req, res ) {
    if ( !req.params.productId ) {
        res.status( 500 ).send( "ID field is required." );
    } else {
        const product = await Inventory.findById(req.params.productId)
        res.send( product );
    }
} );

app.get( "/products", async function ( req, res ) {
    const docs = await Inventory.find()
    res.send(docs)
} );

app.post( "/product", upload.single('imagename'), async function ( req, res ) {
    let image = '';

    if(req.body.img != "") {
        image = req.body.img;        
    }

    if(req.file) {
        image = req.file.filename;  
    }
 
    if(req.body.remove == 1) {
        const path = './resources/app/public/uploads/product_image/'+ req.body.img;
        try {
          fs.unlinkSync(path)
        } catch(err) {
          console.error(err)
        }
        if(!req.file) {
            image = '';
        }
    }
    
    let Product = {
        _id: req.body.id,
        price: req.body.price,
        category: req.body.category,
        quantity: req.body.quantity == "" ? 0 : req.body.quantity,
        name: req.body.name,
        stock: req.body.stock == "on" ? 0 : 1,    
        img: image        
    }

    if(req.body.id == "") { 
        try {
            Product._id = new mongoose.Types.ObjectId;
            const newInventory = new Inventory(Product)
            const savedInventory = await newInventory.save()
            res.send(savedInventory)
        }catch(err){
            console.error(err)
            res.status( 500 ).send( err );
        }
    }
    else {
        try {
            const updatedInventory = await Inventory.findByIdAndUpdate(
                req.body.id,
                Product,
                { new: true }
            );
            res.sendStatus( 200 );
        }catch(err){
            console.log(err)
            res.status( 500 ).send( err );
        }
    }
});
 
app.delete( "/product/:productId", async function ( req, res ) {
    try {
        const _id = req.params.productId
        const inventoryDeleted = await Inventory.findByIdAndDelete(_id)
        res.sendStatus( 200 );
    }catch(err){
        res.status( 500 ).send( err );
    }
} );

app.post( "/product/sku", async function ( req, res ) {
    var request = req.body;
    const product = await Inventory.findById(request.skuCode)
    res.send( product );
} );