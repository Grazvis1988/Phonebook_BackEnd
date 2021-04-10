const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req[header] :body'))


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

app.get('/', (req, res) => {
	res.send('<h1>Welcome to phonebook API</h1>')
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/info', (req, res) => {
	const date = new Date()
	res.send(`
		<p>Phonebook has info for ${persons.length} people</p>

		${date}
		`)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find( p => p.id === id )
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter( p => p.id !== id )

	res.status(204).end()
})


app.post('/api/persons', (req, res) => {
	const randomNumber = Math.floor(Math.random() * 100000000000000000)
	const body = req.body
	const names = persons.map( p => p.name )
	const existDuplicate = names.includes(body.name)

	if (!body.name || !body.number){
	return (res.status(400).json({
			error: 'Missing content'
		})
	)} else if (existDuplicate) {
		return (
			res.status(400).json({
				error: 'Name must be unique'
			})
		)
	}

	const person = {
		id: randomNumber,
		name: body.name,
		number: body.number
	}

	persons = persons.concat(person)
	res.json(person)
})

const PORT = process.env.PORT || 3001
			
			
app.listen(PORT, () => { console.log(`Server is listening on the port ${PORT}`)
})
