const express = require('express');

const server = express();

server.use(express.json());

// Set base
const projects = [
  {
    id: "1",
    title: "Novo projeto",
    tasks: ['Nova tarefa']
  },
  {
    id: "2",
    title: "Novo projeto 2",
    tasks: ['Nova tarefa1','Nova tarefa2']
  }
]

const requests = [];

// Middlewares
// id exist
function checkIdExists(req, res, next) {
  const { id } = req.body
  if(!id){
    return res.status(400).json({ error: "ID is required."});
  } 
  const project = projects.find(project => project.id == id);
  if(project){
    return res.status(400).json({ error: "ID existing."});
  }
  return next();
}

// Count require
let requestCount = function (req, res, next) {
  requests.push(req);

  console.log(`Foram feitas ${requests.length} requisições na aplicação até então`);
  
  return next();
}

server.use(requestCount);

// Rotes
// GET /projects: Rota que lista todos projetos e suas tarefas;
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// GET /projects/:id/: Rota que retorna projeto específico e suas tarefas;
server.get('/projects/:id', (req, res) => {
  const { id } = req.params;
  const project = projects.find(project => project.id == id);

  console.log(project)

  return res.json(project);
});

// POST /projects: A rota deve receber id e title
server.post('/projects/', checkIdExists, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project);

  return res.json(projects);
});

// PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
server.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(project => project.id == id);

  project.title = title;

  return res.json(project);
});

// DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;
server.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  const project = projects.find(project => project.id == id);
  const indexProject = projects.indexOf(project);
  
  projects.splice(indexProject,1);

  return res.json(projects);
});

// POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.tasks.push(title)

  return res.json(project);
});

server.listen(3000)