// Initialize .env
require('dotenv').config()
// Dependencies
const mime = require('mime-types')
const express = require('express')
const fs = require('fs/promises')
// Initialize express app
const app = express()

app.use((req, res, next) => {
  if(req.headers?.authorization === process.env.AUTH_TOKEN) {
    next()
  } else {
    return res.status(401).json({ code: 401, message: 'Unauthorized' })
  }
  next()
})

app.get('/', (req, res) => {
  return res.status(200).json({ hello: 'world' })
})

app.get('/:category', async (req, res) => {
  const dirName = `./images/${req.params.category}`
  const dirExists = await fs.stat(dirName).catch(() => undefined)
  if (dirExists) {
    const files = await fs.readdir(dirName)
    const randomNumber = Math.round(Math.random() * await files.length)
    return res.status(200).json({ code: 200, url: `/${req.params.category}/${files[randomNumber]}` })
  } else {
    res.status(404).json({ code: 404, message: "Category doesn't exist" })
  }
})

app.get('/:category/:file', async (req, res) => {
  const fileName = `/images/${req.params.category}/${req.params.file}`
  const fileExists = await fs.stat(`./${fileName}`).catch(() => undefined)
  if (fileExists) {
    const file = await fs.readFile(`${__dirname}${fileName}`)
    const mimeType = mime.contentType(req.params.file)
    if (mimeType) res.setHeader('Content-Type', mimeType)
    return res.send(file)
  } else {
    return res.status(404).json({ code: 404, message: "Category doesn't exist" })
  }
})

app.listen(process.env.PORT)
