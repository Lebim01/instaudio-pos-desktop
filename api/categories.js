const app = require( "express" )();
const server = require( "http" ).Server( app );
const bodyParser = require( "body-parser" );
const mongoose = require('mongoose')
const Category = require("../mongodb/models/categories");

app.use( bodyParser.json() );

module.exports = app;

app.get( "/", function ( req, res ) {
    res.send( "Category API" );
} );
  
app.get( "/all", async function ( req, res ) {
    try {
        const categories = await Category.find();
        res.send(categories)
    }catch(err){
        console.error(err)
    }
} );
 
app.post( "/category", async function ( req, res ) {
    let newCategory = req.body;
    newCategory._id = new mongoose.Types.ObjectId;
    try {
        const category = new Category(newCategory);
        const categorySaved = await category.save();
        console.log(categorySaved);
        res.sendStatus( 200 );
    }catch(err){
        res.status( 500 ).send( err );
    }
} );

app.delete( "/category/:categoryId", async function ( req, res ) {
    console.log('hola')
    try {
        const _id = req.params.categoryId
        const categoryDeleted = await Category.findByIdAndDelete(_id)
        res.sendStatus( 200 );
    }catch(err){
        console.error(err)
        res.status( 500 ).send( err );
    }
} );
 
app.put( "/category", async function ( req, res ) {
    try {
        const _id = req.body.id;
        const updatedTask = await Category.findByIdAndUpdate(
            _id,
            req.body,
            { new: true }
        );
        res.sendStatus( 200 );
    }catch(err){
        res.status( 500 ).send( err );
    }
});