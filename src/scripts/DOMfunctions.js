import { loadProjects, checkEmpty } from "./storage.js";
import { addProject, deleteProject, editProject, replaceProject, getProject, createTask, deleteTask } from "./logic.js";

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
        refreshAll(dialog, form);
    })

    const saveEditProjectButton = document.querySelector(".edit-project .save");
    saveEditProjectButton.addEventListener("click", e => {
        e.preventDefault();
        const oldName = localStorage.getItem("oldName");
        const dialog = document.querySelector("dialog.edit-project");
        const form = dialog.querySelector("form");
        const newName = dialog.querySelector("input.project-name").value;
        editProject(oldName, newName);
        refreshAll(dialog, form);
    })

    const newTaskButton = document.querySelector(".button#new-task");
    newTaskButton.addEventListener("click", e => {
        e.preventDefault();
        const dialog = document.querySelector("dialog.new-task");
        dialog.showModal();
    })

    const saveNewTaskButton = document.querySelector(".new-task .save");
    saveNewTaskButton.addEventListener("click", e => {
        e.preventDefault();
        const dialog = document.querySelector("dialog.new-task");
        const form = dialog.querySelector("form");
        const activeProject = getActiveProject();
        //const activeProjectName = document.querySelector(".task-area .header .project-title").textContent;
        //const activeProject = getProject(activeProjectName);
        const taskName = document.querySelector("form.new-task input#task-name").value;
        const taskDate = document.querySelector("form.new-task input#task-date").value;
        const taskPriority = document.querySelector("form.new-task select#task-priority option:checked").textContent;
        const taskDescription = document.querySelector("form.new-task textarea#task-description").value;
        const task = createTask(taskName, taskDate, taskPriority, taskDescription);
        activeProject.addTask(task);
        replaceProject(activeProject);        
        reset(dialog, form);
        refreshTasks(activeProject);
    })
}

function refreshList() {
    newTaskVisibility();
    const projects = loadProjects();
    const projectList = document.querySelector(".project-list ul");
    const activeProject = getActiveProject();
    let activeProjectName;
    if (activeProject !== null) {
        activeProjectName = activeProject.name;
    } else {
        activeProjectName = null;
    }
    projectList.replaceChildren();
    projects.forEach(project => {
        const li = document.createElement("li");
        if (project.name === activeProjectName) {
            li.setAttribute("class", "active");
        }
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
            refreshTitle();
            const activeProject = getActiveProject();
            refreshTasks(activeProject);
        })
    });
    const projectLi = document.querySelectorAll(".project-list ul li");
    projectLi.forEach(li => {
        li.addEventListener("click", e => {
            e.preventDefault();
            projectLi.forEach(li => {
                li.classList.remove("active");
            })
            li.classList.add("active");
            const activeProjectName = li.querySelector("p").textContent;
            const activeProject = getProject(activeProjectName);
            refreshTitle();
            if (activeProject !== null) {
                refreshTasks(activeProject);
            }
            newTaskVisibility();
        })
    })
}

function refreshTitle(){
    const activeProject = document.querySelector(".project-list ul li.active");
    if (activeProject !== null) {
        const title = activeProject.querySelector("p").textContent;
        document.querySelector(".task-area .header .project-title").textContent = title;
    } else {
        document.querySelector(".task-area .header .project-title").textContent = "";
    }
}

function reset(dialog, form) {
    dialog.close();
    form.reset();
}

function refreshTasks(project){
    const taskList = document.querySelector(".task-area .task-list");
    taskList.replaceChildren();
    if (project !== null) {
        const tasks = project.tasks;
        tasks.forEach(task => {
            const taskContainer = document.createElement("div");
            taskContainer.setAttribute("class", "task-container");
            taskList.appendChild(taskContainer);

            const taskNameDiv = document.createElement("div");
            taskNameDiv.setAttribute("class", "title");
            const taskName = document.createElement("div");
            taskName.setAttribute("class", "task-name");
            taskName.textContent = task.name;
            const taskButtonsDiv = document.createElement("div");
            taskButtonsDiv.setAttribute("class", "buttons");
            const editTaskButton = document.createElement("span");
            const deleteTaskButton = document.createElement("span");
            editTaskButton.setAttribute("class", "material-symbols-rounded");
            editTaskButton.innerHTML = "edit";
            deleteTaskButton.setAttribute("class", "material-symbols-rounded");
            deleteTaskButton.innerHTML = "delete";     
            taskContainer.appendChild(taskNameDiv);
            taskNameDiv.appendChild(taskName);
            taskNameDiv.appendChild(taskButtonsDiv);
            taskButtonsDiv.appendChild(editTaskButton);
            taskButtonsDiv.appendChild(deleteTaskButton);
            deleteTaskButton.addEventListener("click", e => {
                e.preventDefault();
                deleteTask(project, task.name);
                refreshTasks(project);
            })
            editTaskButton.addEventListener("click", e => {
                e.preventDefault();
                const dialog = document.querySelector("dialog.edit-task");
                const name = dialog.querySelector("input#task-name")
                name.value = task.name;
                const date = dialog.querySelector("input#task-date");
                date.value = task.date;
                const priority = dialog.querySelector("select#task-priority");
                priority.value = task.priority;
                const description = dialog.querySelector("textarea#task-description");
                description.value = task.description;
                dialog.showModal();
            })

            const dateDiv = document.createElement("div");
            const taskDateLabel = document.createElement("label");
            const taskDate = document.createElement("span");
            taskDateLabel.textContent = "Due date:";
            taskDate.textContent = task.date;
            taskContainer.appendChild(dateDiv);
            dateDiv.appendChild(taskDateLabel);
            dateDiv.appendChild(taskDate);

            const prioDiv = document.createElement("div");
            const taskPriorityLabel = document.createElement("label");
            const taskPriority = document.createElement("span");
            taskPriorityLabel.textContent = "Priority:";
            taskPriority.textContent = task.priority;
            taskContainer.appendChild(prioDiv);
            prioDiv.appendChild(taskPriorityLabel);
            prioDiv.appendChild(taskPriority);

            const taskDescription = document.createElement("div");
            taskDescription.setAttribute("class", "task-description");
            taskDescription.textContent = task.description;
            taskContainer.appendChild(taskDescription);
        })
    }
}

function refreshAll(dialog, form) {
    reset(dialog, form);
    refreshList();
    refreshTitle();
}

function getActiveProject() {
    const activeProjectTitle = document.querySelector(".task-area .header .project-title");
    if (activeProjectTitle !== null) {
        const activeProjectName = document.querySelector(".task-area .header .project-title").textContent;
        const activeProject = getProject(activeProjectName);
        return activeProject;
    } else {
        return null;
    }
}

function newTaskVisibility() {
    const newTaskButton = document.querySelector(".button#new-task");
    const activeProject = getActiveProject();
    if (activeProject === null) {
        newTaskButton.style.visibility = "hidden";
    } else {
        newTaskButton.style.visibility = "visible";
    }
}