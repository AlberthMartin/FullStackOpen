const mongoose = require("mongoose")

if(process.argv.length < 3){
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://alberthmartin01:${password}@cluster0.ffmj3se.mongodb.net/commandLineDatabase?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

mongoose.connect(url)

//Create the database schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model("Person", personSchema)

//Check if arguments name and number where given
if(process.argv[3] && process.argv[4]){
    //Create a new person based on the input:
    //node mongo.js yourpassword Anna 040-1234556
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    //Save it to the database
    person.save().then(result =>{
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}else{
    //Else list all the people in the database
    Person.find({}).then(result =>{
        result.forEach(person=>{
            console.log(person)
        })
        mongoose.connection.close()
    })
}






