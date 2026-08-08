/* =================================
   DOM ELEMENTS
================================= */

const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");

const clearBtn = document.getElementById("clearBtn");
const emptyState = document.getElementById("emptyState");


/* =================================
   DATA
================================= */

let tasks = [];


/* =================================
   ADD TASK
================================= */

function addTask() {

    // Prevent empty tasks
    if (input.value.trim() === "") {
        return;
    }

    // Create a new task object
    const task = {
        text: input.value.trim(),
        completed: false
    };

    // Add newest task to the beginning
    // of the array
    tasks.unshift(task);

    // Clear input
    input.value = "";

    // Save updated data
    saveTasks();

    // Update UI
    renderTasks();
}


/* =================================
   SAVE TASKS
================================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


/* =================================
   LOAD TASKS
================================= */

function loadTasks() {

    tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];
}


/* =================================
   RENDER TASKS
================================= */

function renderTasks() {

    // Clear the existing UI
    taskList.textContent = "";

    // Show empty state when there
    // are no tasks
    emptyState.style.display =
        tasks.length === 0
            ? "block"
            : "none";


    // Create the UI from the data
    tasks.forEach((task, index) => {

        const list = document.createElement("li");

        const taskContent =
            document.createElement("div");

        const indicator =
            document.createElement("span");

        const text =
            document.createElement("span");

        const deleteBtn =
            document.createElement("button");


        /* -----------------------------
           CLASSES
        ----------------------------- */

        list.classList.add("task");

        taskContent.classList.add(
            "task-content"
        );

        indicator.classList.add(
            "task-indicator"
        );

        text.classList.add(
            "task-text"
        );

        deleteBtn.classList.add(
            "delete-btn"
        );


        /* -----------------------------
           CONTENT
        ----------------------------- */

        text.textContent = task.text;

        deleteBtn.textContent = "Delete";


        /* -----------------------------
           COMPLETED STATE
        ----------------------------- */

        if (task.completed) {

            text.classList.add(
                "completed"
            );

            indicator.classList.add(
                "completed-indicator"
            );
        }


        /* -----------------------------
           COMPLETE / UNCOMPLETE TASK
        ----------------------------- */

        taskContent.addEventListener(
            "click",
            () => {

                // Toggle completed state
                task.completed =
                    !task.completed;

                // Save new state
                saveTasks();

                // Update UI
                renderTasks();
            }
        );


        /* -----------------------------
           DELETE TASK
        ----------------------------- */

        deleteBtn.addEventListener(
            "click",
            () => {

                // Remove this task
                // from the array
                tasks.splice(index, 1);

                // Save updated array
                saveTasks();

                // Update UI
                renderTasks();
            }
        );


        /* -----------------------------
           BUILD TASK
        ----------------------------- */

        taskContent.appendChild(
            indicator
        );

        taskContent.appendChild(
            text
        );

        list.appendChild(
            taskContent
        );

        list.appendChild(
            deleteBtn
        );

        taskList.appendChild(
            list
        );
    });


    // Update counters
    updateCounter();
}


/* =================================
   UPDATE COUNTERS
================================= */

function updateCounter() {

    // Count completed tasks
    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    // Calculate remaining tasks
    const remaining =
        tasks.length - completed;


    // Update UI
    taskCount.textContent =
        `Total Tasks: ${tasks.length}`;

    completedCount.textContent =
        `Completed: ${completed}`;

    remainingCount.textContent =
        `Remaining: ${remaining}`;
}


/* =================================
   ADD TASK BUTTON
================================= */

button.addEventListener(
    "click",
    addTask
);


/* =================================
   CLEAR ALL TASKS
================================= */

clearBtn.addEventListener(
    "click",
    () => {

        const confirmed = confirm(
            "Are you sure you want to delete all tasks?"
        );


        // Stop if user clicks Cancel
        if (!confirmed) {
            return;
        }


        // Empty the array
        tasks = [];


        // Save the empty array
        saveTasks();


        // Update the UI
        renderTasks();
    }
);


/* =================================
   ENTER KEY
================================= */

input.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            addTask();
        }
    }
);


/* =================================
   INITIALIZE APP
================================= */

// Get saved tasks
loadTasks();

// Display tasks
renderTasks();