// Functions for getting the user's scheduled games and available games

let currGameId = null;

function createSkeletonGameBoxes(container) {
    for(let i = 0; i < 6; i++){
        const skeleton = document.createElement("div");
        skeleton.classList.add("game-box", "skeleton-game");

        skeleton.innerHTML = `
            <div class="skeleton skeleton-sport"></div>
            <div class="skeleton skeleton-matchup"></div>
            <div class="skeleton skeleton-location"></div>
            <div class="skeleton skeleton-date"></div>
        `;

        container.appendChild(skeleton);
    }
}

function noGames(container, message) {
    console.log("No scheduled games found.");

    const noGames = document.createElement("div");
    noGames.classList.add("no-games");
    noGames.textContent = message;

    container.appendChild(noGames);
}

// Function: getSportNames
// Purpose: Returns the names of all sports in DB
// Returns: names of sports
// Parameters: None
// exceptions: (1) 500 if error with DB
// #region getSportNames()
async function getSportNames() {
    const response = await fetch("/.netlify/functions/get-sports");
    const data = await response.json();

    return data.sports.map(s => s.sport);
}
// #endregion //


// Function: getSports
// Purpose: Returns the objects of all sports in DB
// Returns: sports as objects
// Parameters: None
// exceptions: (1) 500 if error with DB
// #region getSports()
async function getSports() {
    const response = await fetch("/.netlify/functions/get-sports");

    console.log("response:", response);

    const data = await response.json();

    console.log("sports data:", data);

    return data.sports;
}
// #endregion //

// #region loadSports
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
async function fetchMySchedule(filters = { sports: [], locations: [], months: [] }) {
    const container = document.getElementById("scheduled-games-container");
    container.innerHTML = "";

    createSkeletonGameBoxes(container);
            
    const myGames = await fetchGames("my-games", filters);

    if (!myGames || myGames.length === 0) {
        noGames(container, "No Games in Schedule");
    }

    myGames.forEach(game => {
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
    const container = document.getElementById("available-games-container");
    container.innerHTML = "";

    createSkeletonGameBoxes(container);

    const availableGames = await fetchGames("available-games", filters);

    if (!availableGames || availableGames.length === 0) {
        noGames(container, "No Available Games");
    }

    const currWriterPosition = state.currWriter.position;

    if(currWriterPosition === "Writer") {
        availableGames.forEach(game => {
            const gameBox = createGameBox(game, options = ["add"], tab = "available-games");
            container.appendChild(gameBox);
        })
    }

    if(currWriterPosition === "Editor" || currWriterPosition === "EIC" || currWriterPosition === "Copy") {
        availableGames.forEach(game => {
            const gameBox = createGameBox(game, options = ["add", "assign", "edit"], tab = "available-games");
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
    const container = document.getElementById("all-games-container");
    container.innerHTML = "";

    createSkeletonGameBoxes(container);

    const allGames = await fetchGames("all-games", filters);

    if (!allGames || allGames.length === 0) {
        noGames(container, "No Games in Schedule");
    }

    allGames.forEach(game => {
        const gameBox = createGameBox(game, options = ["edit", "remove"], tab = "all-games");
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
async function fetchHistoryGames(filters = { sports: [], locations: [], months: [] }) {
    const container = document.getElementById("history-container");
    container.innerHTML = "";

    createSkeletonGameBoxes(container);

    const historyGames = await fetchGames("history-games", filters);

    if (!historyGames || historyGames.length === 0) {
        noGames(container, "No Games in History");
    }

    historyGames.forEach(game => {
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
    try {
        const response = await fetch("/.netlify/functions/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameId, writerId })
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
            fetchMySchedule(state.filters.myGames);
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
                break;

            case "assign":
                gameOptions += `<button class="game-option" data-action = "assign-game">ASSIGN</button>`;        
                break;

            case "edit":
                gameOptions += `<button class="game-option" data-action = "edit-game">EDIT</button>`;
                break;

            case "remove":
                gameOptions += `<button class="game-option" data-action = "remove-game">REMOVE</button>`;
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

        const addButton = gameBox.querySelector('[data-action="add-game"]');
        if(addButton){
            addButton.addEventListener("click", async (e) => {
                await signup(gameId, state.currWriter.writer_id);
                refreshCurrentTab(tab);
            });
        }  
        
        const assignButton = gameBox.querySelector('[data-action="assign-game"]');
        if(assignButton){
            assignButton.addEventListener("click", async (e) => {
                await openAssignGameModal(gameId);
                refreshCurrentTab(tab);
            }); 
        }
        
        const editButton = gameBox.querySelector('[data-action="edit-game"]');
        if(editButton){
            editButton.addEventListener("click", async (e) => {
                await openEditGameModal(game);
                refreshCurrentTab(tab);
            });  
        }
        
        const removeButton = gameBox.querySelector('[data-action="remove-game"]');
        if(removeButton){
            removeButton.addEventListener("click", async (e) => {
                await remove(gameId);
                refreshCurrentTab(tab);
            });     
        }   

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

async function fetchGames(tab, filters) {
    let fetchEndpoint = "";
    let fetchBody = null;

    switch(tab){
        case "all-games": 
            fetchEndpoint = "/.netlify/functions/get-all-games";
            fetchBody = JSON.stringify({ filters });
            break;

        case "my-games": 
            fetchEndpoint = "/.netlify/functions/get-my-games";
            fetchBody = JSON.stringify({ writerId: state.currWriter.writer_id, filters });
            break;

        case "available-games": 
            fetchEndpoint = "/.netlify/functions/get-available-games";
            fetchBody = JSON.stringify({ filters }); 
            break;

        case "history-games":
            fetchEndpoint = "/.netlify/functions/get-history-games";
            fetchBody = JSON.stringify({ writerId: state.currWriter.writer_id, filters });
            break;   
    }

    const response = await fetch(fetchEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: fetchBody
    });

    if (!response.ok) {
        console.log("Failed to fetch games. Status:", response.status);
        return;
    }

    const data = await response.json();

    return data.games;
}