// Functions for managing tabs and loading content for tabs

window.tabHandlers = {};

window.onload = async function() {
    const user = netlifyIdentity.currentUser();

    if (!user) return;

    await fetchWriterData(user); 
            
    const scheduledTabId = "production";
    const scheduledButton = document.querySelector(`button[onclick="showTab(event, '${scheduledTabId}')"]`);
    const scheduledTab = document.getElementById(scheduledTabId);

    const allTabs = document.getElementsByClassName("tab-content");
    const allButtons = document.getElementsByClassName("tab-button");
    for (let tab of allTabs) tab.style.display = "none";
    for (let btn of allButtons) btn.classList.remove("active-tab");

    scheduledTab.style.display = "flex";
    scheduledButton.classList.add("active-tab");
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

    /*if (!container.hasChildNodes()) {
        const iframe = document.createElement("iframe");
        iframe.src = "https://docs.google.com/spreadsheets/d/1ReZfEgHbrBQnmULJR40Ko-4otU7xScpkCjUSmtFUXQI/edit?gid=1543249032#gid=1543249032";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";

        container.appendChild(iframe);
    }*/
};


tabHandlers["scheduled-games"] = function() {
    const container = document.getElementById("scheduled-games-filter-container");

    if (!container.hasChildNodes()) {
        createGamesFilter(
            "scheduled-games-filter-container",
            myScheduleFilters,
            filters => {
                fetchMySchedule(currWriter.writer_id, filters);
            });
    }

    fetchMySchedule(currWriter.writer_id, myScheduleFilters);
};


tabHandlers["available-games"] = function () {
    const container = document.getElementById("available-games-filter-container");

    if (!container.hasChildNodes()) {
        createGamesFilter(
            "available-games-filter-container",
            availableFilters,
            filters => {
                fetchAvailableGames(filters);
            }
        );
    }

    fetchAvailableGames(availableFilters);
};


tabHandlers["invoices"] = function() {
    fetchInvoices(currWriter.writer_id);
};


tabHandlers["history"] = function() {
    const filterContainer = document.getElementById("history-filter-container");

    if (!filterContainer.hasChildNodes()) {
        loadHistoryFilters(); 

        const container = document.getElementById("history-filter-container");
        const boxes = container.querySelectorAll(".filter-box, .history-month-box, .history-location-box");

        boxes.forEach(box => {
            box.addEventListener("click", () => {
                box.classList.toggle("active");

                const value = box.dataset.value;

                if (box.closest(".sport-options")) {
                    toggleFilterValue(historyFilters.sports, value);
                }

                if (box.closest(".location-options")) {
                    toggleFilterValue(historyFilters.locations, value);
                }

                if (box.closest(".month-options")) {
                    toggleFilterValue(historyFilters.months, value);
                }

                fetchHistoryGames(currWriter.writer_id, historyFilters);
            });
        });
    }

    fetchHistoryGames(currWriter.writer_id, historyFilters);
};

