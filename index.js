import express from 'express'
import cors from 'cors'
require('dotenv').config()
import routes from './src/routes'
require('./connection_database')

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', routes)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})