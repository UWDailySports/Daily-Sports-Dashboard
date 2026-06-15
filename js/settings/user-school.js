// Function: openUserSchoolModal
// Purpose: Opens the modal for choosing a user's school
// Returns: None
// Parameters: None
// #region openAddGameModal //
async function openUserSchoolModal() {

    await loadSchools();

    document.getElementById("user-school-modal").style.display = "flex";
};    

const userSchoolModal = document.getElementById("user-school-modal");

const userSchoolSearchInput = document.getElementById("user-school-search");
const userSchoolResultsContainer = document.getElementById("user-school-results");

userSchoolSearchInput.addEventListener("input", () => {
    const userSchoolSearch = userSchoolSearchInput.value.toLowerCase();

    userSchoolResultsContainer.innerHTML = "";

    if (!userSchoolSearch) return;

    const matches = schools.filter(school => 
        school.school.toLowerCase().includes(userSchoolSearch)).slice(0, 10);

    matches.forEach(school => {
        const option = document.createElement("div");

        option.className = "user-school-option";
        option.textContent = school.school;

        option.addEventListener("click", () => {
            userSchoolSearchInput.value = school.school;

            userSchoolResultsContainer.innerHTML = "";
        });

        userSchoolResultsContainer.appendChild(option);
    });
});

document.getElementById("confirm-user-school").onclick = async () => {
    const userSchool = document.getElementById("user-school-select").value;

    if (!userSchool) {
        alert("Please select a school");
        return;
    }

    await updateUserSchool(userSchool);

    userSchoolModal.style.display = "none";
};

async function loadSchools() {
    const response = await fetch("/.netlify/functions/get-schools");
    const data = await response.json();

    const schools = data.schools;

    return schools;
}

async function updateUserSchool(userSchool) {
await fetch("/.netlify/functions/update-user-school", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        school_id: userSchool.school_id
    })
});
}