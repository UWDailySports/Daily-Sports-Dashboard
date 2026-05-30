// Filters and Functions for All Scheduled Games

let allScheduledFilters = { sports: [], locations: [], months: [] };

tabHandlers["all-games"] = async function () {
    await buildFilters(
        "all-games-filter-container",
        allScheduledFilters,
        filters => fetchAllScheduledGames(filters)
    );

    fetchAllScheduledGames(currWriter.writer_id, allScheduledFilters);
};

// Function: fetchAllScheduledGames
// Purpose: Fetches the info for all scheduled games and shows games in dashboard
// Returns: None
// Parameters: (1) filters: Filters for games. Can filter by sport and/or location
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region fetchAllScheduledGames //

async function fetchAllScheduledGames(filters = { sports: [], locations: [], months: [] }) {
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
        const gameId = game.game_id;
        const sport = game.sport;
        const opp = game.opponent;
        const location = game.location;
        const date = game.date;
        const time = game.time;
        const notes = game.notes;
        const name = game.first_name + " " + game.last_name;
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
            <div class = "writer">${name}</div>
            <div class = "options-container"> 
                <button class = "game-option" data-game-id = "${gameId}" data-action="remove">REMOVE</button>
                <button class = "game-option" data-action = "edit">EDIT</button>
            </div>    
        `;

        container.appendChild(gameBox);

        const removeButton = gameBox.querySelector('[data-action="remove"]');
        removeButton.addEventListener("click", async (e) => {
            const gameId = e.target.getAttribute("data-game-id");

            await remove(gameId);
            fetchAllScheduledGames(allScheduledFilters);
        });

        const editButton = gameBox.querySelector('[data-action="edit"]');
        editButton.addEventListener("click", async (e) => {
            openEditGameModal(game, "all-games-filter-container");
        });
    });
} 
// #endregion //