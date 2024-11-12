const connectToMongo = require('./db');
const express = require('express')
var cors= require('cors')
connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json()) // using middleware to read req.body
// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

//https://express-validator.github.io/docs/ express validator
//https://www.npmjs.com/package/bcryptjs
//https://www.npmjs.com/package/jsonwebtoken