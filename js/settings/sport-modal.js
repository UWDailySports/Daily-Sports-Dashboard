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
    document.querySelectorAll(".modal-table-entry-options").forEach(options => {
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

    const container = document.getElementById("sport-table-container");

    for (const sport of sports) {
        const sportName = sport.sport;
        const sportAbbreviation = sport.abbreviation
        const sid = sport.sid;
        const email = sport.sid_email;

        let phone = sport.sid_phone;
        if(phone === null) {
            phone = "";
        }    

        const sportBox = document.createElement("div");
        sportBox.classList.add("modal-table-entry");
        
        sportBox.innerHTML = `
            <div class = "modal-table-entry-section sport-table-sport">${sportName}</div>
            <div class = "modal-table-entry-section sport-table-abbreviation">${sportAbbreviation}</div>            
            <div class = "modal-table-entry-section sport-table-sid">${sid}</div>
            <div class = "modal-table-entry-section sport-table-email">${email}</div>
            <div class = "modal-table-entry-section sport-table-phone">${phone}</div>
            <div class = "modal-table-entry-section sport-table-blank"></div>
            <div class = "modal-table-entry-section sport-table-options modal-table-entry-options-button">&hellip;
                <div class="modal-table-entry-options">
                    <div class = "modal-table-entry-option edit-sport-option">Edit</div>
                    <div class = "modal-table-entry-option delete-sport-option">Delete</div>
                </div>
            </div>
        `;

        sportBox.querySelector(".edit-sport-option").addEventListener("click", () => openEditSportModal(sport)); 
        sportBox.querySelector(".delete-sport-option").addEventListener("click", () => deleteSport(sport.sport_id));

        const optionsBtn = sportBox.querySelector(".modal-table-entry-options-button");
        const options = sportBox.querySelector(".modal-table-entry-options");

        if (!optionsBtn) console.log("button not found");
        if (!options) console.log("menu not found");

        options.addEventListener("click", e => e.stopPropagation());

        optionsBtn.addEventListener("click", (e) => {
            console.log("clicked");
            e.stopPropagation();

            document.querySelectorAll(".modal-table-entry-options").forEach(m => {
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
    const sportAbbreviation = document.getElementById("new-sport-abbreviation").value;
    const sid = document.getElementById("new-sport-sid").value;
    const sid_email = document.getElementById("new-sport-email").value;
    const sid_phone = document.getElementById("new-sport-phone").value;

    if(!sport_name || !sportAbbreviation || !sid || !sid_email) {
        alert("Please fill in all required fields");
        return;
    } 

    await addSport(sport_name, sportAbbreviation, sid, sid_email, sid_phone);

    addSportModal.style.display = "none";
};

// #endregion //

// Function: addSport
// Purpose: adds a new sport to the DB with the given info
// Returns: None
// Parameters: (1) sport_name: name of sport to add
//             (2) sid: name of sid for sport
//             (3) sid_email: email of sid for sport
//             (4) sid_phone: phone number of sid for sport (optional)
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region addSport() //
async function addSport(sport_name, sportAbbreviation, sid, sid_email, sid_phone) {
    try {
        const response = await fetch("/.netlify/functions/add-sport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ sport_name, sportAbbreviation, sid, sid_email, sid_phone })
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
// #endregion //

// Function: openeditSportModal
// Purpose: Opens the modal for editing a sport's info
// Returns: None
// Parameters: (1) sport: sport object to get/edit info for
// #region openeditSportModal() //
async function openEditSportModal(sport) {
    const editSportModal = document.getElementById("edit-sport-modal");

    document.getElementById("edit-sport-name").value = sport.sport;
    document.getElementById("edit-sport-abrreviation").value = sport.abbreviation;
    document.getElementById("edit-sport-sid").value = sport.sid || "";
    document.getElementById("edit-sport-email").value = sport.sid_email || "";
    document.getElementById("edit-sport-phone").value = sport.sid_phone || "";

    editSportModal.style.display = "flex";

    document.getElementById("edit-sport-confirm").onclick = async () => {
        const name = document.getElementById("edit-sport-name").value;
        const abbreviation = document.getElementById("edit-sport-abbreviation").value;
        const sid = document.getElementById("edit-sport-sid").value;
        const email = document.getElementById("edit-sport-email").value;
        const phone = document.getElementById("edit-sport-phone").value;

        if (!name || !abbreviation || !sid || !email) {
            alert("Please fill in all required fields");
            return;
        }

        await editSport(sport.sport_id, abbreviation, name, sid, email, phone);

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
async function editSport(sport_id, abbreviation, name, sid, email, phone) {
    try {
        const response = await fetch("/.netlify/functions/edit-sport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ sport_id,abbreviation, name, sid, email, phone })
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
