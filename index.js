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

app.get('/', (request, response) => {
    response.send('<h1>Express Server</h1>');
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get('/info', async (request, response) => {
    let time = new Date().toString();
    const count = await Person.countDocuments();

    response.send(`<p>Phonebook has info for ${count} people</p>
        <p>${time}</p>`);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    
    Person.findById(id).then(person => {
        response.json(person);
    });
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end();
    }).catch (error => next(error));
});

app.post('/api/persons', async (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'Name or number missing' 
        });
    }

    const nameExists = await Person.findOne({name: body.name});
    
    if (nameExists) {
        const newInfo = {
            name: body.name,
            number: body.number
        }

        Person.findByIdAndUpdate(nameExists._id, newInfo, { new: true }).then(updated => {
            response.json(updated);
        }).catch (error => next);
    } else {
        const person = new Person ({
            name: body.name,
            number: body.number,
        });
    
        person.save().then(savedPerson => {
            response.json(savedPerson);
        });
    }
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}. http://localhost:${PORT}`);
});