const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('tiny'));

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
    response.json(persons);
});

app.get('/info', (request, response) => {
    let now = new Date();

    let dayName = now.toLocaleDateString("en-US", { weekday: "short" });
    let day = now.getDate();
    let month = now.toLocaleDateString("en-US", { month: "short" });

    let date = `${dayName} ${month} ${day}`;
    let time = now.toLocaleTimeString();

    let timezoneOffset = -now.getTimezoneOffset();
    let timezoneHours = Math.floor(timezoneOffset / 60);
    let timezoneMinutes = timezoneOffset % 60;
    let timezone = `UTC${timezoneHours >= 0 ? "+" : ""}${timezoneHours}:${timezoneMinutes.toString().padStart(2, "0")}`;
    
    let options = { timeZoneName: "long", hour: "numeric" };
    let timeZoneName = new Intl.DateTimeFormat("en-US", options).format(now);
    timeZoneName = timeZoneName.replace(/^\d+\s?(AM|PM)?\s/, '');


    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${date} ${time} ${timezone} (${timeZoneName})</p>`);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    if (person) {
        response.send(person);
    } else {
        response.status(404).end();
    }
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

    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ 
            error: 'Name must be unique' 
        });
    }

    const person = {
        "name": body.name,
        "number": body.number,
        "id": generateId()
    }

    persons.concat(person);
    response.json(person);
});

const generateId = () => {
    return Math.floor(Math.random() * 1000000);
};

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}. http://localhost:3001`);
});