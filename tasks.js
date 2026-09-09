// -------------------------------------
// PROJECT AQUIFER
// SHARED TASK MANAGEMENT
// SUPABASE VERSION
// -------------------------------------


// -------------------------------------
// HTML ELEMENTS
// -------------------------------------

const addTaskButton =
    document.getElementById(
        "addTaskButton"
    );


const taskModal =
    document.getElementById(
        "taskModal"
    );


const closeModalButton =
    document.getElementById(
        "closeModalButton"
    );


const cancelTaskButton =
    document.getElementById(
        "cancelTaskButton"
    );


const taskForm =
    document.getElementById(
        "taskForm"
    );


const saveTaskButton =
    document.getElementById(
        "saveTaskButton"
    );


const refreshTasksButton =
    document.getElementById(
        "refreshTasksButton"
    );


const openTaskList =
    document.getElementById(
        "openTaskList"
    );


const completedTaskList =
    document.getElementById(
        "completedTaskList"
    );


const openEmptyState =
    document.getElementById(
        "openEmptyState"
    );


const completedEmptyState =
    document.getElementById(
        "completedEmptyState"
    );


const openTaskCount =
    document.getElementById(
        "openTaskCount"
    );


const completedTaskCount =
    document.getElementById(
        "completedTaskCount"
    );


const taskMessage =
    document.getElementById(
        "taskMessage"
    );


// -------------------------------------
// LOCAL VARIABLE
//
// This is NOT localStorage.
// It simply holds whatever we currently
// downloaded from Supabase.
// -------------------------------------

let tasks = [];


// -------------------------------------
// OPEN ADD TASK WINDOW
// -------------------------------------

addTaskButton.addEventListener(
    "click",
    function () {

        taskModal.classList.add(
            "show"
        );

    }
);


// -------------------------------------
// CLOSE ADD TASK WINDOW
// -------------------------------------

function closeTaskModal() {

    taskModal.classList.remove(
        "show"
    );


    taskForm.reset();

}


closeModalButton.addEventListener(
    "click",
    closeTaskModal
);


cancelTaskButton.addEventListener(
    "click",
    closeTaskModal
);


// -------------------------------------
// LOAD TASKS FROM SUPABASE
// -------------------------------------

async function loadTasks() {

    showMessage(
        "Loading shared project tasks...",
        false
    );


    const {
        data,
        error
    } =
        await aquiferSupabase

            .from("tasks")

            .select("*")

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Could not load tasks:",
            error
        );


        showMessage(
            "Could not load the shared tasks. Check the browser console for details.",
            true
        );


        return;

    }


    tasks =
        data || [];


    hideMessage();


    renderTasks();

}


// -------------------------------------
// CREATE TASK IN SUPABASE
// -------------------------------------

taskForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const title =
            document
                .getElementById(
                    "taskTitle"
                )
                .value
                .trim();


        const assignee =
            document
                .getElementById(
                    "taskAssignee"
                )
                .value
                .trim();


        const dueDate =
            document
                .getElementById(
                    "taskDueDate"
                )
                .value;


        if (!title) {

            return;

        }


        saveTaskButton.disabled =
            true;


        saveTaskButton.textContent =
            "Saving...";


        const newTask = {

            title: title,

            assignee:
                assignee || null,

            due_date:
                dueDate || null,

            completed: false

        };


        const {
            error
        } =
            await aquiferSupabase

                .from("tasks")

                .insert(
                    newTask
                );


        saveTaskButton.disabled =
            false;


        saveTaskButton.textContent =
            "Save Task";


        if (error) {

            console.error(
                "Could not create task:",
                error
            );


            showMessage(
                "The task could not be saved to Supabase.",
                true
            );


            return;

        }


        closeTaskModal();


        await loadTasks();

    }
);


// -------------------------------------
// COMPLETE / REOPEN TASK
// -------------------------------------

async function toggleTask(
    taskId,
    completed
) {

    const {
        error
    } =
        await aquiferSupabase

            .from("tasks")

            .update({
                completed:
                    !completed
            })

            .eq(
                "id",
                taskId
            );


    if (error) {

        console.error(
            "Could not update task:",
            error
        );


        showMessage(
            "The task could not be updated.",
            true
        );


        return;

    }


    await loadTasks();

}


// -------------------------------------
// DELETE TASK
// -------------------------------------

async function deleteTask(
    taskId
) {

    const confirmed =
        confirm(
            "Delete this task?"
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } =
        await aquiferSupabase

            .from("tasks")

            .delete()

            .eq(
                "id",
                taskId
            );


    if (error) {

        console.error(
            "Could not delete task:",
            error
        );


        showMessage(
            "The task could not be deleted.",
            true
        );


        return;

    }


    await loadTasks();

}


// -------------------------------------
// CREATE TASK ROW
// -------------------------------------

function createTaskElement(
    task
) {

    const taskElement =
        document.createElement(
            "div"
        );


    taskElement.className =
        task.completed
        ? "task completed"
        : "task";


    const assignee =
        task.assignee
        ? "Assigned to " +
          task.assignee
        : "Unassigned";


    // TASK INFORMATION

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "task-info";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        task.title;


    const details =
        document.createElement(
            "p"
        );


    details.className =
        "task-details";


    details.textContent =
        assignee +
        " · " +
        formatDate(
            task.due_date
        );


    info.appendChild(
        title
    );


    info.appendChild(
        details
    );


    // STATUS

    const status =
        document.createElement(
            "span"
        );


    status.className =
        "task-status";


    status.textContent =
        task.completed
        ? "Completed"
        : "Open";


    // ACTIONS

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "task-actions";


    const toggleButton =
        document.createElement(
            "button"
        );


    toggleButton.className =
        "task-button";


    toggleButton.textContent =
        task.completed
        ? "Reopen"
        : "Complete";


    toggleButton.addEventListener(
        "click",
        function () {

            toggleTask(
                task.id,
                task.completed
            );

        }
    );


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.className =
        "task-button delete-button";


    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTask(
                task.id
            );

        }
    );


    actions.appendChild(
        toggleButton
    );


    actions.appendChild(
        deleteButton
    );


    taskElement.appendChild(
        info
    );


    taskElement.appendChild(
        status
    );


    taskElement.appendChild(
        actions
    );


    return taskElement;

}


// -------------------------------------
// DISPLAY TASKS
// -------------------------------------

function renderTasks() {

    openTaskList.innerHTML =
        "";


    completedTaskList.innerHTML =
        "";


    const openTasks =
        tasks.filter(
            task =>
                !task.completed
        );


    const completedTasks =
        tasks.filter(
            task =>
                task.completed
        );


    openTaskCount.textContent =
        openTasks.length;


    completedTaskCount.textContent =
        completedTasks.length;


    openEmptyState.style.display =
        openTasks.length === 0
        ? "block"
        : "none";


    completedEmptyState.style.display =
        completedTasks.length === 0
        ? "block"
        : "none";


    openTasks.forEach(
        function (task) {

            openTaskList.appendChild(
                createTaskElement(
                    task
                )
            );

        }
    );


    completedTasks.forEach(
        function (task) {

            completedTaskList.appendChild(
                createTaskElement(
                    task
                )
            );

        }
    );

}


// -------------------------------------
// REFRESH BUTTON
// -------------------------------------

refreshTasksButton.addEventListener(
    "click",
    loadTasks
);


// -------------------------------------
// DATE FORMAT
// -------------------------------------

function formatDate(
    dateString
) {

    if (!dateString) {

        return "No due date";

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// -------------------------------------
// STATUS MESSAGE
// -------------------------------------

function showMessage(
    message,
    isError
) {

    taskMessage.style.display =
        "block";


    taskMessage.textContent =
        message;


    taskMessage.style.color =
        isError
        ? "#8a3e3e"
        : "#5f6b75";

}


function hideMessage() {

    taskMessage.style.display =
        "none";

}


// -------------------------------------
// START
// -------------------------------------

loadTasks();


console.log(
    "Aquifer shared Tasks page loaded."
);