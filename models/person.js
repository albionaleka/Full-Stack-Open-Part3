const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

const connect = async () => {
    try {
        await mongoose.connect(url)
        console.log("Connected to MongoDB")
    } catch (err) {
        console.log("There was an error connecting to the database.", err)
    }
}

connect();

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person', personSchema)