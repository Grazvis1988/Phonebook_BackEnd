const express = require('express')

const app = express();

app.use(express.json());

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

app.get('/persons', (req, res) => {
	res.json(persons)
})

const port = 3001

app.listen(port)

console.log(`Application is listening on the port ${port}`)
