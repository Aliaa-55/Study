let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");


// Add Task

addBtn.addEventListener("click", addTask);

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        category: categoryInput.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}


// Display Tasks

function displayTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchText)
    );


    if (currentFilter === "completed") {

        filteredTasks = filteredTasks.filter(
            task => task.completed
        );

    }

    if (currentFilter === "pending") {

        filteredTasks = filteredTasks.filter(
            task => !task.completed
        );

    }


    if (filteredTasks.length === 0) {

        taskList.innerHTML =
            "<p>No tasks found.</p>";

        updateStats();

        return;
    }


    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.classList.add("task");

        if (task.completed) {
            taskElement.classList.add("completed");
        }


        taskElement.innerHTML = `

            <div class="task-info">

                <h3>${task.text}</h3>

                <p>Category: ${task.category}</p>

            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(taskElement);

    });


    updateStats();
}


// Complete Task

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;

    });

    saveTasks();

    displayTasks();
}


// Delete Task

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    displayTasks();
}


// Search

searchInput.addEventListener("input", displayTasks);


// Filters

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".filter")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();

    });

});


// Statistics

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;


    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent =
        completed;

    document.getElementById("pendingTasks").textContent =
        pending;


    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }


    document.getElementById("progress").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "% Completed";

}


// Local Storage

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// Dark Mode

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "☀️";

    } else {

        themeBtn.textContent = "🌙";

    }

});


// Start

displayTasks();