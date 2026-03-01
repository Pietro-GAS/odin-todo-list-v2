import { loadProjects } from "./storage.js";

let projects = loadProjects();
const body = document.querySelector("body");

export function loadDOM(){
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
	
	const dialogs = document.querySelectorAll("dialog");
	dialogs.forEach(dialog => {
		const cancelButtons = dialog.querySelectorAll(".button.cancel");
		cancelButtons.forEach(button => {
			button.addEventListener("click", e => {
				e.preventDefault();
				dialog.close();
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
}