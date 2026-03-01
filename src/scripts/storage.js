function saveProjects(list) {
	localStorage.setItem("projectList", JSON.stringify(list));
}

function loadProjects() {
	return JSON.parse(localStorage.getItem("projectList"));
}

function clearProjects() {
	localStorage.clear();
}

export { saveProjects, loadProjects, clearProjects }