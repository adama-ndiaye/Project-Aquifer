// =====================================
// PROJECT AQUIFER
// SHARED MEETING MANAGEMENT
// SUPABASE VERSION
// =====================================


// -------------------------------------
// LOCAL PAGE DATA
//
// This variable only contains the
// meetings downloaded from Supabase.
// Supabase is now the permanent storage.
// -------------------------------------

let meetings = [];


// -------------------------------------
// CURRENT MEETING BEING COMPLETED
// OR EDITED
// -------------------------------------

let selectedMeetingId = null;


// -------------------------------------
// HTML ELEMENTS
// -------------------------------------

const scheduleMeetingButton =
    document.getElementById(
        "scheduleMeetingButton"
    );


const meetingModal =
    document.getElementById(
        "meetingModal"
    );


const closeMeetingModalButton =
    document.getElementById(
        "closeMeetingModalButton"
    );


const cancelMeetingButton =
    document.getElementById(
        "cancelMeetingButton"
    );


const meetingForm =
    document.getElementById(
        "meetingForm"
    );


const saveMeetingButton =
    document.getElementById(
        "saveMeetingButton"
    );


const refreshMeetingsButton =
    document.getElementById(
        "refreshMeetingsButton"
    );


const activeMeetingsContainer =
    document.getElementById(
        "activeMeetings"
    );


const completedMeetingsContainer =
    document.getElementById(
        "completedMeetings"
    );


const activeEmptyState =
    document.getElementById(
        "activeEmptyState"
    );


const completedEmptyState =
    document.getElementById(
        "completedEmptyState"
    );


const upcomingMeetingCount =
    document.getElementById(
        "upcomingMeetingCount"
    );


const completedMeetingCount =
    document.getElementById(
        "completedMeetingCount"
    );


const meetingPageNextDate =
    document.getElementById(
        "meetingPageNextDate"
    );


const meetingPageNextInfo =
    document.getElementById(
        "meetingPageNextInfo"
    );


const meetingMessage =
    document.getElementById(
        "meetingMessage"
    );


// -------------------------------------
// COMPLETION MODAL ELEMENTS
// -------------------------------------

const completeMeetingModal =
    document.getElementById(
        "completeMeetingModal"
    );


const closeCompleteMeetingButton =
    document.getElementById(
        "closeCompleteMeetingButton"
    );


const cancelCompleteMeeting =
    document.getElementById(
        "cancelCompleteMeeting"
    );


const completeMeetingForm =
    document.getElementById(
        "completeMeetingForm"
    );


const completionMeetingTitle =
    document.getElementById(
        "completionMeetingTitle"
    );


const completionModalHeading =
    document.getElementById(
        "completionModalHeading"
    );


const saveCompletionButton =
    document.getElementById(
        "saveCompletionButton"
    );


// =====================================
// LOAD MEETINGS FROM SUPABASE
// =====================================

async function loadMeetings() {

    showMessage(
        "Loading shared meetings...",
        false
    );


    const {
        data,
        error
    } =
        await aquiferSupabase

            .from("meetings")

            .select("*")

            .order(
                "meeting_date",
                {
                    ascending: true
                }
            )

            .order(
                "meeting_time",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Could not load meetings:",
            error
        );


        showMessage(
            "Could not load shared meetings. Check the browser console.",
            true
        );


        return;

    }


    meetings =
        data || [];


    hideMessage();


    renderMeetings();

}


// =====================================
// OPEN SCHEDULE MODAL
// =====================================

scheduleMeetingButton.addEventListener(
    "click",
    function () {

        meetingModal.classList.add(
            "show"
        );

    }
);


// =====================================
// CLOSE SCHEDULE MODAL
// =====================================

function closeMeetingModal() {

    meetingModal.classList.remove(
        "show"
    );


    meetingForm.reset();

}


closeMeetingModalButton.addEventListener(
    "click",
    closeMeetingModal
);


cancelMeetingButton.addEventListener(
    "click",
    closeMeetingModal
);


// =====================================
// CREATE NEW MEETING
// =====================================

meetingForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const title =
            document
                .getElementById(
                    "meetingTitle"
                )
                .value
                .trim();


        const meetingDate =
            document
                .getElementById(
                    "meetingDate"
                )
                .value;


        const meetingTime =
            document
                .getElementById(
                    "meetingTime"
                )
                .value;


        const location =
            document
                .getElementById(
                    "meetingLocation"
                )
                .value
                .trim();


        const recurrence =
            document
                .getElementById(
                    "meetingRecurrence"
                )
                .value;


        const agenda =
            document
                .getElementById(
                    "meetingAgenda"
                )
                .value
                .trim();


        if (
            !title
            ||
            !meetingDate
            ||
            !meetingTime
        ) {

            return;

        }


        saveMeetingButton.disabled =
            true;


        saveMeetingButton.textContent =
            "Saving...";


        // Generate the UUID here so recurring
        // meetings can immediately use the same
        // ID as their series identifier.

        const meetingId =
            crypto.randomUUID();


        const newMeeting = {

            id:
                meetingId,

            title:
                title,

            meeting_date:
                meetingDate,

            meeting_time:
                meetingTime,

            location:
                location || null,

            agenda:
                agenda || null,

            recurrence:
                recurrence,

            series_id:
                recurrence === "none"
                ? null
                : meetingId,

            completed:
                false,

            summary:
                null,

            decisions:
                null,

            action_items:
                null,

            completed_at:
                null

        };


        const {
            error
        } =
            await aquiferSupabase

                .from("meetings")

                .insert(
                    newMeeting
                );


        saveMeetingButton.disabled =
            false;


        saveMeetingButton.textContent =
            "Save Meeting";


        if (error) {

            console.error(
                "Could not create meeting:",
                error
            );


            showMessage(
                "The meeting could not be saved.",
                true
            );


            return;

        }


        closeMeetingModal();


        await loadMeetings();

    }
);


// =====================================
// OPEN COMPLETE MEETING MODAL
// =====================================

function openCompleteMeeting(
    meetingId
) {

    const meeting =
        meetings.find(
            meeting =>
                meeting.id ===
                meetingId
        );


    if (!meeting) {

        return;

    }


    selectedMeetingId =
        meetingId;


    completionModalHeading.textContent =
        "Complete Meeting";


    completionMeetingTitle.textContent =
        meeting.title;


    document.getElementById(
        "meetingSummary"
    ).value =
        meeting.summary || "";


    document.getElementById(
        "meetingDecisions"
    ).value =
        meeting.decisions || "";


    document.getElementById(
        "meetingActionItems"
    ).value =
        meeting.action_items || "";


    saveCompletionButton.textContent =
        "Save & Complete";


    completeMeetingModal.classList.add(
        "show"
    );

}


// =====================================
// EDIT COMPLETED NOTES
// =====================================

function editMeetingNotes(
    meetingId
) {

    const meeting =
        meetings.find(
            meeting =>
                meeting.id ===
                meetingId
        );


    if (!meeting) {

        return;

    }


    selectedMeetingId =
        meetingId;


    completionModalHeading.textContent =
        "Edit Meeting Notes";


    completionMeetingTitle.textContent =
        meeting.title;


    document.getElementById(
        "meetingSummary"
    ).value =
        meeting.summary || "";


    document.getElementById(
        "meetingDecisions"
    ).value =
        meeting.decisions || "";


    document.getElementById(
        "meetingActionItems"
    ).value =
        meeting.action_items || "";


    saveCompletionButton.textContent =
        "Save Notes";


    completeMeetingModal.classList.add(
        "show"
    );

}


// =====================================
// CLOSE COMPLETION MODAL
// =====================================

function closeCompletionModal() {

    completeMeetingModal.classList.remove(
        "show"
    );


    completeMeetingForm.reset();


    selectedMeetingId =
        null;

}


closeCompleteMeetingButton.addEventListener(
    "click",
    closeCompletionModal
);


cancelCompleteMeeting.addEventListener(
    "click",
    closeCompletionModal
);


// =====================================
// COMPLETE MEETING OR EDIT NOTES
// =====================================

completeMeetingForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!selectedMeetingId) {

            return;

        }


        saveCompletionButton.disabled =
            true;


        saveCompletionButton.textContent =
            "Saving...";


        // Fetch the freshest database version
        // first. This matters because another
        // teammate may have changed it.

        const {
            data: currentMeeting,
            error: fetchError
        } =
            await aquiferSupabase

                .from("meetings")

                .select("*")

                .eq(
                    "id",
                    selectedMeetingId
                )

                .single();


        if (fetchError) {

            console.error(
                "Could not fetch meeting:",
                fetchError
            );


            saveCompletionButton.disabled =
                false;


            saveCompletionButton.textContent =
                "Save";


            showMessage(
                "Could not access the meeting.",
                true
            );


            return;

        }


        const summary =
            document
                .getElementById(
                    "meetingSummary"
                )
                .value
                .trim();


        const decisions =
            document
                .getElementById(
                    "meetingDecisions"
                )
                .value
                .trim();


        const actionItems =
            document
                .getElementById(
                    "meetingActionItems"
                )
                .value
                .trim();


        const wasAlreadyCompleted =
            currentMeeting.completed;


        const updateData = {

            summary:
                summary || null,

            decisions:
                decisions || null,

            action_items:
                actionItems || null

        };


        // If this is the first completion,
        // mark the meeting completed.

        if (!wasAlreadyCompleted) {

            updateData.completed =
                true;


            updateData.completed_at =
                new Date().toISOString();

        }


        const {
            error: updateError
        } =
            await aquiferSupabase

                .from("meetings")

                .update(
                    updateData
                )

                .eq(
                    "id",
                    selectedMeetingId
                );


        if (updateError) {

            console.error(
                "Could not update meeting:",
                updateError
            );


            saveCompletionButton.disabled =
                false;


            showMessage(
                "The meeting could not be updated.",
                true
            );


            return;

        }


        // Only create another occurrence the
        // first time the meeting is completed.

        if (
            !wasAlreadyCompleted
            &&
            currentMeeting.recurrence !==
                "none"
        ) {

            await createNextRecurringMeeting(
                currentMeeting
            );

        }


        saveCompletionButton.disabled =
            false;


        closeCompletionModal();


        await loadMeetings();

    }
);


// =====================================
// CREATE NEXT RECURRING OCCURRENCE
// =====================================

async function createNextRecurringMeeting(
    completedMeeting
) {

    let nextDate =
        calculateNextOccurrence(
            completedMeeting.meeting_date,
            completedMeeting.recurrence
        );


    const now =
        new Date();


    let nextDateTime =
        new Date(
            nextDate +
            "T" +
            completedMeeting.meeting_time
        );


    // If someone completes an old meeting,
    // keep advancing until the next meeting
    // is actually in the future.

    while (
        nextDateTime < now
    ) {

        nextDate =
            calculateNextOccurrence(
                nextDate,
                completedMeeting.recurrence
            );


        nextDateTime =
            new Date(
                nextDate +
                "T" +
                completedMeeting.meeting_time
            );

    }


    // Check the shared database to prevent
    // duplicate recurring meetings.

    const {
        data: existingMeetings,
        error: duplicateCheckError
    } =
        await aquiferSupabase

            .from("meetings")

            .select("id")

            .eq(
                "series_id",
                completedMeeting.series_id
            )

            .eq(
                "meeting_date",
                nextDate
            )

            .eq(
                "meeting_time",
                completedMeeting.meeting_time
            )

            .eq(
                "completed",
                false
            );


    if (duplicateCheckError) {

        console.error(
            "Could not check recurrence:",
            duplicateCheckError
        );


        return;

    }


    if (
        existingMeetings
        &&
        existingMeetings.length > 0
    ) {

        return;

    }


    const nextMeeting = {

        id:
            crypto.randomUUID(),

        title:
            completedMeeting.title,

        meeting_date:
            nextDate,

        meeting_time:
            completedMeeting.meeting_time,

        location:
            completedMeeting.location,

        agenda:
            completedMeeting.agenda,

        recurrence:
            completedMeeting.recurrence,

        series_id:
            completedMeeting.series_id,

        completed:
            false,

        summary:
            null,

        decisions:
            null,

        action_items:
            null,

        completed_at:
            null

    };


    const {
        error
    } =
        await aquiferSupabase

            .from("meetings")

            .insert(
                nextMeeting
            );


    if (error) {

        console.error(
            "Could not create next recurring meeting:",
            error
        );

    }

}


// =====================================
// REOPEN MEETING
// =====================================

async function reopenMeeting(
    meetingId
) {

    const confirmed =
        confirm(
            "Reopen this meeting?"
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } =
        await aquiferSupabase

            .from("meetings")

            .update({

                completed:
                    false,

                completed_at:
                    null

            })

            .eq(
                "id",
                meetingId
            );


    if (error) {

        console.error(
            "Could not reopen meeting:",
            error
        );


        showMessage(
            "The meeting could not be reopened.",
            true
        );


        return;

    }


    await loadMeetings();

}


// =====================================
// DELETE MEETING
// =====================================

async function deleteMeeting(
    meetingId
) {

    const confirmed =
        confirm(
            "Delete this meeting?"
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } =
        await aquiferSupabase

            .from("meetings")

            .delete()

            .eq(
                "id",
                meetingId
            );


    if (error) {

        console.error(
            "Could not delete meeting:",
            error
        );


        showMessage(
            "The meeting could not be deleted.",
            true
        );


        return;

    }


    await loadMeetings();

}


// =====================================
// DISPLAY MEETINGS
// =====================================

function renderMeetings() {

    activeMeetingsContainer.innerHTML =
        "";


    completedMeetingsContainer.innerHTML =
        "";


    const active =
        meetings

            .filter(
                meeting =>
                    !meeting.completed
            )

            .sort(
                (a, b) =>
                    getMeetingDateTime(a)
                    -
                    getMeetingDateTime(b)
            );


    const completed =
        meetings

            .filter(
                meeting =>
                    meeting.completed
            )

            .sort(
                (a, b) =>
                    getMeetingDateTime(b)
                    -
                    getMeetingDateTime(a)
            );


    upcomingMeetingCount.textContent =
        active.length;


    completedMeetingCount.textContent =
        completed.length;


    activeEmptyState.style.display =
        active.length === 0
        ? "block"
        : "none";


    completedEmptyState.style.display =
        completed.length === 0
        ? "block"
        : "none";


    active.forEach(
        function (meeting) {

            activeMeetingsContainer
                .appendChild(
                    createMeetingElement(
                        meeting,
                        false
                    )
                );

        }
    );


    completed.forEach(
        function (meeting) {

            completedMeetingsContainer
                .appendChild(
                    createMeetingElement(
                        meeting,
                        true
                    )
                );

        }
    );


    renderNextMeeting();

}


// =====================================
// CREATE MEETING ELEMENT
// =====================================

function createMeetingElement(
    meeting,
    isCompleted
) {

    const dateTime =
        getMeetingDateTime(
            meeting
        );


    const month =
        dateTime
            .toLocaleDateString(
                "en-US",
                {
                    month: "short"
                }
            )
            .toUpperCase();


    const day =
        dateTime
            .toLocaleDateString(
                "en-US",
                {
                    day: "numeric"
                }
            );


    const time =
        dateTime
            .toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


    const location =
        meeting.location
        ||
        "Location not specified";


    const agenda =
        meeting.agenda
        ||
        "No agenda added.";


    const recurrenceText =
        getRecurrenceText(
            meeting.recurrence
        );


    const isOverdue =
        (
            !meeting.completed
            &&
            dateTime < new Date()
        );


    const meetingElement =
        document.createElement(
            "div"
        );


    meetingElement.className =
        "meeting-item";


    // DATE BLOCK

    const dateBlock =
        document.createElement(
            "div"
        );


    dateBlock.className =
        "meeting-date-block";


    const monthElement =
        document.createElement(
            "span"
        );


    monthElement.className =
        "meeting-month";


    monthElement.textContent =
        month;


    const dayElement =
        document.createElement(
            "span"
        );


    dayElement.className =
        "meeting-day";


    dayElement.textContent =
        day;


    dateBlock.appendChild(
        monthElement
    );


    dateBlock.appendChild(
        dayElement
    );


    // INFORMATION

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "meeting-info";


    const heading =
        document.createElement(
            "h3"
        );


    heading.textContent =
        meeting.title;


    if (isOverdue) {

        const overdueBadge =
            document.createElement(
                "span"
            );


        overdueBadge.className =
            "overdue-badge";


        overdueBadge.textContent =
            "Needs completion";


        heading.appendChild(
            overdueBadge
        );

    }


    const meta =
        document.createElement(
            "p"
        );


    meta.className =
        "meeting-meta";


    meta.textContent =
        time +
        " · " +
        location +
        (
            recurrenceText
            ? " · " + recurrenceText
            : ""
        );


    const agendaElement =
        document.createElement(
            "p"
        );


    agendaElement.className =
        "meeting-agenda";


    agendaElement.textContent =
        "Agenda: " +
        agenda;


    info.appendChild(
        heading
    );


    info.appendChild(
        meta
    );


    info.appendChild(
        agendaElement
    );


    // COMPLETED MEETING RECORD

    if (isCompleted) {

        const record =
            document.createElement(
                "div"
            );


        record.className =
            "meeting-record";


        record.appendChild(
            createRecordSection(
                "Meeting Summary / Notes",
                meeting.summary
                ||
                "No summary added."
            )
        );


        record.appendChild(
            createRecordSection(
                "Decisions Made",
                meeting.decisions
                ||
                "No decisions recorded."
            )
        );


        record.appendChild(
            createRecordSection(
                "Action Items",
                meeting.action_items
                ||
                "No action items recorded."
            )
        );


        info.appendChild(
            record
        );

    }


    // ACTION BUTTONS

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "meeting-actions";


    if (isCompleted) {

        const editButton =
            document.createElement(
                "button"
            );


        editButton.className =
            "task-button";


        editButton.textContent =
            "Edit Notes";


        editButton.addEventListener(
            "click",
            function () {

                editMeetingNotes(
                    meeting.id
                );

            }
        );


        const reopenButton =
            document.createElement(
                "button"
            );


        reopenButton.className =
            "task-button secondary-button";


        reopenButton.textContent =
            "Reopen";


        reopenButton.addEventListener(
            "click",
            function () {

                reopenMeeting(
                    meeting.id
                );

            }
        );


        actions.appendChild(
            editButton
        );


        actions.appendChild(
            reopenButton
        );

    }

    else {

        const completeButton =
            document.createElement(
                "button"
            );


        completeButton.className =
            "task-button";


        completeButton.textContent =
            "Complete Meeting";


        completeButton.addEventListener(
            "click",
            function () {

                openCompleteMeeting(
                    meeting.id
                );

            }
        );


        actions.appendChild(
            completeButton
        );

    }


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

            deleteMeeting(
                meeting.id
            );

        }
    );


    actions.appendChild(
        deleteButton
    );


    meetingElement.appendChild(
        dateBlock
    );


    meetingElement.appendChild(
        info
    );


    meetingElement.appendChild(
        actions
    );


    return meetingElement;

}


// =====================================
// RECORD SECTION
// =====================================

function createRecordSection(
    title,
    content
) {

    const section =
        document.createElement(
            "div"
        );


    section.className =
        "meeting-record-section";


    const heading =
        document.createElement(
            "strong"
        );


    heading.textContent =
        title;


    const paragraph =
        document.createElement(
            "p"
        );


    paragraph.textContent =
        content;


    section.appendChild(
        heading
    );


    section.appendChild(
        paragraph
    );


    return section;

}


// =====================================
// NEXT MEETING
// =====================================

function renderNextMeeting() {

    const now =
        new Date();


    const future =
        meetings

            .filter(
                meeting =>
                    !meeting.completed
            )

            .map(
                meeting => ({

                    ...meeting,

                    dateTime:
                        getMeetingDateTime(
                            meeting
                        )

                })
            )

            .filter(
                meeting =>
                    meeting.dateTime >= now
            )

            .sort(
                (a, b) =>
                    a.dateTime -
                    b.dateTime
            );


    if (
        future.length === 0
    ) {

        meetingPageNextDate.textContent =
            "—";


        meetingPageNextInfo.textContent =
            "Not scheduled";


        return;

    }


    const next =
        future[0];


    meetingPageNextDate.textContent =
        next.dateTime
            .toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric"
                }
            );


    meetingPageNextInfo.textContent =
        next.title +
        " · " +
        next.dateTime
            .toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );

}


// =====================================
// RECURRENCE
// =====================================

function getRecurrenceText(
    recurrence
) {

    if (
        recurrence === "weekly"
    ) {

        return "Repeats weekly";

    }


    if (
        recurrence === "biweekly"
    ) {

        return "Repeats every 2 weeks";

    }


    if (
        recurrence === "monthly"
    ) {

        return "Repeats monthly";

    }


    return "";

}


// =====================================
// CALCULATE NEXT OCCURRENCE
// =====================================

function calculateNextOccurrence(
    dateString,
    recurrence
) {

    if (
        recurrence === "monthly"
    ) {

        return addOneMonthSafely(
            dateString
        );

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    if (
        recurrence === "weekly"
    ) {

        date.setDate(
            date.getDate() + 7
        );

    }


    if (
        recurrence === "biweekly"
    ) {

        date.setDate(
            date.getDate() + 14
        );

    }


    return formatDateForStorage(
        date
    );

}


// =====================================
// SAFE MONTH ADDITION
// =====================================

function addOneMonthSafely(
    dateString
) {

    const parts =
        dateString
            .split("-")
            .map(Number);


    const year =
        parts[0];


    const month =
        parts[1];


    const day =
        parts[2];


    let nextYear =
        year;


    let nextMonth =
        month + 1;


    if (
        nextMonth > 12
    ) {

        nextMonth =
            1;


        nextYear +=
            1;

    }


    const lastDay =
        new Date(
            nextYear,
            nextMonth,
            0
        ).getDate();


    const safeDay =
        Math.min(
            day,
            lastDay
        );


    return (
        nextYear
        +
        "-"
        +
        String(nextMonth)
            .padStart(
                2,
                "0"
            )
        +
        "-"
        +
        String(safeDay)
            .padStart(
                2,
                "0"
            )
    );

}


// =====================================
// DATE → YYYY-MM-DD
// =====================================

function formatDateForStorage(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year
        +
        "-"
        +
        month
        +
        "-"
        +
        day
    );

}


// =====================================
// MEETING DATE/TIME
// =====================================

function getMeetingDateTime(
    meeting
) {

    return new Date(
        meeting.meeting_date
        +
        "T"
        +
        meeting.meeting_time
    );

}


// =====================================
// STATUS MESSAGE
// =====================================

function showMessage(
    message,
    isError
) {

    meetingMessage.style.display =
        "block";


    meetingMessage.textContent =
        message;


    meetingMessage.style.color =
        isError
        ? "#8a3e3e"
        : "#5f6b75";

}


function hideMessage() {

    meetingMessage.style.display =
        "none";

}


// =====================================
// REFRESH
// =====================================

refreshMeetingsButton.addEventListener(
    "click",
    loadMeetings
);


// =====================================
// START
// =====================================

loadMeetings();


console.log(
    "Aquifer shared Meetings page loaded."
);