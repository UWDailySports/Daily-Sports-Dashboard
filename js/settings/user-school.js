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
    const query = input.value.trim();

    selectedSchool = null;
    hiddenInput.value = "";
    selectedIndex = -1;

    clearTimeout(debounceTimer);

    if (!query) {
        resultsBox.innerHTML = "";
        return;
    }

    debounceTimer = setTimeout(async () => {
        const res = await fetch(`/.netlify/functions/search-schools?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        renderResults(data.schools || []);
    }, 200);
});

input.addEventListener("keydown", (e) => {
    if (!currentResults.length) return;

    if (e.key === "ArrowDown") {
        selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
        highlight();
    }

    if (e.key === "ArrowUp") {
        selectedIndex = Math.max(selectedIndex - 1, 0);
        highlight();
    }

    if (e.key === "Enter") {
        if (selectedIndex >= 0) {
            selectSchool(currentResults[selectedIndex]);
        }
    }
});

function highlight() {
    const items = document.querySelectorAll(".user-school-option");

    items.forEach((el, i) => {
        el.classList.toggle("active", i === selectedIndex);
    });
}

document.getElementById("confirm-user-school").addEventListener("click", async () => {
    if (!selectedSchool) {
        alert("Please select a school");
        return;
    }

    await fetch("/.netlify/functions/update-user-school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            school_id: selectedSchool.school_id
        })
    });

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