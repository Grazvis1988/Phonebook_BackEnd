const mongoose = require('mongoose')

if (process.argv.length < 2 && process.argv.length > 4) {
	console.log('Please provide password as an argument: node mongo.js <password> <name> <number>')
	process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://fullStack:${password}@cluster0.ej6ir.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
	contact: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)



if (process.argv.length === 3) {
	Person.find({}).then( result => {
		console.log('Phonebook:')
		result.forEach( person => {
			console.log(person.contact, person.number)
		})
		mongoose.connection.close()
	})
} else {
	const personName = process.argv[3]
	const personNumber = process.argv[4]

	const person = new Person({
		contact: personName,
		number: personNumber
	})

	person.save().then( result => {
		console.log(`Added ${personName} number ${personNumber} to phonebook`)
		mongoose.connection.close()
	}).catch( error => {
		console.log('Something went wrong')
		mongoose.connection.close()
	})
}
