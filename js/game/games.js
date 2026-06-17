// Functions for getting the user's scheduled games and available games

let currGameId = null;

function createSkeletonGameBox() {
    const skeleton = document.createElement("div");
    skeleton.classList.add("game-box", "skeleton-game");

    skeleton.innerHTML = `
        <div class="skeleton skeleton-sport"></div>
        <div class="skeleton skeleton-matchup"></div>
        <div class="skeleton skeleton-location"></div>
        <div class="skeleton skeleton-date"></div>
    `;

    return skeleton;
}

async function getSportNames() {
    const response = await fetch("/.netlify/functions/get-sports");
    const data = await response.json();

    return data.sports.map(s => s.sport);
}

async function getSports() {
    const response = await fetch("/.netlify/functions/get-sports");

    console.log("response:", response);

    const data = await response.json();

    console.log("sports data:", data);

    return data.sports;
}

async function loadSports(selectId) {
    const sports = await getSports();

    console.log("sports:", sports);

    const select = document.getElementById(selectId);

    console.log("select:", select);

    select.innerHTML = "";

    sports.forEach(sport => {
        console.log("adding:", sport);

        const option = document.createElement("option");

        option.value = sport.sport;
        option.textContent = sport.sport;

        select.appendChild(option);
    });
}
// #endregion //

// Function: fetchMySchedule
// Purpose: Fetches the info for the games the user is scheduled to cover and shows games in dashboard
// Returns: None
// Parameters: (1) writerId: id of writer to get schedule for
//             (2) filters: Filters for games. Can filter by sport and/or location
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region fetchMySchedule() //
async function fetchMySchedule(writerId, filters = { sports: [], locations: [], months: [] }) {
    if (!writerId) {
        console.log("Writer ID is missing!");

        return;  
    }

    let container = document.getElementById("scheduled-games-container");
    container.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        container.appendChild(createSkeletonGameBox());
    }
            
    const response = await fetch("/.netlify/functions/scheduled-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writerId, filters }) 
    });

    if (!response.ok) {
        console.log("Failed to fetch my scheduled games. Status:", response.status);
        return;
    }

    const data = await response.json();
    const games = data.games;

    container = document.getElementById("scheduled-games-container");
    container.innerHTML = "";

    // Special box if no games are scheduled
    if (!games || games.length === 0) {
        console.log("No scheduled games found.");

        const noGames = document.createElement("div");
        noGames.classList.add("no-games");
        noGames.textContent = "No Games in Schedule";

        container.appendChild(noGames);
    }

    games.forEach(game => {
        const gameBox = createGameBox(game, options = ["remove"], tab = "my-games");
        container.appendChild(gameBox);
    });
}
// #endregion //


// Function: fetchAvailableGames
// Purpose: Fetches the info for the games that are available to be covered and shows games in dashboard
// Returns: None
// Parameters: (1) filters: Filters for games. Can filter by sport and/or location
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region fetchAvailableGames() //
async function fetchAvailableGames(filters = { sports: [], locations: [], months: [] }) {

    let container = document.getElementById("available-games-container");
    container.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        container.appendChild(createSkeletonGameBox());
    }

    const response = await fetch("/.netlify/functions/available-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters }) 
    });

    const data = await response.json();
    const games = data.games;
            
    container = document.getElementById("available-games-container");
    container.innerHTML = "";

    // Special box if no games are available
    if (!games || games.length === 0) {
        console.log("No available games found.");

        const noGames = document.createElement("div");
        noGames.classList.add("no-games");
        noGames.textContent = "No Games Available";

        container.appendChild(noGames);
    }

    const currWriterPosition = state.currWriter.position;

    if(currWriterPosition === "Writer") {
        games.forEach(game => {
            const gameBox = createGameBox(game, options = ["add"], tab = "available-games");
            container.appendChild(gameBox);
        })
    }

    if(currWriterPosition === "Editor" || currWriter === "EIC" || currWriter === "Copy") {
        games.forEach(game => {
            const gameBox = createGameBox(game, options = ["add", "edit"]);
            container.appendChild(gameBox);
        })
    }
}
// #endregion //


// Function: fetchAllScheduledGames
// Purpose: Fetches the info for all scheduled games and shows games in dashboard
// Returns: None
// Parameters: (1) filters: Filters for games. Can filter by sport and/or location
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region fetchAllScheduledGames //

async function fetchAllScheduledGames(filters = { sports: [], locations: [], months: [] }) {
    console.log("FETCHING WITH:", filters);

    let container = document.getElementById("all-games-container");
    container.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        container.appendChild(createSkeletonGameBox());
    }

    const response = await fetch("/.netlify/functions/all-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters }) 
    });

    if (!response.ok) {
        console.log("Failed to fetch all scheduled games. Status:", response.status);
        return;
    }

    const data = await response.json();
    const games = data.games;

    container = document.getElementById("all-games-container");
    container.innerHTML = "";

    // Special box if no games are scheduled
    if (!games || games.length === 0) {
        console.log("No scheduled games found.");

        const noGames = document.createElement("div");
        noGames.classList.add("no-games");
        noGames.textContent = "No Games Scheduled";

        container.appendChild(noGames);
    }

    games.forEach(game => {
        const gameBox = createGameBox(game, buttons = ["edit", "remove"]);
        container.appendChild(gameBox);
    });
} 
// #endregion //


// Function: fetchHistoryGames
// Purpose: Fetches the info for the games the user has covered in the past and shows games in dashboard
// Returns: None
// Parameters: (1) writerId: id of writer to get history for
//             (2) filters: Filters for games. Can filter by sport, location, and month
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region fetchHistoryGames() //
async function fetchHistoryGames(writerId, filters = { sports: [], locations: [], months: [] }) {
    let container = document.getElementById("history-container");
    container.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        container.appendChild(createSkeletonGameBox());
    }

    const response = await fetch("/.netlify/functions/history-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writerId, filters }) 
    });

    const data = await response.json();
    const games = data.games;
            
    container = document.getElementById("history-container");
    container.innerHTML = "";

    // Special box if no history is found
    if (!games || games.length === 0) {
        console.log("No history  found.");

        const noGames = document.createElement("div");
        noGames.classList.add("no-games");
        noGames.textContent = "No Games in History";

        container.appendChild(noGames);
    }

    games.forEach(game => {
        const gameBox = createGameBox(game, options = [], tab = "history-games");
        container.appendChild(gameBox);
    });
}
// #endregion //


// Function: signup
// Purpose: Signs the user up to cover a game 
// Returns: None
// Parameters: (1) gameId: id of game to sign up for
//             (2) writerId: id of writer signing up for game
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region signup() //
async function signup(gameId, writerId) {
    console.log("Game ID: ", gameId, "  Writer ID: ", writerId);

    try {
        const response = await fetch("/.netlify/functions/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameId: gameId, writerId: writerId })
        });

        const data = await response.json();

        if (data.success) {
            showToast("Successfully added game to schedule!", "success");
            resetCaches();
            fetchAvailableGames(state.filters.availableGames);
        } else {
            showToast("Failed to add game to schedule", "error");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error adding game to assignments.");
    }
} 
// #endregion //

// Function: remove
// Purpose: Removes the user from a game they were signed up for
// Returns: None
// Parameters: (1) gameId: id of game to remove from
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region remove() //
async function remove(gameId) {
    console.log("Game ID: ", gameId);

    try {
        const response = await fetch("/.netlify/functions/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameId: gameId})
        });

        const data = await response.json();

        if (data.success) {
            showToast("Game removed from schedule", "success");
            resetCaches();
            fetchMySchedule(state.currWriter.writer_id, state.filters.myGames);
        } else {
            showToast("Failed to remove game from schedule", "error")
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error removing game from assignments.");
    }
}   

function resetCaches() {
    myScheduleLoaded = false;
    availableGamesLoaded = false;
    historyLoaded = false;
    allScheduledGamesLoaded = false;
}
// #endregion //

function createGameBox(game, options = [], tab) {

    const sport = game.sport;
    const notes = game.notes || "";
    const opponent = game.opponent;
    const location = game.location;
    const homeRecap = location.trim() === "Seattle, Wash.";
    const where = homeRecap ? "vs" : "@";
    const recapCSS = homeRecap ? "home-recap" : "away-recap";
    const date = game.date;
    const time = game.time;
    const writer = (game.first_name || "") + " " + (game.last_name || "");

    const gameId = game.game_id;
    const writerId = game.writer_id;

    let gameOptions = "";

    for (const option of options) {
        switch (option) {
            case "add":
                gameOptions += `<button class="game-option" data-action = "add-game">ADD</button>`;
                const addButton = gameBox.querySelector('[data-action="add-game"]');
                addButton.addEventListener("click", async (e) => {
                    await signup(gameId);
                    refreshCurrentTab(tab);
                });                
                break;

            case "assign":
                gameOptions += `<button class="game-option" data-action = "assign-game">ASSIGN</button>`;
                const assignButton = gameBox.querySelector('[data-action="assign-game"]');
                assignButton.addEventListener("click", async (e) => {
                    await openAssignGameModal(gameId);
                    refreshCurrentTab(tab);
                });                
                break;

            case "edit":
                gameOptions += `<button class="game-option" data-action = "edit-game">EDIT</button>`;
                const editButton = gameBox.querySelector('[data-action="edit-game"]');
                editButton.addEventListener("click", async (e) => {
                    refreshCurrentTab(tab);
                });
                break;

            case "remove":
                gameOptions += `<button class="game-option" data-action = "remove-game">REMOVE</button>`;
                const removeButton = gameBox.querySelector('[data-action="remove-game"]');
                removeButton.addEventListener("click", async (e) => {
                    const gameId = e.target.getAttribute("data-game-id");
                    await remove(gameId);
                    refreshCurrentTab(tab);
                });
                break;
        }
    }

    const gameBox = document.createElement("div");
    gameBox.className = "game-box";

    gameBox.innerHTML = `
        <div class = "sport-container">
            <div class = "sport-box">${sport}</div>
            <div class = "notes-box">${notes}</div> 
        </div>
        <div class = "matchup-container">
            <img class = "school-icon" src = "/images/schools/${state.school.school}.webp" alt = "UW">
            <div class = "where">${where}</div>
            <img class="school-icon" src="/images/schools/${opponent}.webp" alt="${opponent}">
        </div>
        <div class = "recap-container">
            <div class="${recapCSS}"></div>
            <p class="recap-location">${location}</p>
        </div>
        <div class = "when-container">
            <div class = "date">${formatDate(date)}</div>
            <div class = "time">${time}</div>
        </div>
        <div class = "writer">${writer}</div>
        <div class = "options-container"> 
            ${gameOptions}
        </div>    
        `;

    return gameBox;
}

function refreshCurrentTab(tab) {
    switch(tab) {
        case "all-games":
            return fetchAllScheduledGames(state.filters.allGames);

        case "available-games":
            return fetchAvailableGames(state.filters.availableGames);

        case "my-games":
            return fetchMySchedule(state.filters.mySchedule);

        case "history-games":
            return fetchHistoryGames(state.filters.history);
    }
}