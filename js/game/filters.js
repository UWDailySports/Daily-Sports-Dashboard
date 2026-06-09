// Initialization and Functions for Filters

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
    if(currWriter.position === "Editor"){
        const addGameButton = clone.querySelector(".add-game");
        addGameButton.dataset.container = containerId;
        addGameButton.onclick = () => openAddGameModal(containerId);
    }

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



// Function: createFilterDropdown
// Purpose: Creates the filter dropdown for different filter section
// Returns: None
// Parameters: (1) containerId: id for filter section
//             (2) title: title for filter section
//             (3) options: filter options
//             (4) activeFilters: filters currently in use
//             (5) filterKey: section key for filters 
//             (6) onChange: filter function to do when filters change    
// #region createFilterDropdown // 
function createFilterDropdown(containerId, title, options, activeFilters, filterKey, onChange) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="filter-dropdown">
            <button class="filter-dropdown-button">
                ${title} (${(activeFilters[filterKey] || []).length}) ▼
            </button>

            <div class="filter-dropdown-menu">
                ${options.map(option => {
                    const label = option.label || option;
                    const value = option.value || option;

                    return `
                        <label class="filter-option">
                            <input type="checkbox"
                                value="${value}"
                                ${(activeFilters[filterKey] || []).includes(value) ? "checked" : ""}
                            >
                            ${label}
                        </label>
                    `;
                }).join("")}
            </div>
        </div>
    `;

    const button = container.querySelector(".filter-dropdown-button");
    const menu = container.querySelector(".filter-dropdown-menu");

    button.addEventListener("click", () => {
        menu.classList.toggle("open");
    });

    menu.querySelectorAll("input").forEach(input => {
        input.addEventListener("change", () => {

            activeFilters[filterKey] =
                [...menu.querySelectorAll("input:checked")]
                    .map(i => i.value);

            console.log("FILTERS:", activeFilters);
            
            button.textContent =
                `${title} (${activeFilters[filterKey].length}) ▼`;

            onChange(activeFilters);
        });
    });
}
// #endregion //


// Function: buildFilters
// Purpose: Builds the filters for a section
// Returns: None
// Parameters: (1) containerId: id for filter section
//             (2) filters: filters to add to section
//             (3) fetchFn: filter function  
// #region buildFilters //
async function buildFilters(containerId, filters, fetchFn) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="games-filter-container">
            <div id="${containerId}-sport"></div>
            <div id="${containerId}-location"></div>
            <div id="${containerId}-month"></div>
        </div>
    `;

    const sports = await getSportNames();

    createFilterDropdown(`${containerId}-sport`, "Sport", sports, filters, "sports", fetchFn);

    createFilterDropdown(`${containerId}-location`, "Location", ["Home", "Away"], filters, "locations", fetchFn);

    createFilterDropdown(
        `${containerId}-month`,
        "Month",
        [{ label: "January", value: "01" },
        { label: "February", value: "02" },
        { label: "March", value: "03" },
        { label: "April", value: "04" },
        { label: "May", value: "05" },
        { label: "June", value: "06" },
        { label: "July", value: "07" },
        { label: "August", value: "08" },
        { label: "September", value: "09" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" }],
        filters,
        "months",
        fetchFn
    );
}
// #endregion //