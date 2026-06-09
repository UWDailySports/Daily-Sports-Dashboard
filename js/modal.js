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