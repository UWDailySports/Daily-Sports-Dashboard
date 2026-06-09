
// #region Netlify Login //
netlifyIdentity.on("init", async user => {
    console.log("Netlify Identity Initialized:", user);

    if (!user) {
        window.location.href = "/";
        return;
    }

    await fetchWriterData(user);
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
    currWriter = data.writer;

    if (currWriter && currWriter.first_name) {
        document.getElementById("greetingHeader").textContent = `Hi, ${currWriter.first_name}!`;
    } else {
        document.getElementById("greetingHeader").textContent = "Hi, Guest";
    }

    return currWriter; 
};
// #endregion //
    



