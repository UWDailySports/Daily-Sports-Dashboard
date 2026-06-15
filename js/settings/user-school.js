// Function: openUserSchoolModal
// Purpose: Opens the modal for choosing a user's school
// Returns: None
// Parameters: None
// #region openAddGameModal //
let schools = [];
let filteredSchools = [];
let selectedIndex = -1;
let selectedSchool = null;
async function openUserSchoolModal() {

    await loadSchools();

    document.getElementById("user-school-modal").style.display = "flex";

    selectedSchool = null;
    selectedIndex = -1;

    document.getElementById("user-school-search").value = "";
    document.getElementById("user-school-id").value = "";
    document.getElementById("user-school-results").innerHTML = "";
};    

const userSchoolModal = document.getElementById("user-school-modal");

const input = document.getElementById("user-school-search");
const resultsBox = document.getElementById("user-school-results");
const hiddenInput = document.getElementById("user-school-id");

input.addEventListener("input", () => {
    const query = input.value.toLowerCase().trim();

    selectedSchool = null;
    hiddenInput.value = "";

    if (!query) {
        resultsBox.innerHTML = "";
        return;
    }

    filteredSchools = schools
        .filter(s => s.school.toLowerCase().includes(query))
        .slice(0, 10);

    selectedIndex = -1;
    renderResults();
});

input.addEventListener("keydown", (e) => {
    if (!filteredSchools.length) return;

    if (e.key === "ArrowDown") {
        selectedIndex = Math.min(selectedIndex + 1, filteredSchools.length - 1);
        renderResults();
    }

    if (e.key === "ArrowUp") {
        selectedIndex = Math.max(selectedIndex - 1, 0);
        renderResults();
    }

    if (e.key === "Enter") {
        if (selectedIndex >= 0) {
            selectSchool(filteredSchools[selectedIndex]);
        }
    }
});

document.getElementById("confirm-user-school").onclick = async () => {
    if (!selectedSchool) {
        alert("Please select a school from the list");
        return;
    }

    await updateUserSchool(selectedSchool.school_id);

    document.getElementById("user-school-modal").style.display = "none";
};

async function loadSchools() {
    const response = await fetch("/.netlify/functions/get-schools");
    const data = await response.json();

    schools = data.schools || [];

    return schools;
}

function renderResults() {
    resultsBox.innerHTML = "";

    filteredSchools.forEach((school, index) => {
        const div = document.createElement("div");
        div.className = "user-school-option";

        if (index === selectedIndex) {
            div.classList.add("active");
        }

        div.textContent = school.school;

        div.addEventListener("click", () => selectSchool(school));

        resultsBox.appendChild(div);
    });
}

function selectSchool(school) {
    selectedSchool = school;

    input.value = school.school;
    hiddenInput.value = school.school_id;

    resultsBox.innerHTML = "";
}

async function updateUserSchool(schoolId) {
    await fetch("/.netlify/functions/update-user-school", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            school_id: schoolId
        })
    });
}