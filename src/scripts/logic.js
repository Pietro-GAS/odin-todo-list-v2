import { loadProjects, saveProjects } from "./storage"

function createProject(name) {
    return {name, tasks: []}
}

export function addProject(name) {
    const project = createProject(name);
    const projectList = loadProjects();
    projectList.push(project);
    saveProjects(projectList);
}