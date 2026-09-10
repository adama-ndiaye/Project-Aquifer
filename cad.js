// ============================================
// PROJECT AQUIFER
// SHARED PROJECT FILE LIBRARY
// SUPABASE STORAGE VERSION
// ============================================


const STORAGE_BUCKET =
    "project-files";


let projectFiles = [];

let selectedFileId =
    null;


// ============================================
// HTML ELEMENTS
// ============================================

const addFileButton =
    document.getElementById(
        "addFileButton"
    );


const fileModal =
    document.getElementById(
        "fileModal"
    );


const fileModalTitle =
    document.getElementById(
        "fileModalTitle"
    );


const closeFileModal =
    document.getElementById(
        "closeFileModal"
    );


const cancelFileButton =
    document.getElementById(
        "cancelFileButton"
    );


const fileForm =
    document.getElementById(
        "fileForm"
    );


const saveFileButton =
    document.getElementById(
        "saveFileButton"
    );


const actualFileSection =
    document.getElementById(
        "actualFileSection"
    );


const actualFileInput =
    document.getElementById(
        "actualFile"
    );


const existingFileInfo =
    document.getElementById(
        "existingFileInfo"
    );


const refreshFilesButton =
    document.getElementById(
        "refreshFilesButton"
    );


const fileTableBody =
    document.getElementById(
        "fileTableBody"
    );


const fileTableWrapper =
    document.getElementById(
        "fileTableWrapper"
    );


const fileEmptyState =
    document.getElementById(
        "fileEmptyState"
    );


const totalFileCount =
    document.getElementById(
        "totalFileCount"
    );


const cadFileCount =
    document.getElementById(
        "cadFileCount"
    );


const matlabFileCount =
    document.getElementById(
        "matlabFileCount"
    );


const meetingFileCount =
    document.getElementById(
        "meetingFileCount"
    );


const fileMessage =
    document.getElementById(
        "fileMessage"
    );


const fileSearchInput =
    document.getElementById(
        "fileSearchInput"
    );


const fileCategoryFilter =
    document.getElementById(
        "fileCategoryFilter"
    );


// ============================================
// LOAD FILE METADATA
// ============================================

async function loadProjectFiles() {

    showMessage(
        "Loading shared project files...",
        false
    );


    const {
        data,
        error
    } =
        await aquiferSupabase

            .from(
                "project_files"
            )

            .select("*")

            .order(
                "uploaded_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Could not load project files:",
            error
        );


        showMessage(
            "Could not load the shared file library.",
            true
        );


        return;

    }


    projectFiles =
        data || [];


    hideMessage();


    renderSummary();

    renderFiles();

}


// ============================================
// OPEN ADD FILE MODAL
// ============================================

addFileButton.addEventListener(
    "click",
    function () {

        selectedFileId =
            null;


        fileForm.reset();


        fileModalTitle.textContent =
            "Add File";


        saveFileButton.textContent =
            "Upload File";


        actualFileSection.style.display =
            "block";


        actualFileInput.required =
            true;


        existingFileInfo.style.display =
            "none";


        document.getElementById(
            "fileCategory"
        ).value =
            "CAD File";


        fileModal.classList.add(
            "show"
        );

    }
);


// ============================================
// OPEN EDIT FILE METADATA
// ============================================

function editFile(
    fileId
) {

    const fileRecord =
        projectFiles.find(
            file =>
                file.id ===
                fileId
        );


    if (!fileRecord) {

        return;

    }


    selectedFileId =
        fileId;


    fileModalTitle.textContent =
        "Edit File Information";


    saveFileButton.textContent =
        "Save Changes";


    document.getElementById(
        "fileDisplayName"
    ).value =
        fileRecord.display_name || "";


    document.getElementById(
        "fileCategory"
    ).value =
        fileRecord.category || "Other";


    document.getElementById(
        "fileOwner"
    ).value =
        fileRecord.owner || "";


    document.getElementById(
        "fileRevision"
    ).value =
        fileRecord.revision || "";


    document.getElementById(
        "fileRelatedTo"
    ).value =
        fileRecord.related_to || "";


    document.getElementById(
        "fileDescription"
    ).value =
        fileRecord.description || "";


    // Do not replace the engineering file
    // during a metadata edit.

    actualFileSection.style.display =
        "none";


    actualFileInput.required =
        false;


    existingFileInfo.style.display =
        "block";


    existingFileInfo.textContent =
        "Current file: "
        +
        fileRecord.file_name
        +
        ". Editing this record changes only its information, not the uploaded file.";


    fileModal.classList.add(
        "show"
    );

}


// ============================================
// CLOSE MODAL
// ============================================

function closeFileEditor() {

    fileModal.classList.remove(
        "show"
    );


    fileForm.reset();


    selectedFileId =
        null;


    actualFileInput.required =
        false;


    actualFileSection.style.display =
        "block";


    existingFileInfo.style.display =
        "none";

}


closeFileModal.addEventListener(
    "click",
    closeFileEditor
);


cancelFileButton.addEventListener(
    "click",
    closeFileEditor
);


// ============================================
// SAVE FILE
// ============================================

fileForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const displayName =
            document
                .getElementById(
                    "fileDisplayName"
                )
                .value
                .trim();


        const category =
            document
                .getElementById(
                    "fileCategory"
                )
                .value;


        const owner =
            document
                .getElementById(
                    "fileOwner"
                )
                .value
                .trim();


        const revision =
            document
                .getElementById(
                    "fileRevision"
                )
                .value
                .trim();


        const relatedTo =
            document
                .getElementById(
                    "fileRelatedTo"
                )
                .value
                .trim();


        const description =
            document
                .getElementById(
                    "fileDescription"
                )
                .value
                .trim();


        if (!displayName) {

            return;

        }


        saveFileButton.disabled =
            true;


        saveFileButton.textContent =
            selectedFileId
            ? "Saving..."
            : "Uploading...";


        // ====================================
        // EDIT METADATA ONLY
        // ====================================

        if (selectedFileId) {

            const {
                error
            } =
                await aquiferSupabase

                    .from(
                        "project_files"
                    )

                    .update({

                        display_name:
                            displayName,

                        category:
                            category,

                        owner:
                            owner || null,

                        revision:
                            revision || null,

                        related_to:
                            relatedTo || null,

                        description:
                            description || null

                    })

                    .eq(
                        "id",
                        selectedFileId
                    );


            saveFileButton.disabled =
                false;


            saveFileButton.textContent =
                "Save Changes";


            if (error) {

                console.error(
                    "Could not update file information:",
                    error
                );


                showMessage(
                    "The file information could not be updated.",
                    true
                );


                return;

            }


            closeFileEditor();


            await loadProjectFiles();


            return;

        }


        // ====================================
        // NEW ACTUAL FILE UPLOAD
        // ====================================

        const actualFile =
            actualFileInput.files[0];


        if (!actualFile) {

            saveFileButton.disabled =
                false;


            saveFileButton.textContent =
                "Upload File";


            showMessage(
                "Choose a file to upload.",
                true
            );


            return;

        }


        const safeFileName =
            sanitizeFileName(
                actualFile.name
            );


        const categoryFolder =
            sanitizeFolderName(
                category
            );


        const uniqueId =
            crypto.randomUUID();


        const storagePath =
            categoryFolder
            +
            "/"
            +
            uniqueId
            +
            "-"
            +
            safeFileName;


        // ------------------------------------
        // UPLOAD ACTUAL FILE TO STORAGE
        // ------------------------------------

        const {
            error: uploadError
        } =
            await aquiferSupabase

                .storage

                .from(
                    STORAGE_BUCKET
                )

                .upload(
                    storagePath,
                    actualFile,
                    {
                        upsert: false
                    }
                );


        if (uploadError) {

            console.error(
                "Could not upload file:",
                uploadError
            );


            saveFileButton.disabled =
                false;


            saveFileButton.textContent =
                "Upload File";


            showMessage(
                "The actual file could not be uploaded.",
                true
            );


            return;

        }


        // ------------------------------------
        // SAVE FILE INFORMATION
        // ------------------------------------

        const {
            error: databaseError
        } =
            await aquiferSupabase

                .from(
                    "project_files"
                )

                .insert({

                    display_name:
                        displayName,

                    category:
                        category,

                    file_name:
                        actualFile.name,

                    storage_path:
                        storagePath,

                    owner:
                        owner || null,

                    revision:
                        revision || null,

                    related_to:
                        relatedTo || null,

                    description:
                        description || null,

                    mime_type:
                        actualFile.type || null,

                    file_size:
                        actualFile.size

                });


        // If metadata failed,
        // remove the uploaded orphan file.

        if (databaseError) {

            console.error(
                "Could not save file information:",
                databaseError
            );


            await aquiferSupabase

                .storage

                .from(
                    STORAGE_BUCKET
                )

                .remove([
                    storagePath
                ]);


            saveFileButton.disabled =
                false;


            saveFileButton.textContent =
                "Upload File";


            showMessage(
                "The file was uploaded, but its project record could not be created. The upload was rolled back.",
                true
            );


            return;

        }


        saveFileButton.disabled =
            false;


        saveFileButton.textContent =
            "Upload File";


        closeFileEditor();


        await loadProjectFiles();

    }
);


// ============================================
// DOWNLOAD ACTUAL FILE
// ============================================

async function downloadFile(
    fileId
) {

    const fileRecord =
        projectFiles.find(
            file =>
                file.id ===
                fileId
        );


    if (!fileRecord) {

        return;

    }


    showMessage(
        "Preparing "
        +
        fileRecord.file_name
        +
        "...",
        false
    );


    const {
        data,
        error
    } =
        await aquiferSupabase

            .storage

            .from(
                STORAGE_BUCKET
            )

            .download(
                fileRecord.storage_path
            );


    if (error) {

        console.error(
            "Could not download file:",
            error
        );


        showMessage(
            "The file could not be downloaded.",
            true
        );


        return;

    }


    const objectUrl =
        URL.createObjectURL(
            data
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        objectUrl;


    link.download =
        fileRecord.file_name;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        objectUrl
    );


    hideMessage();

}


// ============================================
// DELETE FILE
// ============================================

async function deleteFile(
    fileId
) {

    const fileRecord =
        projectFiles.find(
            file =>
                file.id ===
                fileId
        );


    if (!fileRecord) {

        return;

    }


    const confirmed =
        confirm(
            "Delete \""
            +
            fileRecord.display_name
            +
            "\"?\n\nThis will remove the actual uploaded file and its project record."
        );


    if (!confirmed) {

        return;

    }


    // ------------------------------------
    // REMOVE ACTUAL STORAGE FILE
    // ------------------------------------

    const {
        error: storageError
    } =
        await aquiferSupabase

            .storage

            .from(
                STORAGE_BUCKET
            )

            .remove([
                fileRecord.storage_path
            ]);


    if (storageError) {

        console.error(
            "Could not delete stored file:",
            storageError
        );


        showMessage(
            "The actual file could not be deleted.",
            true
        );


        return;

    }


    // ------------------------------------
    // REMOVE DATABASE RECORD
    // ------------------------------------

    const {
        error: databaseError
    } =
        await aquiferSupabase

            .from(
                "project_files"
            )

            .delete()

            .eq(
                "id",
                fileId
            );


    if (databaseError) {

        console.error(
            "Could not delete file record:",
            databaseError
        );


        showMessage(
            "The stored file was removed, but its database record could not be deleted.",
            true
        );


        return;

    }


    await loadProjectFiles();

}


// ============================================
// SUMMARY CARDS
// ============================================

function renderSummary() {

    totalFileCount.textContent =
        projectFiles.length;


    cadFileCount.textContent =
        projectFiles.filter(
            file =>
                file.category ===
                "CAD File"
        ).length;


    matlabFileCount.textContent =
        projectFiles.filter(
            file =>
                file.category ===
                "MATLAB / Simulink"
        ).length;


    meetingFileCount.textContent =
        projectFiles.filter(
            file =>
                file.category ===
                "Meeting Notes"
        ).length;

}


// ============================================
// FILTER + RENDER
// ============================================

function renderFiles() {

    const searchTerm =
        fileSearchInput
            .value
            .trim()
            .toLowerCase();


    const selectedCategory =
        fileCategoryFilter.value;


    const filteredFiles =
        projectFiles.filter(
            function (file) {

                const matchesCategory =
                    selectedCategory === "all"
                    ||
                    file.category ===
                    selectedCategory;


                const searchableText = [

                    file.display_name,
                    file.file_name,
                    file.category,
                    file.owner,
                    file.revision,
                    file.related_to,
                    file.description

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    searchableText.includes(
                        searchTerm
                    );


                return (
                    matchesCategory
                    &&
                    matchesSearch
                );

            }
        );


    fileTableBody.innerHTML =
        "";


    // ------------------------------------
    // EMPTY STATE
    // ------------------------------------

    if (
        filteredFiles.length === 0
    ) {

        fileTableWrapper.style.display =
            "none";


        fileEmptyState.style.display =
            "block";


        if (
            projectFiles.length === 0
        ) {

            fileEmptyState
                .querySelector("h3")
                .textContent =
                "No project files yet";


            fileEmptyState
                .querySelector("p")
                .textContent =
                "Upload your first CAD model, simulation, meeting document, test spreadsheet, or report.";

        }

        else {

            fileEmptyState
                .querySelector("h3")
                .textContent =
                "No matching files";


            fileEmptyState
                .querySelector("p")
                .textContent =
                "Try changing your search or category filter.";

        }


        return;

    }


    fileTableWrapper.style.display =
        "block";


    fileEmptyState.style.display =
        "none";


    // ------------------------------------
    // ROWS
    // ------------------------------------

    filteredFiles.forEach(
        function (file) {

            const row =
                document.createElement(
                    "tr"
                );


            // ==============================
            // FILE
            // ==============================

            const fileCell =
                document.createElement(
                    "td"
                );


            const displayName =
                document.createElement(
                    "strong"
                );


            displayName.textContent =
                file.display_name;


            const actualName =
                document.createElement(
                    "span"
                );


            actualName.className =
                "table-note";


            actualName.textContent =
                file.file_name;


            fileCell.appendChild(
                displayName
            );


            fileCell.appendChild(
                actualName
            );


            // ==============================
            // CATEGORY
            // ==============================

            const categoryCell =
                document.createElement(
                    "td"
                );


            const categoryTag =
                document.createElement(
                    "span"
                );


            categoryTag.className =
                "status-tag";


            categoryTag.textContent =
                file.category;


            categoryCell.appendChild(
                categoryTag
            );


            // ==============================
            // RELATED TO
            // ==============================

            const relatedCell =
                document.createElement(
                    "td"
                );


            relatedCell.textContent =
                file.related_to
                ||
                "—";


            // ==============================
            // OWNER
            // ==============================

            const ownerCell =
                document.createElement(
                    "td"
                );


            ownerCell.textContent =
                file.owner
                ||
                "—";


            // ==============================
            // REVISION
            // ==============================

            const revisionCell =
                document.createElement(
                    "td"
                );


            revisionCell.textContent =
                file.revision
                ||
                "—";


            // ==============================
            // SIZE
            // ==============================

            const sizeCell =
                document.createElement(
                    "td"
                );


            sizeCell.textContent =
                formatFileSize(
                    file.file_size
                );


            // ==============================
            // UPLOADED DATE
            // ==============================

            const uploadedCell =
                document.createElement(
                    "td"
                );


            uploadedCell.textContent =
                formatUploadDate(
                    file.uploaded_at
                );


            // ==============================
            // ACTIONS
            // ==============================

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


            // DOWNLOAD

            const downloadButton =
                document.createElement(
                    "button"
                );


            downloadButton.className =
                "task-button";


            downloadButton.textContent =
                "Download";


            downloadButton.addEventListener(
                "click",
                function () {

                    downloadFile(
                        file.id
                    );

                }
            );


            // EDIT

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

                    editFile(
                        file.id
                    );

                }
            );


            // DELETE

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

                    deleteFile(
                        file.id
                    );

                }
            );


            actions.appendChild(
                downloadButton
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


            // ==============================
            // ADD CELLS
            // ==============================

            row.appendChild(
                fileCell
            );


            row.appendChild(
                categoryCell
            );


            row.appendChild(
                relatedCell
            );


            row.appendChild(
                ownerCell
            );


            row.appendChild(
                revisionCell
            );


            row.appendChild(
                sizeCell
            );


            row.appendChild(
                uploadedCell
            );


            row.appendChild(
                actionsCell
            );


            fileTableBody.appendChild(
                row
            );

        }
    );

}


// ============================================
// SEARCH / FILTER EVENTS
// ============================================

fileSearchInput.addEventListener(
    "input",
    renderFiles
);


fileCategoryFilter.addEventListener(
    "change",
    renderFiles
);


// ============================================
// FILE NAME SANITIZER
// ============================================

function sanitizeFileName(
    fileName
) {

    return fileName

        .replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        )

        .replace(
            /_+/g,
            "_"
        );

}


// ============================================
// CATEGORY FOLDER NAME
// ============================================

function sanitizeFolderName(
    category
) {

    return category

        .toLowerCase()

        .replace(
            /[^a-z0-9]+/g,
            "-"
        )

        .replace(
            /^-|-$/g,
            ""
        );

}


// ============================================
// FILE SIZE
// ============================================

function formatFileSize(
    bytes
) {

    const size =
        Number(bytes || 0);


    if (size === 0) {

        return "0 B";

    }


    if (size < 1024) {

        return (
            size
            +
            " B"
        );

    }


    if (
        size <
        1024 * 1024
    ) {

        return (
            (
                size / 1024
            )
            .toFixed(1)
            +
            " KB"
        );

    }


    if (
        size <
        1024 * 1024 * 1024
    ) {

        return (
            (
                size /
                (
                    1024 * 1024
                )
            )
            .toFixed(1)
            +
            " MB"
        );

    }


    return (
        (
            size /
            (
                1024
                *
                1024
                *
                1024
            )
        )
        .toFixed(2)
        +
        " GB"
    );

}


// ============================================
// UPLOAD DATE
// ============================================

function formatUploadDate(
    timestamp
) {

    if (!timestamp) {

        return "—";

    }


    const date =
        new Date(
            timestamp
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month:
                "short",

            day:
                "numeric",

            year:
                "numeric"
        }
    );

}


// ============================================
// MESSAGE
// ============================================

function showMessage(
    message,
    isError
) {

    fileMessage.style.display =
        "block";


    fileMessage.textContent =
        message;


    fileMessage.style.color =
        isError
        ? "#8a3e3e"
        : "#5f6b75";

}


function hideMessage() {

    fileMessage.style.display =
        "none";

}


// ============================================
// REFRESH
// ============================================

refreshFilesButton.addEventListener(
    "click",
    loadProjectFiles
);


// ============================================
// START
// ============================================

loadProjectFiles();


console.log(
    "Aquifer shared Project Files library loaded."
);