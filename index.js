const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
require('dotenv').config();
const Person = require('./models/person.js')

app.use(express.json());

morgan.token('body', (req) =>
    JSON.stringify(req.body)
);

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(cors());
app.use(express.static('dist'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Express Server</h1>');
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get('/info', (request, response) => {
    let time = new Date().toString();

    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${time}</p>`);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    
    Person.findById(id).then(person => {
        response.json(person);
    })
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'Name or number missing' 
        });
    }

    // const nameExists = persons.some(person => person.name === body.name);
    // if (nameExists) {
    //     return response.status(400).json({ 
    //         error: 'Name must be unique' 
    //     });
    // }

    const person = new Person ({
        name: body.name,
        number: body.number,
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    });
});

const generateId = () => {
    return Math.floor(Math.random() * 1000000);
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}. http://localhost:${PORT}`);
});