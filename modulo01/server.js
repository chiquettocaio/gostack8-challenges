const express = require('express')
const app = express()

// API state
const projects = []
let reqsCount = 0

// Cofiguration middlewares
app.use(express.json())

// Global middlewares
app.use((req, res, next) => {
  console.log(++reqsCount)
  return next()
})

// Middlewares
function checkIfProjectExists (req, res, next) {
  const { id } = req.params
  const project = projects.find(p => p.id == id)

  if (!project) {
    return res.status(400).json({ error: 'project does not exists' })
  }

  req.project = project
  return next()
}

function checkIfTitleExists (req, res, next) {
  const { title } = req.body
  if (!title) {
    return res.status(400).json({ error: "new title not found" })
  }

  req.title = title
  return next()
}

// Routes
app.post('/projects', (req, res) => {
  const { id, title, tasks = [] } = req.body
  projects.push({ id, title, tasks })

  return res.json(projects)
})

app.get('/projects', (req, res) => {
  return res.json(projects)
})

app.put('/projects/:id', checkIfProjectExists, checkIfTitleExists, (req, res) => {
  req.project.title = req.title
  return res.json(req.project)
})

app.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  projects.splice(projects.indexOf(req.project), 1)
  return res.json(projects)
})

app.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { title } = req.body
  req.project.tasks.push(title)
  
  return res.json(req.project)
})

app.listen(3000, () => console.log('Server running on 3000'))