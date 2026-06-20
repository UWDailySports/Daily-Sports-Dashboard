
// #region Netlify Login //
netlifyIdentity.on("init", async user => {
    console.log("Netlify Identity Initialized:", user);

    if (!user) {
        window.location.href = "/";
        return;
    }

    await fetchWriterData(user);
    await fetchUserSchoolInfo();
    await loadModals();
});
// #endregion //

// #region Netlify Logout //
document.getElementById("logout").onclick = function () {
    console.log("Attempting to log out...");

    netlifyIdentity.logout();
};

netlifyIdentity.on("logout", () => {
    console.log("Logged out successfully");

    localStorage.removeItem("netlify_identity");

    window.location.href = "/";
 });
 // #endregion //


 // Function: fetchWriterData
 // Purpose: Fetches the writer data for the logged in user and stores it in state
 // Returns: currWriter: Object containing the writer data for the logged in user
// Parameters: (1) user: The logged in user object from Netlify Identity
// errors: (1) error if DB URL not set
//         (2) statusCode 500 if error in DB query
// #region fetchWriterData //
async function fetchWriterData(user) {
    const email = user.email;

    const response = await fetch("/.netlify/functions/writer-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    state.currWriter = data.writer;

    if (state.currWriter && state.currWriter.first_name) {
        document.getElementById("greetingHeader").textContent = `Hi, ${state.currWriter.first_name}!`;
    } else {
        document.getElementById("greetingHeader").textContent = "Hi, Guest";
    }

};
// #endregion //


async function loadModals() {
    const container = document.getElementById("modal-container");

    const files = [
        "/html/modals/add-season-modal.html",
        "/html/modals/game-actions-modal.html",
        "/html/modals/invoice-modal.html",
        "/html/modals/search-games-modal.html",
        "/html/modals/sports-modal.html",
        "/html/modals/user-school-modal.html",
        "/html/modals/writers-modal.html"
    ];

    for (const file of files) {
        const response = await fetch(file);
        container.innerHTML += await response.text();
    }
}


    



