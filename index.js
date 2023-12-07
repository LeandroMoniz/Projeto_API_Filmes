const express = require('express')
const cors = require('cors')
const conn = require('./db/conn')

const app = express()
// Config JSON response 
app.use(express.json())

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// Public folder for images 
app.use(express.static('public'))


app.listen(5000) 