const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");


//Event Listeners
addTaskBtn.addEventListener("click", addTask);
taskList.addEventListener("click", handleTaskActions);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterTasks);
});

// add task

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") 
        return;

    const task = { 
        text: taskText,
        completed: false 
    };

    // Add task to local storage
    saveTaskToLocalStorage(task);
    // Add task to UI
    renderTask(task);
    // Clear input field
    taskInput.value = "";
}


// save task to local storage
function saveTaskToLocalStorage(task) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// render task
function renderTask(task) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
        <div class="task-actions">
            <button class="complete-btn">Complete</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    taskList.appendChild(li);
}

