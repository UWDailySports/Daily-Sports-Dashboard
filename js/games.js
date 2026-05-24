// Functions for getting the user's scheduled games and available games

let currGameId = null;

// Function: fetchMySchedule
// Purpose: Fetches the info for the games the user is scheduled to cover and shows games in dashboard
// Returns: None
// Parameters: (1) writerId: id of writer to get schedule for
//             (2) filters: Filters for games. Can filter by sport and/or location
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region fetchMySchedule() //
async function fetchMySchedule(writerId, filters = { sports: [], locations: [] }) {
    if (!writerId) {
        console.log("Writer ID is missing!");

        return;  
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

    const container = document.getElementById("scheduled-games-container");
    container.innerHTML = "";

    // Special box if no games are scheduled
    if (!games || games.length === 0) {
        console.log("No scheduled games found.");

        const noGames = document.createElement("div");
        
        noGames.innerHTML = `
        <div class = "no-games">No Scheduled Games</div>
        `;

        container.appendChild(noGames);
    }

    games.forEach(game => {
        const gameId = game.game_id;
        const sport = game.sport;
        const opp = game.opponent;
        const location = game.location;
        const date = game.date;
        const time = game.time;
        const notes = game.notes;
        let where = "";
        let recap_css = "";
                                
        if(location == "Seattle, Wash. " || location == "Seattle, Wash."){
            where = "vs";
            recap_css = "home-recap"
        } else {
            where = "@";
            recap_css = "away-recap"
        }

        const gameBox = document.createElement("div");
        gameBox.classList.add("game-box");

        gameBox.innerHTML = `
            <div class = "sport-container">
                <div class = "sport-box">${sport}</div>
                <div class = "notes-box">${notes}</div> 
            </div>
            <div class = "matchup-container">
                <img class = "school-icon" src = "/images/schools/Washington.webp" alt = "UW">
                <div class = "where">${where}</div>
                <img class="school-icon" src="/images/schools/${opp}.webp" alt="${opp}">
            </div>
            <div class = "recap-container">
                <div class="${recap_css}"></div>
                <p class="recap-location">${location}</p>
            </div>
            <div class = "when-container">
                <div class = "date">${formatDate(date)}</div>
                <div class = "time">${time}</div>
            </div>    
            <div class = "options-container">
                <button class = "game-option" data-game-id = "${gameId}">REMOVE</button>
            </div>
            `;

        container.appendChild(gameBox);

        const removeButton = gameBox.querySelector(".remove");
        removeButton.addEventListener("click", async (e) => {
            const gameId = e.target.getAttribute("data-game-id");

            await remove(gameId);

            fetchMySchedule(currWriter.writer_id, { sports: [], locations: [] });
        });
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
async function fetchAvailableGames(filters = { sports: [], locations: [] }) {
    const response = await fetch("/.netlify/functions/available-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters }) 
    });

    const data = await response.json();
    const games = data.games;
            
    const container = document.getElementById("available-games-container");
    container.innerHTML = "";

    // Special box if no games are available
    if (!games || games.length === 0) {
        console.log("No available games found.");

        const noGames = document.createElement("div");
        
        noGames.innerHTML = `
        <div class = "no-games">No Available Games</div>
        `;

        container.appendChild(noGames);
    }

    games.forEach(game => {
        const gameId = game.game_id;
        const sport = game.sport;
        const opp = game.opponent;
        const location = game.location;
        const date = game.date;
        const time = game.time;
        const notes = game.notes;
        let where = "";
        let recap = "";
        let recap_css = "";
                                
        if(location == "Seattle, Wash. " || location == "Seattle, Wash."){
            where = "vs";
            recap_css = "home-recap"
        } else {
            where = "@";
            recap_css = "away-recap"
        }

        const gameBox = document.createElement("div");
        gameBox.classList.add("game-box");

        if(currWriter.position == "Writer"){
            gameBox.innerHTML = `
            <div class = "sport-container">
                <div class = "sport-box">${sport}</div>
                <div class = "notes-box">${notes}</div> 
            </div>
            <div class = "matchup-container">
                <img class = "school-icon" src = "/images/schools/Washington.webp" alt = "UW">
                <div class = "where">${where}</div>
                <img class="school-icon" src="/images/schools/${opp}.webp" alt="${opp}">
            </div>    
            <div class = "recap-container">
                <div class="${recap_css}"></div>
                <p class="recap-location">${location}</p>
            </div>
            <div class = "when-container">
                <div class = "date">${formatDate(date)}</div>
                <div class = "time">${time}</div>
            </div>    
            <div class = "options-container"> 
                <button class = "game-option" onclick = "signup(${gameId}, currWriter.writer_id)>ADD</button>
            </div>    
            `;``
        }

        if(currWriter.position == "Editor"){
            gameBox.innerHTML = `
            <div class = "sport-container">
                <div class = "sport-box">${sport}</div>
                <div class = "notes-box">${notes}</div> 
            </div>
            <div class = "matchup-container">
                <img class = "school-icon" src = "/images/schools/Washington.webp" alt = "UW">
                <div class = "where">${where}</div>
                <img class="school-icon" src="/images/schools/${opp}.webp" alt="${opp}">
            </div>    
            <div class = "recap-container">
                <div class="${recap_css}"></div>
                <p class="recap-location">${location}</p>
            </div>
            <div class = "when-container">
                <div class = "date">${formatDate(date)}</div>
                <div class = "time">${time}</div>
            </div>    
            <div class = "options-container"> 
                <button class = "game-option" onclick = signup(${gameId}, currWriter.writerId)>ADD</button>
                <button class= "assign" onclick="openAssignModal(${gameId})">ASSIGN</button>
                <button class = "edit" onclick="openEditGameModal(${gameId}, 'available-games-filter-container')">EDIT</button>
            </div>    
            `;``
        }
        
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
    const response = await fetch("/.netlify/functions/history-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writerId, filters }) 
    });

    const data = await response.json();
    const games = data.games;
            
    const container = document.getElementById("history-container");
    container.innerHTML = "";

    // Special box if no history is found
    if (!games || games.length === 0) {
        console.log("No history  found.");

        const noGames = document.createElement("div");
            
        noGames.innerHTML = `
        <div class = "no-games">No History Found</div>
        `;

        container.appendChild(noGames);
    }

    games.forEach(game => {
        const gameId = game.game_id;
        const sport = game.sport;
        const opp = game.opponent;
        const location = game.location;
        const date = game.date;
        const time = game.time;
        const notes = game.notes;
        let where = "";
        let recap = "";
        let recap_css = "";
                                
        if(location == "Seattle, Wash. " || location == "Seattle, Wash."){
            where = "vs";
            recap_css = "home-recap"
        } else {
            where = "@";
            recap_css = "away-recap"
        }

        const gameBox = document.createElement("div");
        gameBox.classList.add("game-box");

        gameBox.innerHTML = `
            <div class = "sport-container">
                <div class = "sport-box">${sport}</div>
                <div class = "notes-box">${notes}</div> 
            </div>
            <div class = "matchup-container">
                <img class = "washington-icon" src = "/images/schools/Washington.webp" alt = "UW">
                <div class = "where">${where}</div>
                <img class="opp-icon" src="/images/schools/${opp}.webp" alt="${opp}">
            </div>
            <div class = "recap-container">
                <div class="${recap_css}"></div>
                <p class="recap-location">${location}</p>
            </div>
            <div class = "when-container">
                <div class = "date">${formatDateWithYear(date)}</div>
                <div class = "time">${time}</div>   
            </div>
        `;

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
            fetchAvailableGames(availableFilters);
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
            showToast("Game removed from schedule", "success")
            fetchMySchedule(currWriter.writerId, myScheduleFilters);
        } else {
            showToast("Failed to remove game from schedule", "error")
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error removing game from assignments.");
    }
}     
// #endregion //