let sports = [];
let conferences = [];
let schools = [];
let selectedSchool = null;
let filterContainer;
console.log(filterContainer);

window.onload = async function() {
    filterContainer = document.getElementById("schools-filter-sections-container");

    buildSchoolsFilterContainer("School");
}

async function buildSchoolsFilterContainer(filterType) {
    //await loadSports();

    filterContainer.innerHTML = "";

    if(filterType === "School"){
        buildSchoolsFiltersSchools();
    }

    if(filterType === "Sport") {
        //buildSportFilters();
    }   

    if(filterType === "Conference") {
        //buildConferenceFilters();
    }
}

async function buildSchoolsFiltersSchools() {
    const selectSchoolFilterSchoolContainer = document.createElement("div");
    selectSchoolFilterSchoolContainer.className = "schools-filter-section-container";

    const selectSchoolFilterSchoolTitle = document.createElement("div");
    selectSchoolFilterSchoolTitle.className = "schools-filter-section-title";
    selectSchoolFilterSchoolTitle.innerHTML = "Select A School";
    selectSchoolFilterSchoolContainer.append(selectSchoolFilterSchoolTitle);

    const selectSchoolFilterSchoolSearchContainer = document.createElement("div");
    selectSchoolFilterSchoolSearchContainer.className = "schools-filter-section-search-container";
    selectSchoolFilterSchoolContainer.append(selectSchoolFilterSchoolSearchContainer);

    const selectSchoolFilterSchoolSearch = document.createElement("input");
    selectSchoolFilterSchoolSearch.className = "schools-filter-section-search";
    selectSchoolFilterSchoolSearchContainer.append(selectSchoolFilterSchoolSearch);

    const selectSchoolFilterSchoolSearchResultsContainer = document.createElement("div");
    selectSchoolFilterSchoolSearchResultsContainer.className = "schools-filter-section-search-results";
    selectSchoolFilterSchoolSearchContainer.appendChild(selectSchoolFilterSchoolSearchResultsContainer);

    selectSchoolFilterSchoolSearch.addEventListener("input", () => {
        const search = selectSchoolFilterSchoolSearch.value.trim().toLowerCase();

        selectSchoolFilterSchoolSearchResultsContainer.innerHTML = "";

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
                selectSchoolFilterSchoolSearch.value = school.school;

                selectedSchool = school; // <-- save whole object

                selectSchoolFilterSchoolSearchResultsContainer.innerHTML = "";
            });

            selectSchoolFilterSchoolSearchResultsContainer.appendChild(option);
        });
    });

    filterContainer.appendChild(selectSchoolFilterSchoolContainer);

    const selectSchoolFilterSchoolSportContainer = document.createElement("div");
    selectSchoolFilterSchoolSportContainer.className = "schools-filter-section-container";

    const selectSchoolFilterSchoolSportTitle = document.createElement("div");
    selectSchoolFilterSchoolSportTitle.className = "schools-filter-section-title";
    selectSchoolFilterSchoolSportTitle.innerHTML = "Select Sports";
    selectSchoolFilterSchoolSportContainer.append(selectSchoolFilterSchoolSportTitle);

    const selectSchoolFilterSchoolSportOptionsContainer = document.createElement("div");
    selectSchoolFilterSchoolSportOptionsContainer.className = "schools-filter-section-sports-container"
    
    const sports = await getSportNames();
    sports.forEach(sport => {
        const optionContainer = document.createElement("div");
        optionContainer.className = "schools-filter-checkbox-container";

        const checkbox = document.createElement("option");
        checkbox.className = "schools-filter-checkbox";
        checkbox.value = sport.sport;
        optionContainer.append(checkbox);

        const sportName = document.createElement("div");
        sportName.className = "schools-filter-checkbox-name";
        sportName.innerHTML = sport.sport;
        optionContainer.append(sportName);

        selectSchoolFilterSchoolSportOptionsContainer.append(optionContainer);
    });

    filterContainer.append(selectSchoolFilterSchoolSportContainer);
}

async function fetchSchools(filter) {
    await loadSchools();

    if(filter === "conferences");
}


