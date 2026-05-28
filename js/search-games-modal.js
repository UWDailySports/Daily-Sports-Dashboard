// All Functions for Searching games  in Settings


// Function: openSportsModal
// Purpose: Opens the modal for sport info
// Returns: None
// Parameters: None
// #region openSearchGamesModal() //
async function openSearchGamesModal() {
    await fetchSearchGameInfo(); 

    document.getElementById("search-games-modal").style.display = "flex";
};    

const searchGamesModal = document.getElementById("search-games-modal");

document.addEventListener("click", () => {
    document.querySelectorAll(".list-options").forEach(options => {
        options.style.display = "none";
    });
});

// #endregion //

// Function: fetchGameInfo
// Purpose: Fetches game info from the DB and populates the search games modal
// Returns: None
// Parameters: None
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region fetchSearchGameInfo() //
async function fetchSearchGameInfo() {
    const response = await fetch("/.netlify/functions/get-search-game-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    const games = data.games;

    if(!games || games.length === 0) {
        console.log("No games found.");
        return;
    }

    const container = document.getElementById("search-games-list-container");
    container.innerHTML = "";

    for (const game of games) {
        const id = game.game_id;
        const date = game.date;
        const sport = game.sport;
        const opponent = game.opponent;
        const location = game.location;
        const time = game.time;
        const notes = game.notes || "";
        const name = (game.first_name || "") + " " + (game.last_name || "");
        const covered = game.available
            ? `<span style="color: red;">&#10006;</span>`
            : `<span style="color: green;">&#10004;</span>`;

        const gameBox = document.createElement("div");
        gameBox.classList.add("search-games-list-entry-container");
        gameBox.innerHTML = `
            <div class = "search-games-list-entry-section" style="width: 5%;">${id}</div>
            <div class = "search-games-list-entry-section" style="width: 15%;">${date}</div>
            <div class = "search-games-list-entry-section" style="width: 15%;">${sport}</div>
            <div class = "search-games-list-entry-section" style="width: 15%;">${opponent}</div>
            <div class = "search-games-list-entry-section" style="width: 15%;">${location}</div>
            <div class = "search-games-list-entry-section" style="width: 5%;">${time}</div>
            ${notes ? `
                <div class="search-games-list-notes-container">
                    <div class="notes-icon">i</div>
                    <div class="notes-modal">${notes}</div>
                </div>
            ` : `<div class = "search-games-list-notes-container"></div>`}
            <div class = "search-games-list-entry-section" style="width: 15%;">${name}</div>
            <div class = "search-games-list-entry-section" style="width: 5%; justify-content: center; font-size: 18px;">${covered}</div>
            <div class="list-options">
                <div class = "list-option" onclick = "openEditGameModal(id)">Edit</div>
                <div class = "list-option" onclick = "deleteGame(id)">Delete</div>
            </div>
            <button class = "search-games-list-entry-section list-options-button" style="width: 5%; font-size: 30px; margin-bottom: 1.5%;">&hellip;</button>
         `;       
         
        const optionsButton = gameBox.querySelector(".list-options-button");
        const options = gameBox.querySelector(".list-options");

        if(!optionsButton) console.log("Options button not found for game ID:", id);
        if(!options) console.log("Options menu not found for game ID:", id);

        options.addEventListener("click", e => e.stopPropagation());

        optionsButton.addEventListener("click", (e) => {
            console.log("clicked");
            e.stopPropagation();

            document.querySelectorAll(".list-options").forEach(m => {
                if (m !== options) m.style.display = "none";
            });

            options.style.display =
                options.style.display === "flex" ? "none" : "flex";
        });   
        
        container.appendChild(gameBox);
    }   

    const searchInput = document.getElementById("search-games-input");

    searchInput.oninput = () => {
        const term = searchInput.value.toLowerCase();

        document.querySelectorAll(".search-games-list-entry-container").forEach(game => {
            game.style.display =
                game.textContent.toLowerCase().includes(term)
                    ? "flex"
                    : "none";
        });
    };
}     
// #endregion //