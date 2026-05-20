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

    // read uploaded excel file
    const fileData = await selectedFile.arrayBuffer();

    const workbook = XLSX.read(fileData, {
        type: "array"
    });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet);
    console.log(Object.keys(rows[0]));

    rows.forEach(row => {
        let date = row['Start Date'];

        if (!date) return;

        // Case 1: already a JS Date
        if (date instanceof Date) {
            // No conversion needed
        }

        // Case 2: Excel serial number
        else if (typeof date === "number") {
            date = XLSX.SSF.parse_date_code(date);
            date = new Date(date.y, date.m - 1, date.d);
        }

        // Case 3: string fallback (MM/DD/YYYY)
        else if (typeof date === "string") {
            const [month, day, year] = date.split("/");
            date = new Date(year, month - 1, day);
        }

        if (date && !isNaN(date)) {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");

            row['Start Date'] = `${yyyy}-${mm}-${dd}`;
        }

        let time = row['Start Time'];
        if(time != "TBD" && time != "TBA" && time != "All Day"){
            time = time.replace(/(\d)(\s?)(am|pm)/i, "$1 $3");
        }
        
        row['Start Time'] = time;
    });

    console.log(rows);


    const response = await fetch("/.netlify/functions/upload-season", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(rows)
    });

    const data = await response.json();

    console.log(data);

    if (data.success) {
        showToast("Season data uploaded successfully!", "success");
    } else {
        showToast("Failed to upload season data", "error");
    }
});