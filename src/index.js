import "./css/default.css";
import { loadDOM } from "./scripts/DOMfunctions.js";
import { loadProjects, saveProjects } from "./scripts/storage.js";

const main = (() => {
    document.addEventListener("DOMContentLoaded", () =>{
        //localStorage.clear() // uncomment to reset storage
        //initialiseLogic(); // to be developed
        if (loadProjects() === null) {
            saveProjects([{name: "My first project", tasks: []}]);
        }
        loadDOM();
    });
})();