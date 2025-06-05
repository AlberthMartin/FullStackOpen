
//MongoDB
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)
  
const url = process.env.MONGODB_URI
console.log("Connecting to", url)
  
mongoose.connect(url)
    .then(result =>{
        console.log("connected to MongoDB")
    })
    .catch(error=>{
        console.log("error connection to MongoDB", error.message)
    })


//Create the database schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})


//Delete the __v flag
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    })

module.exports = mongoose.model("Person", personSchema)