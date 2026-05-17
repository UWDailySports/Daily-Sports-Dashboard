async function openAddSeasonModal() {
    const addSeasonModal = document.getElementById("add-season-modal");
    addSeasonModal.style.display = "flex";

} 

const dropZone = document.getElementById("season-drop-zone");
const fileInput = document.getElementById("season-file-input");

let selectedFile = null;

// click to browse
dropZone.addEventListener("click", () => {
    fileInput.click();
});

// file selected manually
fileInput.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];
    showFileName();
});

// drag over
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

// drag leave
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

// drop file
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    selectedFile = e.dataTransfer.files[0];
    showFileName();
});

function showFileName() {
    if (selectedFile) {
        dropZone.innerHTML = `<p>${selectedFile.name}</p>`;
    }
}

document.getElementById("add-season-confirm").addEventListener("click", async () => {
    if (!selectedFile) {
        alert("Please upload a file");
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/.netlify/functions/upload-season", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    console.log(data);
});