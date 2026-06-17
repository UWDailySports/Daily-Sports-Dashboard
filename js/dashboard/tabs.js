// Functions for managing tabs and loading content for tabs

window.tabHandlers = {};

window.onload = async function() {
    const user = netlifyIdentity.currentUser();

    if (!user) return;

    await fetchWriterData(user);

    const button = document.querySelector(
        `button[onclick="showTab(event, 'my-games')"]`
    );

    showTab(
        { currentTarget: button },
        "my-games"
    );
};

window.showTab = function(event, tabId) {
    const tabs = document.getElementsByClassName("tab-content");
    const buttons = document.getElementsByClassName("tab-button");

    for (let tab of tabs) tab.style.display = "none";
    for (let btn of buttons) btn.classList.remove("active-tab");

    event.currentTarget.classList.add("active-tab");
    document.getElementById(tabId).style.display = "flex";
    

    if (tabHandlers[tabId]) {
        tabHandlers[tabId]();
    }
};

tabHandlers["production"] = function() {
    const container = document.getElementById("production");

    if (!container.hasChildNodes()) {
        const iframe = document.createElement("iframe");
        iframe.src = "https://docs.google.com/spreadsheets/d/1ReZfEgHbrBQnmULJR40Ko-4otU7xScpkCjUSmtFUXQI/edit?gid=1543249032#gid=1543249032";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";

        container.appendChild(iframe);
    }
};


let myScheduleLoaded = false;
tabHandlers["my-games"] = async function () {
    if(myScheduleLoaded === false){
        await buildFilters(
            "my-games-filter-container",
            state.filters.myGames,
            filters => fetchMySchedule(filters)
        );

        await fetchMySchedule(state.filters.myGames);

        myScheduleLoaded = true;
    }
};


let availableGamesLoaded = false;
tabHandlers["available-games"] = async function () {
    if (availableGamesLoaded === false) {
        await buildFilters(
            "available-games-filter-container",
            state.filters.availableGames,
            filters => fetchAvailableGames(filters)
        );

        await fetchAvailableGames(state.filters.availableGames);

        availableGamesLoaded = true;
    }
};

let allScheduledGamesLoaded = false;
tabHandlers["all-games"] = async function () {
    if(allScheduledGamesLoaded === false){
        await buildFilters(
            "all-games-filter-container",
            state.filters.allGames,
            filters => fetchAllScheduledGames(filters)
        );

        await fetchAllScheduledGames(state.filters.allGames);

        allScheduledGamesLoaded = true;
    }
};


let invoicesLoaded = false;
tabHandlers["invoices"] = async function() {
    if(invoicesLoaded === false) {
        getPayPeriod();
        await fetchInvoices(state.currWriter.writer_id);

        invoicesLoaded = true;
    }
};    

let historyLoaded = false;
tabHandlers["history"] = async function () {
    if(historyLoaded === false) {
        await buildFilters(
            "history-games-filter-container",
            state.filters.historyGames,
            filters => fetchHistoryGames(filters));

        await fetchHistoryGames(state.filters.historyGames);

        historyLoaded = true;
    }
};

