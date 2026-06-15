// Function: openUserSchoolModal
// Purpose: Opens the modal for choosing a user's school
// Returns: None
// Parameters: None
// #region openAddGameModal //
let selectedSchool = null;
let schools = [];
async function openUserSchoolModal() {

    await loadSchools();

    document.getElementById("user-school-modal").style.display = "flex";
};    

const userSchoolModal = document.getElementById("user-school-modal");

const searchInput = document.getElementById("user-school-search");
const resultsContainer = document.getElementById("user-school-results");

searchInput.addEventListener("input", () => {
    const search = searchInput.value.trim().toLowerCase();

    resultsContainer.innerHTML = "";

    if (!search) return;

    const matches = schools
        .filter(school =>
            school.school.toLowerCase().startsWith(search)
        )
        .slice(0, 10); 

    matches.forEach(school => {
        const option = document.createElement("div");

        option.classList.add("user-school-option");
        option.textContent = school.school_name;

        option.addEventListener("click", () => {
            searchInput.value = school.school_name;

            selectedSchool = school; // <-- save whole object

            resultsContainer.innerHTML = "";
        });

        resultsContainer.appendChild(option);
    });
});

document.getElementById("confirm-user-school").addEventListener("click", async () => {
    if (!selectedSchool) {
        alert("Please select a school");
        return;
    }

    await updateUserSchool(selectedSchool);

    document.getElementById("user-school-modal").style.display = "none";
});

async function loadSchools() {
    const response = await fetch("/.netlify/functions/get-schools");
    const data = await response.json();

    schools = data.schools || [];
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

    document.documentElement.style.setProperty(
        "--primary_color",
        state.school.color_1
    ); 

    document.documentElement.style.setProperty(
        "--secondary_color",
        state.school.color_2
    );

}