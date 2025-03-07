document.addEventListener("DOMContentLoaded", loadTasks);

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

// handle task actions
function handleTaskActions(e) {
    const li = e.target.closest("li");
    if (!li) return;

    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const taskSpan = li.querySelector(".task-text");
    const taskText = taskSpan.innerText;
    const taskIndex = tasks.findIndex(t => t.text === taskText);

    if (e.target.classList.contains("delete-btn")) {
        tasks.splice(taskIndex, 1);
        li.remove();
    } 
    else if (e.target.classList.contains("complete-btn")) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        taskSpan.classList.toggle("completed");
    } 
    else if (e.target.classList.contains("edit-btn")) {
        editTaskInline(taskSpan, taskIndex, tasks);
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// edit task inline
function editTaskInline(taskSpan, taskIndex, tasks) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = tasks[taskIndex].text;
    input.classList.add("edit-input");

    taskSpan.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => saveEditedTask(input, taskIndex, tasks));
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            saveEditedTask(input, taskIndex, tasks);
        }
    });
}

// save edited task

function saveEditedTask(input, taskIndex, tasks) {
    const newText = input.value.trim();
    if (newText === "") return;

    tasks[taskIndex].text = newText;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const taskSpan = document.createElement("span");
    taskSpan.classList.add("task-text");
    taskSpan.innerText = newText;

    input.replaceWith(taskSpan);
}
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Retrieve tasks or set empty array
    tasks.forEach(task => renderTask(task));
}

function filterTasks(e) {
    const filter = e.target.dataset.filter;
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Retrieve tasks or set empty array
    
    taskList.innerHTML = "";
    tasks.forEach(task => {
        if (filter === "all" || (filter === "completed" && task.completed) || (filter === "pending" && !task.completed)) {
            renderTask(task);
        }
    });
}