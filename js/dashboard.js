let currWriter = null;

// Initialize Netlify Identity / Logging in
netlifyIdentity.on("init", async user => {
    console.log("Netlify Identity Initialized:", user);

    if (!user) {
        window.location.href = "/";
        return;
    }

    await fetchWriterData(user);
});

// Logging Out
document.getElementById("logout").onclick = function () {
    console.log("Attempting to log out...");

    netlifyIdentity.logout();
};

netlifyIdentity.on("logout", () => {
    console.log("Logged out successfully");

    localStorage.removeItem("netlify_identity");

    window.location.href = "/";
 });


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
    

document.querySelectorAll(".close-button").forEach(btn => {
    btn.addEventListener("click", () => {
        const modal = btn.closest(".modal");

        if (modal) modal.style.display = "none";
    });
});

window.addEventListener("click", (event) => {
    document.querySelectorAll(".modal").forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

