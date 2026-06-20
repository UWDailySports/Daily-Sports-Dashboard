async function loadModals() {
    const container = document.getElementById("modal-container");

    console.log("container:", container);

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

    console.log(file, response.status);

    container.innerHTML += await response.text();
}
}

window.addEventListener("DOMContentLoaded", loadModals);