// Initialize .env
require('dotenv').config()
// Dependencies
const express = require('express')
// Initialize express app
const app = express()

app.use((req, res, next) => {
  // Handle auth (Not implemented yet)
  next()
})

app.get('/', (req, res) => {
  return res.status(200).json({ hello: 'world' })
})

app.get('/:category', (req, res) => {
  // Handle random image response
})
