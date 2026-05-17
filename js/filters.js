// Initialization and Functions for Filters

let activeFilters = { sports: [], locations: [] };
let myScheduleFilters = { sports: [], locations: [] };
let availableFilters = { sports: [], locations: [] };
let historyFilters = { sports: [], locations: [], months: [] };

// Function: createGamesFilter
// Purpose: Creates the filter for games based on the container and sets up event listeners for filter changes
// Returns: None
// Parameters: (1) containerId: id of container to create filter in
//             (2) filters: current filters to set active values
//             (3) onFilterChange: callback function for when filter values change
// #region createGamesFilter() //
function createGamesFilter(containerId, filters, onFilterChange) {
    const container = document.getElementById(containerId);

    container.innerHTML = "";

    const template = document.getElementById("games-filter-template");
    const clone = template.content.cloneNode(true);
    const addGameButton = clone.querySelector(".add-game");
    addGameButton.dataset.container = containerId;
    addGameButton.onclick = () => openAddGameModal(containerId);

    container.appendChild(clone);

    const boxes = container.querySelectorAll(".filter-box");

    boxes.forEach(box => {
        const value = box.dataset.value;
        const isSport = box.closest(".sport-options");
        const isLocation = box.closest(".location-options");

        if ((isSport && filters.sports.includes(value)) || (isLocation && filters.locations.includes(value))) {
            box.classList.add("active");
        }

        box.addEventListener("click", () => {
            let targetArray = null;

            if (isSport) targetArray = filters.sports;
            if (isLocation) targetArray = filters.locations;

            if (!targetArray) return;

            const index = targetArray.indexOf(value);

            if (index > -1) {
                targetArray.splice(index, 1);
                box.classList.remove("active");
            } else {
                targetArray.push(value);
                box.classList.add("active");
            }

            onFilterChange({ 
                sports: [...filters.sports], 
                locations: [...filters.locations] 
            });
        });
    });
}
// #endregion //


// Function: toggleFilterValue
// Purpose: Toggles a value in an array (adds if not present, removes if present)
// Returns: None
// Parameters: (1) array: array to toggle value in
//             (2) value: value to toggle in array
// #region toggleFilterValue() //
function toggleFilterValue(array, value) {
    const index = array.indexOf(value);

    if (index > -1) {
        array.splice(index, 1);
    } else {
        array.push(value);
    }
}
// #endregion //


// Function: loadHistoryFilters
// Purpose: Loads the filters for the history tab
// Returns: None
// Parameters: None
// #region loadHistoryFilters() //
function loadHistoryFilters() {
    const template = document.getElementById("history-filter-template");
    const container = document.getElementById("history-filter-container");

    container.innerHTML = "";
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);
}
// #endregion //