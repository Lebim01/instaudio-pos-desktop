const { model , Schema} = require('mongoose')
const Inventory = require('./inventory')

const newTaskSchema = new Schema({
  _id: {
    type: String, 
    required: true
  },
  ref_number: {
    type: String,
  },
  discount: {
    type: Number,
  },
  customer: {
    type: Number,
  },
  status: {
    type: Number,
  },
  subtotal: {
    type: String
  },
  tax: {
    type: Number
  },
  order_type: {
    type: Number
  },
  items: {
    type: Array
  },
  date: {
    type: Date
  },
  payment_type: {
    type: String
  },
  payment_info: {
    type: String
  },
  total: {
    type: String
  },
  paid: {
    type: String
  },
  change: {
    type: String
  },
  till: {
    type: Number
  },
  user: {
    type: String
  },
  user_id: {
    type: Number
  }
})

module.exports = model('Transaction', newTaskSchema);