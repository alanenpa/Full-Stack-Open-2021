const mongoose = require('mongoose')

// console.log(process.argv[0])
// console.log(process.argv[1])
// console.log(process.argv[2])

const n = process.argv.length

if (n < 3) {
  console.log('give password as an argument')
  process.exit(1)
} 

const password = process.argv[2]

const url = `mongodb+srv://alanenpa:${password}@cluster0.zzjyi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (n === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
  return
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

person.save().then(result => {
  console.log(`added ${result.name}, number ${result.number} to phonebook`)
  mongoose.connection.close()
})