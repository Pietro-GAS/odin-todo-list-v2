import { loadProjects } from "./storage.js";
import { addProject } from "./logic.js";

const body = document.querySelector("body");

export function loadDOM(){
	refreshList();
	
	const dialogs = document.querySelectorAll("dialog");
	dialogs.forEach(dialog => {
		const cancelButtons = dialog.querySelectorAll(".button.cancel");
        const form = dialog.querySelector("form");
		cancelButtons.forEach(button => {
			button.addEventListener("click", e => {
				e.preventDefault();
				dialog.close();
                form.reset();
			});
		});
	});	
	
	const newProjectButtons = document.querySelectorAll(".button#new-project");
	const newProjectDialog = document.querySelector("dialog.new-project");
	newProjectButtons.forEach(button => {
		button.addEventListener("click", () => {
			newProjectDialog.showModal();
		});
	});

    const saveProjectButton = document.querySelector(".new-project .save");
    saveProjectButton.addEventListener("click", e => {
        e.preventDefault();
        const dialog = document.querySelector("dialog.new-project");
        const form = dialog.querySelector("form");
        const name = dialog.querySelector("input.project-name").value;
        addProject(name);
        dialog.close();
        form.reset();
        refreshList();
    })
}

function refreshList() {
    const projects = loadProjects();
    const projectList = document.querySelector(".project-list ul");
	if (projects === null) {
		projectList.innerHTML = `<li>My first project</li>`;
	} else {
		let li = "";
		projects.forEach(project => {
			li += `<li>${project.name}</li>`
		});
		projectList.innerHTML = li;
	}
}