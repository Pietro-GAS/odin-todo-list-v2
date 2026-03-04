import { loadProjects, saveProjects } from "./storage"

function createProject(name) {
    const active = false;
    const tasks = [];
    const addTask = (task) => {
        this.tasks.push(task)
    }
    const removeTask = (task) => {
        this.tasks = this.tasks.filter(element => element.name !== task.name)
        //const position = tasks.indexOf(task);
        //tasks.splice(position, 1);
    }
    return {name, tasks, addTask, removeTask}
}

export function addProject(name) {
    const project = createProject(name);
    const projectList = loadProjects();
    projectList.push(project);
    saveProjects(projectList);
}

export function deleteProject(name) {
    let projectList = loadProjects();
    projectList = projectList.filter(element => element.name !== name)
    saveProjects(projectList);
}

export function editProject(oldName, newName) {
    let projectList = loadProjects();
    const oldProject = projectList.find(project => project.name === oldName);
    const position = projectList.indexOf(oldProject);
    const newProject = createProject(newName);
    oldProject.tasks.forEach(task => {
        newProject.addTask(task);
    })
    projectList.splice(position, 1, newProject);
    saveProjects(projectList);
};

export function replaceProject(newProject) {
    let projectList = loadProjects();
    const position = projectList.findIndex(project => project.name === newProject.name);
    projectList.splice(position, 1, newProject);
    saveProjects(projectList);
}

export function getProject(name) {
    const projectList = loadProjects();
    const project = projectList.find(project => project.name === name);
    if (project === undefined) {
        return null
    } else {
        project.addTask = function(task) {
        this.tasks.push(task);
    }
    project.removeTask = function(task) {
        this.tasks = this.tasks.filter(element => element.name !== task.name);
    }
    return project;
    }    
}

export function createTask(name, date, priority, description) {
    return {name, date, priority, description}
}

export function deleteTask(project, taskName) {
    let tasks = project.tasks;
    tasks = tasks.filter(t => t.name !== taskName);
    project.tasks = tasks;
    replaceProject(project);
}