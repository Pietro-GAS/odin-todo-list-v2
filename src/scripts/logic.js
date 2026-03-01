import { loadProjects, saveProjects } from "./storage"

function createProject(name) {
    const tasks = [];
    const addTask = (task) => {
        tasks.push(task)
    }
    const removeTask = (task) => {
        tasks = tasks.filter(element => element.name !== task.name)
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
