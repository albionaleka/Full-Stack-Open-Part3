const mongoose = require('mongoose');

const password = process.argv[2]

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const url = `mongodb+srv://albiona:${password}@cluster0.m8yma.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

const connect = async () => {
    try {
        await mongoose.connect(url)
        console.log("Connected to MongoDB")
    } catch (err) {
        console.log("There was an error connecting to the database.", err)
    }
}

connect();

if (process.argv.length === 5) {
    let name = process.argv[3]
    let number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(() => {
        console.log(`Added ${name}, number ${number} to phonebook`)
        mongoose.connection.close()
    })

} else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        if (result.length === 0) {
            console.log("Phonebook is empty")
        } else {
            console.log("Phonebook:")

            result.forEach(entry => {
                console.log(`${entry.name} ${entry.number}`)
            });
        }
        mongoose.connection.close()
    })

} else if (process.argv.length < 3) {
    console.log("Please provide password as an argument.")
    process.exit(1)
}