// All Functions for the Sport Modal in Settings


// Function: openSportsModal
// Purpose: Opens the modal for sport info
// Returns: None
// Parameters: None
// #region openSportsModal() //
async function openSportsModal() {
    await fetchSportInfo();

    document.getElementById("sport-modal").style.display = "flex";
};    

const sportModal = document.getElementById("sport-modal");

document.addEventListener("click", () => {
    document.querySelectorAll(".list-options").forEach(options => {
        options.style.display = "none";
    });
});

// #endregion //


// Function: fetchSportInfo
// Purpose: Fetches the info for each sport from DB and inserts info into modal
// Returns: None
// Parameters: None
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region fetchSportInfo() //
async function fetchSportInfo() {
    const response = await fetch("/.netlify/functions/get-sport-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        console.log("Failed to fetch sport info. Status:", response.status);
        return;
    }

    const data = await response.json();
    const sports = data.sports;

    if(!sports || sports.length === 0) {
        console.log("No sports found.");
        return;
    }

    const container = document.getElementById("sport-list-container");
    container.innerHTML = "";

    for (const sport of sports) {
        const sportName = sport.sport;
        const sid = sport.sid;
        const email = sport.sid_email;

        let phone = sport.sid_phone;
        if(phone === null) {
            phone = "";
        }    

        const sportBox = document.createElement("div");
        sportBox.classList.add("sport-list-entry-container");
        sportBox.textContent = sportName;
        
        sportBox.innerHTML = `
            <div class = "sport-list-entry-section">${sportName}</div>
            <div class = "sport-list-entry-section">${sid}</div>
            <div class = "sport-list-entry-section">${email}</div>
            <div class = "sport-list-entry-section">${phone}</div>
            <div class="list-options">
                <button class = "edit-sport">Edit</button>
                <button class = "delete-sport">Delete</button>
            </div>
            <div class = "list-options-button" style="font-size: 30px; margin-bottom: 1.5%;">&hellip;</div>
        `
        sportBox.querySelector(".edit-sport").addEventListener("click", () => openEditSportModal(sport));
        sportBox.querySelector(".delete-sport").addEventListener("click", () => deleteSport(sport.sport_id));

        const optionsBtn = sportBox.querySelector(".list-options-button");
        const options = sportBox.querySelector(".list-options");

        if (!optionsBtn) console.log("button not found");
        if (!options) console.log("menu not found");

        options.addEventListener("click", e => e.stopPropagation());

        optionsBtn.addEventListener("click", (e) => {
            console.log("clicked");
            e.stopPropagation();

            document.querySelectorAll(".list-options").forEach(m => {
                if (m !== options) m.style.display = "none";
            });

            options.style.display =
                options.style.display === "flex" ? "none" : "flex";
        });

        container.appendChild(sportBox);
    }
}
// #endregion //


// Function: addSportModal
// Purpose: Opens the modal for adding a sport
// Returns: None
// Parameters: None
// #region addSportModal() //

async function openAddSportModal() {
    document.getElementById("add-sport-modal").style.display = "flex";
}    

const addSportModal = document.getElementById("add-sport-modal");

document.getElementById("add-sport-confirm").onclick = async () => {
    const sport_name = document.getElementById("new-sport-name").value;
    const sid = document.getElementById("new-sport-sid").value;
    const sid_email = document.getElementById("new-sport-email").value;
    const sid_phone = document.getElementById("new-sport-phone").value;

    if(!sport_name || !sid || !sid_email) {
        alert("Please fill in all required fields");
        return;
    } 

    await addSport(sport_name, sid, sid_email, sid_phone);

    addSportModal.style.display = "none";
};

// #endregion //


async function addSport(sport_name, sid, sid_email, sid_phone) {
    try {
        const response = await fetch("/.netlify/functions/add-sport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ sport_name, sid, sid_email, sid_phone })
        });

        const text = await response.text();

        console.log("NETLIFY RAW RESPONSE:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }

        if (data.success) {
            showToast("New sport successfully added!", "success");
        } else {
            showToast("Failed to add new sport", "error");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error adding new sport.");
    }
}

// Function: openeditSportModal
// Purpose: Opens the modal for editing a sport's info
// Returns: None
// Parameters: (1) sport: sport object to get/edit info for
// #region openeditSportModal() //
async function openEditSportModal(sport) {
    const editSportModal = document.getElementById("edit-sport-modal");

    document.getElementById("edit-sport-name").value = sport.sport;
    document.getElementById("edit-sport-sid").value = sport.sid || "";
    document.getElementById("edit-sport-email").value = sport.sid_email || "";
    document.getElementById("edit-sport-phone").value = sport.sid_phone || "";

    editSportModal.style.display = "flex";

    document.getElementById("edit-sport-confirm").onclick = async () => {
        const name = document.getElementById("edit-sport-name").value;
        const sid = document.getElementById("edit-sport-sid").value;
        const email = document.getElementById("edit-sport-email").value;
        const phone = document.getElementById("edit-sport-phone").value;

        if (!name || !sid || !email) {
            alert("Please fill in all required fields");
            return;
        }

        await editSport(sport.sport_id, name, sid, email, phone);

        editSportModal.style.display = "none";

        await fetchSportInfo();
    };
}
// #endregion


// Function: editSport
// Purpose:  edits info for a sport in the DB
// Returns: None
// Parameters: (1) sport_id: id of sport 
//             (2) name: new name of sport
//             (3) sid: new name of sid for sport
//             (4) email: new email of sid for sport
//             (5) phone: new phone number of sid for sport
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region editSport() //
async function editSport(sport_id,name, sid, email, phone) {
    try {
        const response = await fetch("/.netlify/functions/edit-sport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ sport_id, name, sid, email, phone })
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Error editing sport.");
    }
}
// #endregion 


// Function: deleteSport
// Purpose: deletes the selected sport from the DB
// Returns: None
// Parameters: (1) sport_id: id of sport
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region deleteSport() //
async function deleteSport(sport_id) {
    if (!confirm("Are you sure you want to delete this sport?")) return;
    
    try {
        const response = await fetch("/.netlify/functions/delete-sport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ sport_id })
        });

        const text = await response.text();

        console.log("NETLIFY RAW RESPONSE:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }

        if (data.success) {
            showToast("Sport successfully deleted!", "success");
        } else {
            showToast("Failed to delete sport", "error");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error deleting sport.");
    }
}
// #endregion
