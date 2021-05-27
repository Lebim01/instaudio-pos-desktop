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
})

module.exports = model('Category', newTaskSchema);