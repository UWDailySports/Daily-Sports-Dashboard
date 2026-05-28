// All editor-specific game functions 
// Add game, Assign game, edit game, Delete game

let currentContainer = null;

// Function: openAddGameModal
// Purpose: Opens the modal for adding a game
// Returns: None
// Parameters: (1) containerId: container id to determine tab refresh 
// #region openAddGameModal //
async function openAddGameModal(containerId) {
    currentContainer = containerId;

    document.getElementById("sport-input").value = "Select a Sport";
    await loadSports("sport-input");

    document.getElementById("add-modal").style.display = "flex";
};    

const addModal = document.getElementById("add-modal");

document.getElementById("confirm-add").onclick = async () => {
    const sport = document.getElementById("sport-input").value;
    const opponent = document.getElementById("opponent-input").value;
    const location = document.getElementById("location-input").value;
    const date = document.getElementById("date-input").value;
    const time = document.getElementById("time-input").value;
    const notes = document.getElementById("notes-input").value;

    if(!sport || !opponent || !location || !date || !time) {
        alert("Please fill in all required fields");
    } 

    await addGame(sport, opponent, date, time, location, notes);
    
    addModal.style.display = "none";

    if (currentContainer === "all-games-filter-container") {
        fetchAllScheduledGames(currWriter.writer_id, allScheduledFilters);
    }

    if (currentContainer === "scheduled-games-filter-container") {
        fetchMySchedule(currWriter.writer_id, myScheduleFilters);
    }

    if (currentContainer === "available-games-filter-container") {
        fetchAvailableGames(availableFilters);
    }
};
// #endregion //

// Function: addGame
// Purpose: Adds the new game into the DB
// Returns: None
// Parameters: (1) sport: game's sport
//             (2) opponent: game's opponent
//             (3) date: date of game (MM-DD-YYYY)
//             (4) location: location of game (City, St.)
//             (5) notes: additional info for game (postseason, season opener, etc)
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region addGame() //
async function addGame(sport, opponent, date, time, location, notes) {
    try {
        const response = await fetch("/.netlify/functions/add-game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ sport, opponent, date, time, location, notes })
        });

        const data = await response.json();

        if (data.success) {
            showToast("New game successfully added!", "success")
        } else {
            showToast("Failed to add new game", "error")
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error adding game to schedule.");
    }
};
// #endregion //


// Function: openAssignModal
// Purpose: Assigns an open game to a writer
// Returns: None
// Parameters: (1) gameId: id of the game 
// #region openAssignModal //
async function openAssignModal(gameId) {
    currGameId = gameId;

    await loadWriters();

    document.getElementById("assign-modal").style.display = "flex";
}   

const assignModal = document.getElementById("assign-modal");

document.getElementById("confirm-assign").onclick = async () => {
    const writerId = document.getElementById("writer-select").value;

    if (!writerId) {
        alert("Please select a writer");
        return;
    }

    await signup(currGameId, writerId);

    assignModal.style.display = "none";
};
// #endregion //


// Function: loadWriters
// Purpose: Loads writers into the select element in the assign game modal
// Returns: None
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region loadWriters() //
async function loadWriters() {
    const response = await fetch("/.netlify/functions/get-writers");
    const data = await response.json();
    const writers = data.writers;   

    const select = document.getElementById("writer-select");
    select.innerHTML = ""; 

    writers.forEach(writer => {
        const option = document.createElement("option");

        option.value = writer.writer_id;  
        option.textContent = writer.first_name + " " + writer.last_name;

        select.appendChild(option);
    });
}
// #endregion //


// Function: openEditGameModal
// Purpose: Opens the modal for editing a game 
// Returns: None
// Parameters: (1) gameId: id of game to edit
//             (2) containerId: container id to determine tab refresh
// #region openeditGameModal //
async function openEditGameModal(gameId, containerId) {
    currGameId = gameId;
    currentContainer = containerId;

    const data = await loadGameInfo(gameId);
    const game = data.game;

    await loadSports("edit-sport-input");

    document.getElementById("edit-sport-input").value = game.sport;
    document.getElementById("edit-opponent-input").value = game.opponent;
    document.getElementById("edit-location-input").value = game.location;
    document.getElementById("edit-date-input").value = game.date;
    document.getElementById("edit-time-input").value = game.time;
    document.getElementById("edit-notes-input").value = game.notes || "";

    document.getElementById("edit-modal").style.display = "flex";
};    

const editModal = document.getElementById("edit-modal");

document.getElementById("confirm-edit").onclick = async () => {
    const sport = document.getElementById("edit-sport-input").value;
    const opponent = document.getElementById("edit-opponent-input").value;
    const location = document.getElementById("edit-location-input").value;
    const date = document.getElementById("edit-date-input").value;
    const time = document.getElementById("edit-time-input").value;
    const notes = document.getElementById("edit-notes-input").value;

    if(!sport || !opponent || !location || !date || !time) {
        alert("Please fill in all required fields");
    } 

    await editGame(currGameId, sport, opponent, date, time, location, notes);

    editModal.style.display = "none";

    if (currentContainer === "all-games-filter-container") {
        fetchAllScheduledGames(currWriter.writer_id, allScheduledFilters);
    }

    if (currentContainer === "available-games-filter-container") {
        fetchAvailableGames(availableFilters);
    }
};

document.getElementById("delete-game").onclick = async () => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    await deleteGame(currGameId);

    document.getElementById("edit-modal").style.display = "none";

    if (currentContainer === "all-games-filter-container") {
        fetchAllScheduledGames(currWriter.writer_id, allScheduledFilters);
    }

    if (currentContainer === "available-games-filter-container") {
        fetchAvailableGames(availableFilters);
    }

    if (currentContainer === "scheduled-games-filter-container") {
        fetchMySchedule(currWriter.writer_id, myScheduleFilters);
    }    
};
// #endregion //


// Function: loadGameInfo
// Purpose: Loads the info for a game to pre-fill the edit game modal
// Returns: game info object
// Parameters: (1) gameId: id of game to get info for
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region loadGameInfo() //
async function loadGameInfo(gameId) {
    const response = await fetch("/.netlify/functions/get-game-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId })
    });

    const gameInfo = await response.json();

    return gameInfo;
}
// #endregion //


// Function: editGame
// Purpose: Edits the info for a game in the DB
// Returns: None
// Parameters: (1) gameId: id of game to edit
//             (2) sport: game's sport
//             (3) opponent: game's opponent
//             (4) date: date of game (MM-DD-YYYY)
//             (5) location: location of game (City, St.)
//             (6) notes: additional info for game (postseason, season opener, etc)
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region editGame() //
async function editGame(gameId, sport, opponent, date, time, location, notes) {
    try {
        const response = await fetch("/.netlify/functions/edit-game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ gameId, sport, opponent, date, time, location, notes })
        });

        const data = await response.json();

        if (data.success) {
            showToast("Game successfully edited!", "success");
        } else {
            showToast("Failed to edit game", "error");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error editing game.");
    }
}; 
// #endregion //


// Function: deleteGame
// Purpose: Deletes a game from the DB
// Returns: None
// Parameters: (1) gameId: id of game to delete
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region deleteGame() //
async function deleteGame(gameId) {
    try {
        const response = await fetch("/.netlify/functions/delete-game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ gameId })
        });

       const data = await response.json();

        if (data.success) {
            showToast("Game successfully deleted!", "success");
        } else {
            showToast("Failed to delete game");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error deleting game.");
    }
}
// #endregion //