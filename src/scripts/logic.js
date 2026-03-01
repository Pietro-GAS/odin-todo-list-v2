import { loadProjects, saveProjects } from "./storage"

function createProject(name) {
    const tasks = [];
    const addTask = (task) => {
        tasks.push(task)
    }
    const removeTask = (task) => {
        const position = tasks.indexOf(task);
        tasks.splice(position, 1);
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