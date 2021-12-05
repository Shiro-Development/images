// Initialize .env
require('dotenv').config()
// Dependencies
const mime = require('mime-types')
const express = require('express')
const fs = require('fs/promises')
// Initialize express app
const app = express()

app.get('/', (req, res) => {
  return res.status(200).json({ hello: 'world' })
})

app.get('/health', (req, res) => {
  return res.status(200).send('Service OK')
})

app.get('/:category/:file', async (req, res, next) => {
  if (req.params.file) return next()
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

app.get('/nsfw/:category/:file', async (req, res) => {
  const fileName = `/images/nsfw/${req.params.category}/${req.params.file}`
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

app.get('/endpoints', async (req, res) => {
  const sfwCategories = (await fs.readdir('./images')).filter(c => c !== 'nsfw').map(c => `${process.env.SUB_PATH}/${c}`)
  const nsfwCategories = (await fs.readdir('./images/nsfw/')).map(c => `${process.env.SUB_PATH}/nsfw/${c}`)
  return res.json({
    sfw: sfwCategories,
    nsfw: nsfwCategories
  })
})

app.use((req, res, next) => {
  if (req.headers?.authorization === process.env.AUTH_TOKEN) {
    next()
  } else {
    return res.status(401).json({ code: 401, message: 'Unauthorized' })
  }
})

app.get('/nsfw/:category', async (req, res) => {
  const dirName = `./images/nsfw/${req.params.category}`
  const dirExists = await fs.stat(dirName).catch(() => undefined)
  if (dirExists) {
    const files = await fs.readdir(dirName)
    const randomNumber = Math.round(Math.random() * await files.length)
    return res.status(200).json({ code: 200, url: `${process.env.SUB_PATH}/nsfw/${req.params.category}/${files[randomNumber]}` })
  } else {
    return res.status(404).json({ code: 404, message: "Category doesn't exist" })
  }
})

app.get('/:category', async (req, res) => {
  console.log(req.params.category)
  const dirName = `./images/${req.params.category}`
  const dirExists = await fs.stat(dirName).catch(() => undefined)
  if (dirExists) {
    const files = await fs.readdir(dirName)
    const randomNumber = Math.round(Math.random() * await files.length)
    return res.status(200).json({ code: 200, url: `${process.env.SUB_PATH}/${req.params.category}/${files[randomNumber]}` })
  } else {
    return res.status(404).json({ code: 404, message: "Category doesn't exist" })
  }
})

app.listen(process.env.PORT)
