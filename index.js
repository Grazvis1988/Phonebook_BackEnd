require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express();
const Person = require('./modules/person')


app.use(express.static('build'))
app.use(express.json());
app.use(cors());

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req[header] :body'))

/*
let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456"
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-3434343"
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "123-455673"
	},
	{
		id: 4,
		name: "Marry Poppendick",
		number: "659-34566732"
	}
]
*/
//------------------------------------------------------------------------------------ 

app.get('/api/persons', (req, res) => {
	Person.find({}).then( persons => {
		res.json(persons)
	})
})

app.post('/api/persons', (req, res) => {
//	const randomNumber = Math.floor(Math.random() * 100000000000000000)
	const body = req.body
//	const names = persons.map( p => p.name )
//	const existDuplicate = names.includes(body.name)

	if (!body.name || !body.number){
	return (res.status(400).json({
			error: 'Missing content'
		})
	)} /*else if (existDuplicate) {
		return (
			res.status(400).json({
				error: 'Name must be unique'
			})
		)
	}*/

	const person = new Person({
//		id: randomNumber,
		name: body.name,
		number: body.number
	})

//	persons = persons.concat(person)
	person.save().then( savedPerson => {
		res.json(savedPerson)
	})
})

app.get('/info', (req, res) => {
	const date = new Date()

	Person.find({}).then(  persons =>  res.send(`
		<p>Phonebook has info for ${persons.length} people</p>

		${date}
		`)
)
	})

app.get('/api/persons/:id', (req, res) => {
//	const id = Number(req.params.id)
	Person.findById(req.params.id).then( person => {
		res.json(person)
	})
	.catch( error => next(error))
/*	const person = persons.find( p => p.id === id )
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
*/
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id).then( person => {
		res.status(204).end()
	})
	.catch( error => next(error))
})

app.put('api/persons/:id', (req, res, next) => {
	const body = req.body

	const person = { 
		name: body.name,
		number: body.number,
	}
	Person.findByIdAndUpdate(req.params.id, person, { new: true })
	.then( updatedPerson => {
		res.json(updatedPerson.toJSON())
	}).catch( error => next(error) )
})

//------------------------------------------------------------------------------------ 

const UnknownEndPoint = (request, response) => {
	response.status(404).send({ error: "Unknown Endpoint" })	
}

const errorHandler = ( error, request, response, next ) => {
	console.log(error)
	if(error.name === 'CastError') {
		return response.status(400).send({ error: 'Mallformed id' })
	}
	next(error)
}

app.use(UnknownEndPoint)
app.use(errorHandler)

const PORT = process.env.REACT_APP_PORT 
			
			
app.listen(PORT, () => { console.log(`Server is listening on the port ${PORT}`)
})
