// =====================================
// PROJECT AQUIFER
// SHARED COMPONENTS / BOM
// SUPABASE VERSION
// =====================================


const PROJECT_BUDGET =
    6000;


// Holds the current database results

let components = [];


// Used when editing a component

let selectedComponentId =
    null;


// =====================================
// HTML ELEMENTS
// =====================================

const addComponentButton =
    document.getElementById(
        "addComponentButton"
    );


const componentModal =
    document.getElementById(
        "componentModal"
    );


const componentModalTitle =
    document.getElementById(
        "componentModalTitle"
    );


const closeComponentModal =
    document.getElementById(
        "closeComponentModal"
    );


const cancelComponentButton =
    document.getElementById(
        "cancelComponentButton"
    );


const componentForm =
    document.getElementById(
        "componentForm"
    );


const saveComponentButton =
    document.getElementById(
        "saveComponentButton"
    );


const refreshComponentsButton =
    document.getElementById(
        "refreshComponentsButton"
    );


const componentTableBody =
    document.getElementById(
        "componentTableBody"
    );


const componentTableWrapper =
    document.getElementById(
        "componentTableWrapper"
    );


const componentEmptyState =
    document.getElementById(
        "componentEmptyState"
    );


const componentCount =
    document.getElementById(
        "componentCount"
    );


const totalCost =
    document.getElementById(
        "totalCost"
    );


const remainingBudget =
    document.getElementById(
        "remainingBudget"
    );


const purchasedCount =
    document.getElementById(
        "purchasedCount"
    );


const componentMessage =
    document.getElementById(
        "componentMessage"
    );


// =====================================
// LOAD COMPONENTS FROM SUPABASE
// =====================================

async function loadComponents() {

    showMessage(
        "Loading shared component data...",
        false
    );


    const {
        data,
        error
    } =
        await aquiferSupabase

            .from("components")

            .select("*")

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Could not load components:",
            error
        );


        showMessage(
            "Could not load the shared BOM.",
            true
        );


        return;

    }


    components =
        data || [];


    hideMessage();


    renderComponents();

}


// =====================================
// OPEN ADD COMPONENT
// =====================================

addComponentButton.addEventListener(
    "click",
    function () {

        selectedComponentId =
            null;


        componentModalTitle.textContent =
            "Add Component";


        saveComponentButton.textContent =
            "Save Component";


        componentForm.reset();


        document.getElementById(
            "componentQuantity"
        ).value =
            1;


        document.getElementById(
            "componentCost"
        ).value =
            0;


        componentModal.classList.add(
            "show"
        );

    }
);


// =====================================
// OPEN EDIT COMPONENT
// =====================================

function editComponent(
    componentId
) {

    const component =
        components.find(
            component =>
                component.id ===
                componentId
        );


    if (!component) {

        return;

    }


    selectedComponentId =
        componentId;


    componentModalTitle.textContent =
        "Edit Component";


    saveComponentButton.textContent =
        "Save Changes";


    document.getElementById(
        "componentName"
    ).value =
        component.name || "";


    document.getElementById(
        "componentSubsystem"
    ).value =
        component.subsystem || "";


    document.getElementById(
        "componentQuantity"
    ).value =
        component.quantity;


    document.getElementById(
        "componentCost"
    ).value =
        component.unit_cost;


    document.getElementById(
        "componentSupplier"
    ).value =
        component.supplier || "";


    document.getElementById(
        "componentStatus"
    ).value =
        component.status;


    document.getElementById(
        "componentNotes"
    ).value =
        component.notes || "";


    componentModal.classList.add(
        "show"
    );

}


// =====================================
// CLOSE MODAL
// =====================================

function closeComponentEditor() {

    componentModal.classList.remove(
        "show"
    );


    componentForm.reset();


    selectedComponentId =
        null;

}


closeComponentModal.addEventListener(
    "click",
    closeComponentEditor
);


cancelComponentButton.addEventListener(
    "click",
    closeComponentEditor
);


// =====================================
// SAVE COMPONENT
// ADD OR EDIT
// =====================================

componentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById(
                    "componentName"
                )
                .value
                .trim();


        const subsystem =
            document
                .getElementById(
                    "componentSubsystem"
                )
                .value
                .trim();


        const quantity =
            Number(
                document.getElementById(
                    "componentQuantity"
                ).value
            );


        const unitCost =
            Number(
                document.getElementById(
                    "componentCost"
                ).value
            );


        const supplier =
            document
                .getElementById(
                    "componentSupplier"
                )
                .value
                .trim();


        const status =
            document
                .getElementById(
                    "componentStatus"
                )
                .value;


        const notes =
            document
                .getElementById(
                    "componentNotes"
                )
                .value
                .trim();


        if (!name) {

            return;

        }


        saveComponentButton.disabled =
            true;


        saveComponentButton.textContent =
            "Saving...";


        const componentData = {

            name:
                name,

            subsystem:
                subsystem || null,

            quantity:
                quantity,

            unit_cost:
                unitCost,

            supplier:
                supplier || null,

            status:
                status,

            notes:
                notes || null

        };


        let error;


        // EDIT EXISTING COMPONENT

        if (selectedComponentId) {

            const result =
                await aquiferSupabase

                    .from("components")

                    .update(
                        componentData
                    )

                    .eq(
                        "id",
                        selectedComponentId
                    );


            error =
                result.error;

        }


        // ADD NEW COMPONENT

        else {

            const result =
                await aquiferSupabase

                    .from("components")

                    .insert(
                        componentData
                    );


            error =
                result.error;

        }


        saveComponentButton.disabled =
            false;


        if (error) {

            console.error(
                "Could not save component:",
                error
            );


            showMessage(
                "The component could not be saved.",
                true
            );


            return;

        }


        closeComponentEditor();


        await loadComponents();

    }
);


// =====================================
// DELETE COMPONENT
// =====================================

async function deleteComponent(
    componentId
) {

    const confirmed =
        confirm(
            "Delete this component?"
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } =
        await aquiferSupabase

            .from("components")

            .delete()

            .eq(
                "id",
                componentId
            );


    if (error) {

        console.error(
            "Could not delete component:",
            error
        );


        showMessage(
            "The component could not be deleted.",
            true
        );


        return;

    }


    await loadComponents();

}


// =====================================
// RENDER COMPONENTS
// =====================================

function renderComponents() {

    componentTableBody.innerHTML =
        "";


    componentCount.textContent =
        components.length;


    // -----------------------------
    // BUDGET CALCULATION
    // -----------------------------

    const cost =
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


    totalCost.textContent =
        formatMoney(
            cost
        );


    remainingBudget.textContent =
        formatMoney(
            PROJECT_BUDGET -
            cost
        );


    purchasedCount.textContent =
        components.filter(
            component =>
                component.status ===
                "Purchased"
        ).length;


    // -----------------------------
    // EMPTY STATE
    // -----------------------------

    if (
        components.length === 0
    ) {

        componentEmptyState.style.display =
            "block";


        componentTableWrapper.style.display =
            "none";


        return;

    }


    componentEmptyState.style.display =
        "none";


    componentTableWrapper.style.display =
        "block";


    // -----------------------------
    // TABLE ROWS
    // -----------------------------

    components.forEach(
        function (component) {

            const row =
                document.createElement(
                    "tr"
                );


            const componentTotal =
                Number(
                    component.quantity
                )
                *
                Number(
                    component.unit_cost
                );


            // COMPONENT

            const nameCell =
                document.createElement(
                    "td"
                );


            const name =
                document.createElement(
                    "strong"
                );


            name.textContent =
                component.name;


            const supplier =
                document.createElement(
                    "span"
                );


            supplier.className =
                "table-note";


            supplier.textContent =
                component.supplier
                ||
                "No supplier";


            nameCell.appendChild(
                name
            );


            nameCell.appendChild(
                supplier
            );


            // SUBSYSTEM

            const subsystemCell =
                document.createElement(
                    "td"
                );


            subsystemCell.textContent =
                component.subsystem
                ||
                "—";


            // QUANTITY

            const quantityCell =
                document.createElement(
                    "td"
                );


            quantityCell.textContent =
                component.quantity;


            // UNIT COST

            const unitCostCell =
                document.createElement(
                    "td"
                );


            unitCostCell.textContent =
                formatMoney(
                    Number(
                        component.unit_cost
                    )
                );


            // TOTAL COST

            const totalCell =
                document.createElement(
                    "td"
                );


            totalCell.textContent =
                formatMoney(
                    componentTotal
                );


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
                component.status;


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

                    editComponent(
                        component.id
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

                    deleteComponent(
                        component.id
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


            row.appendChild(
                nameCell
            );


            row.appendChild(
                subsystemCell
            );


            row.appendChild(
                quantityCell
            );


            row.appendChild(
                unitCostCell
            );


            row.appendChild(
                totalCell
            );


            row.appendChild(
                statusCell
            );


            row.appendChild(
                actionsCell
            );


            componentTableBody.appendChild(
                row
            );

        }
    );

}


// =====================================
// MONEY FORMAT
// =====================================

function formatMoney(
    value
) {

    return value.toLocaleString(
        "en-US",
        {
            style:
                "currency",

            currency:
                "USD",

            maximumFractionDigits:
                2
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

    componentMessage.style.display =
        "block";


    componentMessage.textContent =
        message;


    componentMessage.style.color =
        isError
        ? "#8a3e3e"
        : "#5f6b75";

}


function hideMessage() {

    componentMessage.style.display =
        "none";

}


// =====================================
// REFRESH
// =====================================

refreshComponentsButton.addEventListener(
    "click",
    loadComponents
);


// =====================================
// START
// =====================================

loadComponents();


console.log(
    "Aquifer shared Components page loaded."
);