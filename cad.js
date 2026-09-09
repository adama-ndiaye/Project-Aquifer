// =====================================
// PROJECT AQUIFER
// SHARED CAD LIBRARY
// SUPABASE VERSION
// =====================================


// Current CAD records loaded from Supabase

let cadRecords = [];


// Used when editing an existing record

let selectedCadId =
    null;


// =====================================
// HTML ELEMENTS
// =====================================

const addCadButton =
    document.getElementById(
        "addCadButton"
    );


const cadModal =
    document.getElementById(
        "cadModal"
    );


const cadModalTitle =
    document.getElementById(
        "cadModalTitle"
    );


const closeCadModal =
    document.getElementById(
        "closeCadModal"
    );


const cancelCadButton =
    document.getElementById(
        "cancelCadButton"
    );


const cadForm =
    document.getElementById(
        "cadForm"
    );


const saveCadButton =
    document.getElementById(
        "saveCadButton"
    );


const refreshCadButton =
    document.getElementById(
        "refreshCadButton"
    );


const cadTableBody =
    document.getElementById(
        "cadTableBody"
    );


const cadTableWrapper =
    document.getElementById(
        "cadTableWrapper"
    );


const cadEmptyState =
    document.getElementById(
        "cadEmptyState"
    );


const cadRecordCount =
    document.getElementById(
        "cadRecordCount"
    );


const assemblyCount =
    document.getElementById(
        "assemblyCount"
    );


const latestRevision =
    document.getElementById(
        "latestRevision"
    );


const latestRevisionInfo =
    document.getElementById(
        "latestRevisionInfo"
    );


const cadMessage =
    document.getElementById(
        "cadMessage"
    );


// =====================================
// LOAD CAD RECORDS FROM SUPABASE
// =====================================

async function loadCadRecords() {

    showMessage(
        "Loading shared CAD records...",
        false
    );


    const {
        data,
        error
    } =
        await aquiferSupabase

            .from("cad_records")

            .select("*")

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Could not load CAD records:",
            error
        );


        showMessage(
            "Could not load the shared CAD library.",
            true
        );


        return;

    }


    cadRecords =
        data || [];


    hideMessage();


    renderCadRecords();

}


// =====================================
// OPEN ADD CAD MODAL
// =====================================

addCadButton.addEventListener(
    "click",
    function () {

        selectedCadId =
            null;


        cadModalTitle.textContent =
            "Add CAD Record";


        saveCadButton.textContent =
            "Save Record";


        cadForm.reset();


        document.getElementById(
            "cadType"
        ).value =
            "Part";


        document.getElementById(
            "cadStatus"
        ).value =
            "In Design";


        cadModal.classList.add(
            "show"
        );

    }
);


// =====================================
// OPEN EDIT CAD MODAL
// =====================================

function editCadRecord(
    recordId
) {

    const record =
        cadRecords.find(
            record =>
                record.id ===
                recordId
        );


    if (!record) {

        return;

    }


    selectedCadId =
        recordId;


    cadModalTitle.textContent =
        "Edit CAD Record";


    saveCadButton.textContent =
        "Save Changes";


    document.getElementById(
        "cadName"
    ).value =
        record.name || "";


    document.getElementById(
        "cadType"
    ).value =
        record.type || "Part";


    document.getElementById(
        "cadRevision"
    ).value =
        record.revision || "";


    document.getElementById(
        "cadOwner"
    ).value =
        record.owner || "";


    document.getElementById(
        "cadStatus"
    ).value =
        record.status || "In Design";


    document.getElementById(
        "cadFileName"
    ).value =
        record.file_name || "";


    document.getElementById(
        "cadNotes"
    ).value =
        record.notes || "";


    cadModal.classList.add(
        "show"
    );

}


// =====================================
// CLOSE MODAL
// =====================================

function closeCadEditor() {

    cadModal.classList.remove(
        "show"
    );


    cadForm.reset();


    selectedCadId =
        null;

}


closeCadModal.addEventListener(
    "click",
    closeCadEditor
);


cancelCadButton.addEventListener(
    "click",
    closeCadEditor
);


// =====================================
// SAVE CAD RECORD
// ADD OR EDIT
// =====================================

cadForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById(
                    "cadName"
                )
                .value
                .trim();


        const type =
            document
                .getElementById(
                    "cadType"
                )
                .value;


        const revision =
            document
                .getElementById(
                    "cadRevision"
                )
                .value
                .trim();


        const owner =
            document
                .getElementById(
                    "cadOwner"
                )
                .value
                .trim();


        const status =
            document
                .getElementById(
                    "cadStatus"
                )
                .value;


        const fileName =
            document
                .getElementById(
                    "cadFileName"
                )
                .value
                .trim();


        const notes =
            document
                .getElementById(
                    "cadNotes"
                )
                .value
                .trim();


        if (!name) {

            return;

        }


        saveCadButton.disabled =
            true;


        saveCadButton.textContent =
            "Saving...";


        const cadData = {

            name:
                name,

            type:
                type,

            revision:
                revision || null,

            owner:
                owner || null,

            status:
                status,

            file_name:
                fileName || null,

            notes:
                notes || null

        };


        let error;


        // ---------------------------------
        // EDIT EXISTING RECORD
        // ---------------------------------

        if (selectedCadId) {

            const result =
                await aquiferSupabase

                    .from("cad_records")

                    .update(
                        cadData
                    )

                    .eq(
                        "id",
                        selectedCadId
                    );


            error =
                result.error;

        }


        // ---------------------------------
        // CREATE NEW RECORD
        // ---------------------------------

        else {

            const result =
                await aquiferSupabase

                    .from("cad_records")

                    .insert(
                        cadData
                    );


            error =
                result.error;

        }


        saveCadButton.disabled =
            false;


        if (error) {

            console.error(
                "Could not save CAD record:",
                error
            );


            showMessage(
                "The CAD record could not be saved.",
                true
            );


            saveCadButton.textContent =
                selectedCadId
                ? "Save Changes"
                : "Save Record";


            return;

        }


        closeCadEditor();


        await loadCadRecords();

    }
);


// =====================================
// DELETE CAD RECORD
// =====================================

async function deleteCadRecord(
    recordId
) {

    const confirmed =
        confirm(
            "Delete this CAD record?"
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } =
        await aquiferSupabase

            .from("cad_records")

            .delete()

            .eq(
                "id",
                recordId
            );


    if (error) {

        console.error(
            "Could not delete CAD record:",
            error
        );


        showMessage(
            "The CAD record could not be deleted.",
            true
        );


        return;

    }


    await loadCadRecords();

}


// =====================================
// RENDER CAD LIBRARY
// =====================================

function renderCadRecords() {

    cadTableBody.innerHTML =
        "";


    // TOTAL CAD RECORDS

    cadRecordCount.textContent =
        cadRecords.length;


    // ASSEMBLY COUNT

    assemblyCount.textContent =
        cadRecords.filter(
            record =>
                record.type ===
                "Assembly"
        ).length;


    // EMPTY STATE

    if (
        cadRecords.length === 0
    ) {

        cadEmptyState.style.display =
            "block";


        cadTableWrapper.style.display =
            "none";


        latestRevision.textContent =
            "—";


        latestRevisionInfo.textContent =
            "No CAD records";


        return;

    }


    cadEmptyState.style.display =
        "none";


    cadTableWrapper.style.display =
        "block";


    // ---------------------------------
    // LATEST RECORD
    // ---------------------------------

    const newest =
        cadRecords[0];


    latestRevision.textContent =
        newest.revision
        ||
        "No Rev";


    latestRevisionInfo.textContent =
        newest.name;


    // ---------------------------------
    // TABLE
    // ---------------------------------

    cadRecords.forEach(
        function (record) {

            const row =
                document.createElement(
                    "tr"
                );


            // NAME

            const nameCell =
                document.createElement(
                    "td"
                );


            const name =
                document.createElement(
                    "strong"
                );


            name.textContent =
                record.name;


            const fileName =
                document.createElement(
                    "span"
                );


            fileName.className =
                "table-note";


            fileName.textContent =
                record.file_name
                ||
                "No filename";


            nameCell.appendChild(
                name
            );


            nameCell.appendChild(
                fileName
            );


            // TYPE

            const typeCell =
                document.createElement(
                    "td"
                );


            typeCell.textContent =
                record.type;


            // REVISION

            const revisionCell =
                document.createElement(
                    "td"
                );


            revisionCell.textContent =
                record.revision
                ||
                "—";


            // OWNER

            const ownerCell =
                document.createElement(
                    "td"
                );


            ownerCell.textContent =
                record.owner
                ||
                "—";


            // STATUS

            const statusCell =
                document.createElement(
                    "td"
                );


            const statusTag =
                document.createElement(
                    "span"
                );


            statusTag.className =
                "status-tag";


            statusTag.textContent =
                record.status;


            statusCell.appendChild(
                statusTag
            );


            // ACTIONS

            const actionsCell =
                document.createElement(
                    "td"
                );


            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "task-actions";


            const editButton =
                document.createElement(
                    "button"
                );


            editButton.className =
                "task-button";


            editButton.textContent =
                "Edit";


            editButton.addEventListener(
                "click",
                function () {

                    editCadRecord(
                        record.id
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

                    deleteCadRecord(
                        record.id
                    );

                }
            );


            actions.appendChild(
                editButton
            );


            actions.appendChild(
                deleteButton
            );


            actionsCell.appendChild(
                actions
            );


            // ADD CELLS TO ROW

            row.appendChild(
                nameCell
            );


            row.appendChild(
                typeCell
            );


            row.appendChild(
                revisionCell
            );


            row.appendChild(
                ownerCell
            );


            row.appendChild(
                statusCell
            );


            row.appendChild(
                actionsCell
            );


            // ADD ROW TO TABLE

            cadTableBody.appendChild(
                row
            );

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

    cadMessage.style.display =
        "block";


    cadMessage.textContent =
        message;


    cadMessage.style.color =
        isError
        ? "#8a3e3e"
        : "#5f6b75";

}


function hideMessage() {

    cadMessage.style.display =
        "none";

}


// =====================================
// REFRESH
// =====================================

refreshCadButton.addEventListener(
    "click",
    loadCadRecords
);


// =====================================
// START
// =====================================

loadCadRecords();


console.log(
    "Aquifer shared CAD Library loaded."
);