// Function: openUserSchoolModal
// Purpose: Opens the modal for choosing a user's school
// Returns: None
// Parameters: None
// #region openAddGameModal //
let selectedSchool = null;
let selectedIndex = -1;
let currentResults = [];
let debounceTimer;
async function openUserSchoolModal() {

    await loadSchools();

    document.getElementById("user-school-modal").style.display = "flex";
};    

const userSchoolModal = document.getElementById("user-school-modal");

document.getElementById("confirm-user-school").addEventListener("click", async () => {
    const selectedSchool = document.getElementById("user-school-search").value;
    if (!selectedSchool) {
        alert("Please select a school");
        return;
    }

    updateUserSchool(selectedSchool);

    document.getElementById("user-school-modal").style.display = "none";
});

async function loadSchools() {
    const response = await fetch("/.netlify/functions/get-schools");
    const data = await response.json();

    schools = data.schools || [];

    return schools;
}

function renderResults(results) {
    currentResults = results;

    resultsBox.innerHTML = "";

    results.forEach((school, index) => {
        const div = document.createElement("div");
        div.className = "user-school-option";
        div.textContent = school.school;

        div.addEventListener("click", () => {
            selectSchool(school);
        });

        resultsBox.appendChild(div);
    });
}

function selectSchool(school) {
    selectedSchool = school;

    input.value = school.school;
    hiddenInput.value = school.school_id;

    resultsBox.innerHTML = "";
}

async function updateUserSchool(selectedSchool) {
    await fetch("/.netlify/functions/update-user-school", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ selectedSchool })
    });

    state.school = selectedSchool;

}