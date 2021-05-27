const { model , Schema, Types } = require('mongoose')

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const counter = model('counter', CounterSchema);

const newTaskSchema = new Schema({
  _id: {
    type: String, 
    required: true
  },
  price: {
    type: String
  },
  category: {
    type: Schema.Types.ObjectId
  },
  quantity: {
    type: Number
  },
  name: {
    type: String
  },
  stock: {
    type: Number
  },
  img: {
    type: String
  },
  seq: { 
    type: Number, 
    default: 0 
  }
})

newTaskSchema.pre('save', async function(next) {
  const exists = await counter.findOne()

  if(!exists) {
    const _id = new Types.ObjectId
    const newCounter = new counter({ _id, seq: 0 })
    await newCounter.save()
  }

  const record = await counter.findOneAndUpdate({}, { $inc: { seq: 1 } })
  this.seq = record.seq;
  next();
});

module.exports = model('Inventory', newTaskSchema);