const app = require("express")();
const server = require( "http" ).Server( app );
const bodyParser = require("body-parser");
const Transactions = require('../mongodb/models/transactions')
const Inventory = require('../mongodb/models/inventory')
const async = require( "async" );

app.use(bodyParser.json());

module.exports = app;

app.get("/", function(req, res) {
  res.send("Transactions API");
});

 
app.get("/all", async function(req, res) {
  const docs = await Transactions.find({})
  res.send(docs);
});
 
app.get("/on-hold", async function(req, res) {
  const docs = await Transactions.find(
    { $and: [{ ref_number: {$ne: ""}}, { status: 0  }]},
  );
  if (docs) res.send(docs);
});

app.get("/customer-orders", async function(req, res) {
  const docs = await Transactions.find(
    { $and: [{ customer: {$ne: "0"} }, { status: 0}, { ref_number: ""}]},
  );
  if (docs) res.send(docs);
});

app.get("/by-date", async function(req, res) {
  let startDate = new Date(req.query.start);
  let endDate = new Date(req.query.end);
  endDate.setHours(23)
  endDate.setMinutes(59)

  if(req.query.user == 0 && req.query.till == 0) {
      const docs = await Transactions.find(
        { $and: [{ date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() }}, { status: parseInt(req.query.status) }] }
      );
      if(docs) res.send(docs)
  }

  if(req.query.user != 0 && req.query.till == 0) {
    const docs = await Transactions.find(
      { $and: [{ date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() }}, { status: parseInt(req.query.status) }, { user_id: parseInt(req.query.user) }] },
    );
    if (docs) res.send(docs);
  }

  if(req.query.user == 0 && req.query.till != 0) {
    const docs = await Transactions.find(
      { $and: [{ date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() }}, { status: parseInt(req.query.status) }, { till: parseInt(req.query.till) }] },
    );
    if (docs) res.send(docs);
  }

  if(req.query.user != 0 && req.query.till != 0) {
    const docs = await Transactions.find(
      { $and: [{ date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() }}, { status: parseInt(req.query.status) }, { till: parseInt(req.query.till) }, { user_id: parseInt(req.query.user) }] },
    );
    if (docs) res.send(docs);
  }

});

app.post("/new", async function(req, res) {
  try {
    let newTransaction = req.body;
    const transactionObj = new Transactions(newTransaction)
    const transaction = await transactionObj.save()
    if(newTransaction.paid >= newTransaction.total){
      decrementInventory(newTransaction.items);
    }
    res.sendStatus(200);
  }catch(err){
    console.error(err)
    res.status(500).send(err);
  }
});

app.put("/new", async function(req, res) {
  try {
    let oderId = req.body._id;
    await Transactions.findByIdAndUpdate({
      _id: oderId
    }, req.body)
    res.sendStatus( 200 );
  }
  catch(err){
    res.status( 500 ).send( err );
  }
});

app.post( "/delete", async function ( req, res ) {
  try{
    let transaction = req.body;
    await Transactions.deleteOne({ _id: transaction.orderId })
    res.sendStatus( 200 );
  }catch(err){
    res.status( 500 ).send( err );
  }
});

app.get("/:transactionId", async function(req, res) {
  const doc = await Transactions.findById(req.params.transactionId)
  res.send(doc);
});


const decrementInventory = function ( products ) {
  async.eachSeries( products, async function ( transactionProduct, callback ) {
      const product = await Inventory.findById(transactionProduct.id)

      if ( !product || !product.quantity ) {
          callback();
      } else {
          let updatedQuantity =
              parseInt( product.quantity) -
              parseInt( transactionProduct.quantity );

          await Inventory.findByIdAndUpdate(product._id, { quantity: updatedQuantity })
          callback()
      }
  } );
};