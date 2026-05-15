let allScheduledFilters = { sports: [], locations: [] };

//#region Load Methods

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

async function loadSports(selectId) {
    const response = await fetch("/.netlify/functions/get-sports");
    const data = await response.json();
    const sports = data.sports;

    const select = document.getElementById(selectId);
    select.innerHTML = "";

    sports.forEach(sport => {
        const option = document.createElement("option");
        option.value = sport.sport;
        option.textContent = sport.sport;
        select.appendChild(option);
    });
}

async function loadGameInfo(gameId) {
    const response = await fetch("/.netlify/functions/get-game-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId })
    });

    const gameInfo = await response.json();

    return gameInfo;
}
//#endregion        
       
//#region Fetch Methods

async function fetchAllScheduledGames(writerId, filters = { sports: [], locations: [] }) {
    const response = await fetch("/.netlify/functions/all-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writerId, filters }) 
    });

    if (!response.ok) {
        console.log("Failed to fetch all scheduled games. Status:", response.status);
        return;
    }

    const data = await response.json();
    const games = data.games;

    const container = document.getElementById("all-games-container");
    container.innerHTML = "";

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
        const name = game.first_name + " " + game.last_name;
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
                <div class = "date">${formatDate(date)}</div>
                <div class = "time">${time}</div>
            </div>
            <div class = "writer">${name}</div>
            <div class = "options-container"> 
                <button class = "remove" data-game-id = "${gameId}">REMOVE</button>
                <button class = "edit" onclick="openEditGameModal(${gameId}, 'all-games-filter-container')">EDIT</button>
            </div>    
        `;

        container.appendChild(gameBox);

        const removeButton = gameBox.querySelector(".remove");
        removeButton.addEventListener("click", async (e) => {
            const gameId = e.target.getAttribute("data-game-id");

            await remove(gameId);

            fetchAllScheduledGames(currWriter.writer_id, allScheduledFilters);
        });
    });
}   

async function fetchWriterInfo() {
    const response = await fetch("/.netlify/functions/get-writer-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });

    if(!response.ok) {
        console.log("Failed to fetch writer info:", response.status);
        return;
    }

    const data = await response.json();
    const writers = data.writers;

    const container = document.getElementById("writer-list-container");
    container.innerHTML = "";

    writers.forEach(writer => {
        const first_name = writer.first_name;
        const last_name = writer.last_name;
        const position = writer.position;
        const email = writer.email;
        let phone = writer.phone;
            if(phone === null) {
                phone = "";
            }
        let x = writer.x;
        let x_short = "";
            if(x === null) {
                x = "";
            } else {
                x_short = x.replace("https://x.com/", "@");
            }
            
        let headshot = writer.headshot;
            if(headshot === null){
                headshot = "";
            }
        let hire_date = writer.hire_date;
        let hire_date_formatted = ""; 
            if(hire_date === null) {
                hire_date_formatted = "Shadow";
            } else {
                hire_date_formatted = new Date(hire_date).toLocaleDateString("en-US", {
                                                                                month: "long",
                                                                                day: "numeric",
                                                                                year: "numeric"
                                                                            });
        }
        let end_date = writer.end_date;
        let end_date_formatted = "";
            if(end_date === null) {
                end_date_formatted = "Current";
            } else {
                end_date_formatted = new Date(end_date).toLocaleDateString("en-US", {
                                                                            month: "long",
                                                                            day: "numeric",
                                                                            year: "numeric"
                                                                        });
            }
            
        const writerBox = document.createElement("div");
        writerBox.classList.add("writer-list-entry-container");

        writerBox.innerHTML = `
        <div class = "writer-list-entry-section">${first_name}</div>
        <div class = "writer-list-entry-section">${last_name}</div>
        <div class = "writer-list-entry-section">${position}</div>
        <div class = "writer-list-entry-section" style = "width: 15%;">${email}</div>      
        <div class = "writer-list-entry-section">${phone}</div>
        ${x
            ? `<a class="writer-list-entry-section" href="${x}" target="_blank">${x_short}</a>`
            : `<div class="writer-list-entry-section"></div>`
        }
        ${headshot
            ? `<a class="writer-list-entry-section" href="${headshot}" target="_blank">Link</a>`
            : `<div class="writer-list-entry-section"></div>`
        }
        <div class = "writer-list-entry-section">${hire_date_formatted}</div>
        <div class = "writer-list-entry-section">${end_date_formatted}</div>
        <div class="writer-options">
            <button>Edit</button>
            <button>Remove</button>
        </div>
        <button class = "writer-list-entry-section writer-options-button" style="width: 5%; font-size: 30px; margin-bottom: 1.5%;">&hellip;</button>
        `

        const optionsBtn = writerBox.querySelector(".writer-options-button");
        const options = writerBox.querySelector(".writer-options");

        if (!optionsBtn) console.log("button not found");
        if (!options) console.log("menu not found");

        optionsBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            document.querySelectorAll(".writer-options").forEach(m => {
                if (m !== options) m.style.display = "none";
    });

    options.style.display =
        options.style.display === "flex" ? "none" : "flex";
});

        container.append(writerBox);    

    });
}

document.addEventListener("click", () => {
    document.querySelectorAll(".writer-options").forEach(options => {
        options.style.display = "none";
    });
});

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
            <div class = "sport-list-entry-options" style="font-size: 30px; margin-bottom: 1.5%;">&hellip;</div>
        `;
        container.appendChild(sportBox);
    }
}
//#endregion      

//#region tabHandlers

tabHandlers["all-games"] = function() {
    const container = document.getElementById("all-games-filter-container");

    if (!container.hasChildNodes()) {
        createGamesFilter(
            "all-games-filter-container",
            allScheduledFilters,
            filters => {
                fetchAllScheduledGames(currWriter.writer_id, filters);
            });
    }

    fetchAllScheduledGames(currWriter.writer_id, allScheduledFilters);
};


//#endregion

//#region Modals //

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

async function openAddGameModal(containerId) {
    currentContainer = containerId;

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

async function openEditGameModal(gameId, containerId) {
    currGameId = gameId;
    currentContainer = containerId;

    const data = await loadGameInfo(gameId);
    console.log("GAME DATA:", data);
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

async function openWritersModal() {
    await fetchWriterInfo();

    document.getElementById("writers-modal").style.display = "flex"; 
};

const writersModal = document.getElementById("writers-modal"); 


async function openAddWriterModal() {
    document.getElementById("add-writer-modal").style.display = "flex";
};    

const addWriterModal = document.getElementById("add-writer-modal");

document.getElementById("add-writer-confirm").onclick = async () => {
    const first_name = document.getElementById("new-writer-first-name").value;
    const last_name = document.getElementById("new-writer-last-name").value;
    const email = document.getElementById("new-writer-email").value;
    const phone = document.getElementById("new-writer-phone").value;
    const hire_date = document.getElementById("new-writer-hire-date").value;
    const x  = document.getElementById("new-writer-x").value;
    const headshot = document.getElementById("new-writer-headshot").value;

    if(!first_name || !last_name || !email || !phone || !hire_date || !x || !headshot) {
        alert("Please fill in all required fields");
        return;
    } 

    await addWriter(first_name, last_name, email, phone, hire_date, x, headshot);

    addWriterModal.style.display = "none";
};

async function openSportsModal() {
    await fetchSportInfo();

    document.getElementById("sport-modal").style.display = "flex";
};    

const sportModal = document.getElementById("sport-modal");

//#endregion //

//#region Game Functions (add, edit, delete)

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

 async function addWriter(first_name, last_name, email, phone, hire_date, x, headshot) {
    try {
        const response = await fetch("/.netlify/functions/add-writer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ first_name, last_name, email, phone, hire_date, x, headshot })
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
            showToast("New writer successfully added!", "success");
        } else {
            showToast("Failed to add new writer", "error");
        }
    }  
    catch (error) {
        console.error("Error:", error);
        alert("Error adding new writer.");
    }
 }
 
 async function inviteWriter(first_name, last_name, email) {

    if (!email || !first_name || !last_name) {
        alert("Missing fields");
        return;
    }

    const response = await fetch("/.netlify/functions/invite-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email })
    });

    const text = await response.text();

    console.log("NETLIFY RAW RESPONSE:", text);

    let data;
    try {
        data = JSON.parse(text);
    } catch {
        data = { message: text };
    }

    if (response.ok) {
        alert("Invite sent!");
    } else {
        alert("Error: " + data.error);
    }
}

//#endregion 



 
 