const { model , Schema} = require('mongoose')

const newTaskSchema = new Schema({
  _id: {
    type: String, 
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  adddress: {
    type: String,
  },
})

module.exports = model('Customer', newTaskSchema);