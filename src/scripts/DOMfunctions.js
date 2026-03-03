import { loadProjects, checkEmpty } from "./storage.js";
import { addProject, deleteProject, editProject } from "./logic.js";

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

    const saveNewProjectButton = document.querySelector(".new-project .save");
    saveNewProjectButton.addEventListener("click", e => {
        e.preventDefault();
        const dialog = document.querySelector("dialog.new-project");
        const form = dialog.querySelector("form");
        const name = dialog.querySelector("input.project-name").value;
        addProject(name);
        refresh(dialog, form);
    })

    const saveEditProjectButton = document.querySelector(".edit-project .save");
    saveEditProjectButton.addEventListener("click", e => {
        e.preventDefault();
        const oldName = localStorage.getItem("oldName");
        const dialog = document.querySelector("dialog.edit-project");
        const form = dialog.querySelector("form");
        const newName = dialog.querySelector("input.project-name").value;
        editProject(oldName, newName);
        refresh(dialog, form);
    })

    const projects = document.querySelectorAll(".project-list ul li");
    projects.forEach(project => {
        project.addEventListener("click", e => {
            e.preventDefault();
            projects.forEach( project => {
                project.classList.remove("active");
            })
            project.classList.add("active");
        })
    })
}

function refreshList() {
    const projects = loadProjects();
    const projectList = document.querySelector(".project-list ul");
    projectList.replaceChildren();
    projects.forEach(project => {
        const li = document.createElement("li");
        projectList.appendChild(li);
        const p = document.createElement("p");
        p.innerHTML = project.name;
        li.appendChild(p);
        const div = document.createElement("div");
        div.setAttribute("class", "buttons");
        li.appendChild(div);
        const editButton = document.createElement("span");
        editButton.setAttribute("class", "material-symbols-rounded");
        editButton.setAttribute("id", "edit");
        editButton.innerHTML = "edit";
        div.appendChild(editButton);
        editButton.addEventListener("click", () => {
            const editProjectDialog = document.querySelector("dialog.edit-project");
            const projectNameInput = editProjectDialog.querySelector("input.project-name");
            projectNameInput.value = project.name;
            localStorage.setItem("oldName", project.name);
            editProjectDialog.showModal();
        })
        const deleteButton = document.createElement("span");
        deleteButton.setAttribute("class", "material-symbols-rounded");
        deleteButton.setAttribute("id", "delete");
        deleteButton.innerHTML = "delete";
        div.appendChild(deleteButton);
        deleteButton.addEventListener("click", () => {
            deleteProject(project.name);
            refreshList();
        })
    }); 
}

function refresh(dialog, form) {
    dialog.close();
    form.reset();
    refreshList();
}