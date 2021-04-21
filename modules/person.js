require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.REACT_APP_URL

console.log("Connecting to MongoDB...")

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
        .then( result => {console.log('Connected to MongoDB')})
        .catch(err => {console.log('Error while connecting to MongoDB', err.message)})


const personSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		minlength: 3
	},
	number: {
		type: String,
		required: true,
		unique: false,
		minlength: 8
	}
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
