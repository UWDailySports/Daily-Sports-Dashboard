let sports = [];
let conferences = [];
let schools = [];
let selectedSchool = null;
let filterContainer;
console.log(filterContainer);

window.onload = async function() {
    filterContainer = document.getElementById("schools-filter-sections-container");

    buildFilters("None");
}

async function buildFilters(filterType) {
    //await loadSports();

    filterContainer.innerHTML = "";

    if(filterType === "School"){
        buildSchoolFilters();
    }

    if(filterType === "Sport") {
        buildSportFilters();
    }   

    if(filterType === "Conference") {
        buildConferenceFilters();
    }

    if(filterType === "None"){
        buildSchoolFilters();
    }
}

async function buildSchoolFilters() {
    const selectSchoolFilterContainer = document.createElement("div");
    selectSchoolFilterContainer.className = "schools-filter-section-container";

    const selectSchoolFilterTitle = document.createElement("div");
    selectSchoolFilterTitle.className = "schools-filter-section-title";
    selectSchoolFilterTitle.innerHTML = "Select A School";
    selectSchoolFilterContainer.append(selectSchoolFilterTitle);

    const selectSchoolFilterSearchContainer = document.createElement("div");
    selectSchoolFilterSearchContainer.className = "schools-filter-section-search-container";
    selectSchoolFilterContainer.append(selectSchoolFilterSearchContainer);

    const selectSchoolFilterSearch = document.createElement("input");
    selectSchoolFilterSearch.className = "schools-filter-section-search";
    selectSchoolFilterSearchContainer.append(selectSchoolFilterSearch);

    const selectSchoolFilterSearchResultsContainer = document.createElement("div");
    selectSchoolFilterSearchResultsContainer.className = "schools-filter-section-search-results";
    selectSchoolFilterSearchContainer.appendChild(selectSchoolFilterSearchResultsContainer);

    selectSchoolFilterSearch.addEventListener("input", () => {
        const search = selectSchoolFilterSearch.value.trim().toLowerCase();

        selectSchoolFilterSearchResultsContainer.innerHTML = "";

        if (!search) return;

        const matches = schools
            .filter(school =>
                school.school.toLowerCase().startsWith(search)
            )
            .slice(0, 10); 

        matches.forEach(school => {
            const option = document.createElement("div");

            option.classList.add("schools-filter-search-option");
            option.textContent = school.school;

            option.addEventListener("click", () => {
                selectSchoolFilterSearch.value = school.school;

                selectedSchool = school; // <-- save whole object

                selectSchoolFilterSearchResultsContainer.innerHTML = "";
            });

            selectSchoolFilterSearchResultsContainer.appendChild(option);
        });
    });

    filterContainer.appendChild(selectSchoolFilterContainer);

    const selectSchoolFilterSportContainer = document.createElement("div");
    selectSchoolFilterSportContainer.className = "schools-filter-section-container";

    const selectSchoolFilterSportTitle = document.createElement("div");
    selectSchoolFilterSportTitle.className = "schools-filter-section-title";
    selectSchoolFilterSportTitle.innerHTML = "Select Sports";
    selectSchoolFilterSportContainer.append(selectSchoolFilterSportTitle);

    const selectSchoolFilterSportOptionsContainer = document.createElement("div");
    selectSchoolFilterSportOptionsContainer.className = "schools-filter-section-sport-container"

    filterContainer.append()
}

async function fetchSchools(filter) {
    await loadSchools();

    if(filter === "conferences");
}


