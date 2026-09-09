// =====================================
// PROJECT AQUIFER
// SHARED DASHBOARD
// SUPABASE VERSION
// =====================================


const PROJECT_BUDGET = 6000;


// DATA

let tasks = [];
let meetings = [];
let components = [];
let cadRecords = [];

let project = {
    id: 1,
    phase: "Concept Development",
    progress: 5
};


// =====================================
// ELEMENTS
// =====================================

const projectPhase =
    document.getElementById(
        "projectPhase"
    );


const projectProgress =
    document.getElementById(
        "projectProgress"
    );


const projectProgressBar =
    document.getElementById(
        "projectProgressBar"
    );


const budgetUsed =
    document.getElementById(
        "budgetUsed"
    );


const budgetRemaining =
    document.getElementById(
        "budgetRemaining"
    );


const openTaskCount =
    document.getElementById(
        "openTaskCount"
    );


const taskList =
    document.getElementById(
        "taskList"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


const nextMeetingDate =
    document.getElementById(
        "nextMeetingDate"
    );


const nextMeetingInfo =
    document.getElementById(
        "nextMeetingInfo"
    );


const cadCount =
    document.getElementById(
        "cadCount"
    );


const componentCount =
    document.getElementById(
        "componentCount"
    );


const completedMeetingCount =
    document.getElementById(
        "completedMeetingCount"
    );


const editProjectButton =
    document.getElementById(
        "editProjectButton"
    );


const projectModal =
    document.getElementById(
        "projectModal"
    );


const closeProjectModal =
    document.getElementById(
        "closeProjectModal"
    );


const cancelProjectEdit =
    document.getElementById(
        "cancelProjectEdit"
    );


const projectForm =
    document.getElementById(
        "projectForm"
    );


const saveProjectButton =
    document.getElementById(
        "saveProjectButton"
    );


const refreshDashboardButton =
    document.getElementById(
        "refreshDashboardButton"
    );


const dashboardMessage =
    document.getElementById(
        "dashboardMessage"
    );


// =====================================
// LOAD DASHBOARD
// =====================================

async function loadDashboard() {

    showMessage(
        "Loading shared Project Aquifer data...",
        false
    );


    try {

        await Promise.all([

            loadProject(),

            loadTasks(),

            loadMeetings(),

            loadComponents(),

            loadCadRecords()

        ]);


        renderDashboard();

        hideMessage();

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        showMessage(
            "Some shared project data could not be loaded.",
            true
        );

    }

}


// =====================================
// LOAD PROJECT
// =====================================

async function loadProject() {

    const {
        data,
        error
    } =
        await aquiferSupabase

            .from(
                "project_settings"
            )

            .select("*")

            .eq(
                "id",
                1
            )

            .single();


    if (error) {
        throw error;
    }


    project = data;

}


// =====================================
// LOAD TASKS
// =====================================

async function loadTasks() {

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
        throw error;
    }


    tasks =
        data || [];

}


// =====================================
// LOAD MEETINGS
// =====================================

async function loadMeetings() {

    const {
        data,
        error
    } =
        await aquiferSupabase

            .from("meetings")

            .select("*");


    if (error) {
        throw error;
    }


    meetings =
        data || [];

}


// =====================================
// LOAD COMPONENTS
// =====================================

async function loadComponents() {

    const {
        data,
        error
    } =
        await aquiferSupabase

            .from("components")

            .select("*");


    if (error) {
        throw error;
    }


    components =
        data || [];

}


// =====================================
// LOAD CAD
// =====================================

async function loadCadRecords() {

    const {
        data,
        error
    } =
        await aquiferSupabase

            .from("cad_records")

            .select("*");


    if (error) {
        throw error;
    }


    cadRecords =
        data || [];

}


// =====================================
// RENDER DASHBOARD
// =====================================

function renderDashboard() {

    renderProject();

    renderTasks();

    renderBudget();

    renderNextMeeting();

    renderCounts();

}


// =====================================
// PROJECT
// =====================================

function renderProject() {

    projectPhase.textContent =
        project.phase;


    projectProgress.textContent =
        project.progress + "%";


    projectProgressBar.style.width =
        project.progress + "%";

}


// =====================================
// TASKS
// =====================================

function renderTasks() {

    const openTasks =
        tasks.filter(
            task =>
                !task.completed
        );


    openTaskCount.textContent =
        openTasks.length;


    taskList.innerHTML =
        "";


    if (
        openTasks.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    openTasks
        .slice(0, 5)
        .forEach(
            function (task) {

                const taskElement =
                    document.createElement(
                        "div"
                    );


                taskElement.className =
                    "task";


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


                const assignee =
                    task.assignee
                    ? "Assigned to " +
                      task.assignee
                    : "Unassigned";


                details.textContent =
                    assignee
                    +
                    " · "
                    +
                    formatDate(
                        task.due_date
                    );


                info.appendChild(
                    title
                );


                info.appendChild(
                    details
                );


                const status =
                    document.createElement(
                        "span"
                    );


                status.className =
                    "task-status";


                status.textContent =
                    "Open";


                taskElement.appendChild(
                    info
                );


                taskElement.appendChild(
                    status
                );


                taskList.appendChild(
                    taskElement
                );

            }
        );

}


// =====================================
// BUDGET
// =====================================

function renderBudget() {

    const total =
        components.reduce(
            function (
                sum,
                component
            ) {

                return (
                    sum
                    +
                    (
                        Number(
                            component.quantity
                        )
                        *
                        Number(
                            component.unit_cost
                        )
                    )
                );

            },
            0
        );


    const remaining =
        PROJECT_BUDGET -
        total;


    budgetUsed.textContent =
        formatMoney(
            total
        );


    budgetRemaining.textContent =
        formatMoney(
            remaining
        );

}


// =====================================
// NEXT MEETING
// =====================================

function renderNextMeeting() {

    const now =
        new Date();


    const upcoming =
        meetings

            .filter(
                meeting =>
                    !meeting.completed
            )

            .map(
                function (meeting) {

                    return {

                        ...meeting,

                        dateTime:
                            new Date(
                                meeting.meeting_date
                                +
                                "T"
                                +
                                meeting.meeting_time
                            )

                    };

                }
            )

            .filter(
                meeting =>
                    meeting.dateTime >=
                    now
            )

            .sort(
                (a, b) =>
                    a.dateTime -
                    b.dateTime
            );


    if (
        upcoming.length === 0
    ) {

        nextMeetingDate.textContent =
            "—";


        nextMeetingInfo.textContent =
            "Not scheduled";


        return;

    }


    const next =
        upcoming[0];


    nextMeetingDate.textContent =
        next.dateTime
            .toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric"
                }
            );


    const time =
        next.dateTime
            .toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


    nextMeetingInfo.textContent =
        next.title +
        " · " +
        time;

}


// =====================================
// COUNTERS
// =====================================

function renderCounts() {

    cadCount.textContent =
        cadRecords.length
        +
        (
            cadRecords.length === 1
            ? " file"
            : " files"
        );


    componentCount.textContent =
        components.length
        +
        (
            components.length === 1
            ? " component"
            : " components"
        );


    const completedMeetings =
        meetings.filter(
            meeting =>
                meeting.completed
        );


    completedMeetingCount.textContent =
        completedMeetings.length
        +
        " completed";

}


// =====================================
// PROJECT EDITOR
// =====================================

editProjectButton.addEventListener(
    "click",
    function () {

        document.getElementById(
            "projectPhaseInput"
        ).value =
            project.phase;


        document.getElementById(
            "projectProgressInput"
        ).value =
            project.progress;


        projectModal.classList.add(
            "show"
        );

    }
);


function closeProjectEditor() {

    projectModal.classList.remove(
        "show"
    );

}


closeProjectModal.addEventListener(
    "click",
    closeProjectEditor
);


cancelProjectEdit.addEventListener(
    "click",
    closeProjectEditor
);


// =====================================
// SAVE PROJECT SETTINGS
// =====================================

projectForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const phase =
            document
                .getElementById(
                    "projectPhaseInput"
                )
                .value
                .trim();


        let progress =
            Number(
                document
                    .getElementById(
                        "projectProgressInput"
                    )
                    .value
            );


        progress =
            Math.max(
                0,
                Math.min(
                    100,
                    progress
                )
            );


        saveProjectButton.disabled =
            true;


        saveProjectButton.textContent =
            "Saving...";


        const {
            error
        } =
            await aquiferSupabase

                .from(
                    "project_settings"
                )

                .update({

                    phase:
                        phase,

                    progress:
                        progress,

                    updated_at:
                        new Date()
                            .toISOString()

                })

                .eq(
                    "id",
                    1
                );


        saveProjectButton.disabled =
            false;


        saveProjectButton.textContent =
            "Save Changes";


        if (error) {

            console.error(
                "Could not update project:",
                error
            );


            showMessage(
                "Project settings could not be updated.",
                true
            );


            return;

        }


        closeProjectEditor();


        await loadDashboard();

    }
);


// =====================================
// REFRESH
// =====================================

refreshDashboardButton.addEventListener(
    "click",
    loadDashboard
);


// =====================================
// UTILITIES
// =====================================

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


function formatMoney(
    value
) {

    return value.toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2
        }
    );

}


// =====================================
// MESSAGE
// =====================================

function showMessage(
    message,
    isError
) {

    dashboardMessage.style.display =
        "block";


    dashboardMessage.textContent =
        message;


    dashboardMessage.style.color =
        isError
        ? "#8a3e3e"
        : "#5f6b75";

}


function hideMessage() {

    dashboardMessage.style.display =
        "none";

}


// =====================================
// START
// =====================================

loadDashboard();


console.log(
    "Aquifer shared Dashboard loaded."
);