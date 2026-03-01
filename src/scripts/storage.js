function saveProjects(list) {
	localStorage.setItem("projectList", JSON.stringify(list));
}

function loadProjects() {
    return JSON.parse(localStorage.getItem("projectList"));
}

function clearProjects() {
	localStorage.clear();
}

function checkEmpty() {
    if (loadProjects === null) {
        return true
    } else {
        return loadProjects().length === 0;
    }
}

export { saveProjects, loadProjects, clearProjects, checkEmpty }