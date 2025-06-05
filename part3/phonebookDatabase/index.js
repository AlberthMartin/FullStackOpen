require("dotenv").config()
const express = require("express")
const Person = require("./models/Person")

const app = express()

app.use(express.json())

//Get the people from the database
app.get("/api/persons", (request, response) =>{
    Person.find({}).then(persons=>{
        response.json(persons)
    })
})

//Add a new person to the database
app.post("/api/persons", (req, res)=>{
    const body = req.body

    //if number or name is missing
    if(!body.number || !body.name){
        return res.status(400).json({
            error: "number or name missing"
        })
    }
    
    //Create the new person in the phonebook
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson =>{
        res.json(savedPerson)
    })
})

//Get an individual person
app.get("/api/persons/:id", (req, res)=>{
    console.log(`Rendering ${req.params.id}`)
    Person.findById(req.params.id).then(person=>{
        res.json(person)
    })
})

/*

app.get("/info", (req, res)=>{
    res.send(`
        <p>Phonebook has info for ${persons.length} people </p>
        <p>${Date()}</p>
        `)
})

app.get("/api/persons/:id", (req, res) =>{
    const id = req.params.id
    const person = persons.find(person => person.id === id)

    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req,res)=>{
    const id = req.params.id
    persons = persons.filter(pers => pers.id !== id)

    res.status(204).end()
})


app.post("/api/persons", (req, res)=>{
    const body = req.body

    //if number or name is missing
    if(!body.number || !body.name){
        return res.status(400).json({
            error: "number or name missing"
        })
    }
    //if name already exists in the data
    if(persons.find(pers => pers.name === body.name)){
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    
    //Create the new person in the phonebook
    const person = {
        //random number between 10-444
        id: String(Math.floor(Math.random()*(444-10+1)+10)),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    
    res.json(person)


})

const generateId = () => {
    const maxId = notes.length > 0 
    ? Math.max(...notes.map(n=>Number(n.id)))
    : 0
    return String(maxId+1)
}

*/

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})