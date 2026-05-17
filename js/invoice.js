// Functions for manging invoices


function openInvoiceModal() {
    document.getElementById("invoice-modal").style.display = "flex";
}

document.getElementById("confirm-invoice").addEventListener("click", async () => {
    const date = document.getElementById("invoice-date-input").value;
    const total = document.getElementById("invoice-total-input").value;
    const link = document.getElementById("invoice-link-input").value;

    if (!date || !total) {
        alert("Please fill in the date and total.");
        return;
    }

    await addInvoice(currWriter.writer_id, date, total, link);
    document.getElementById("invoice-modal").style.display = "none";
    
    fetchInvoices(currWriter.writer_id);
});


async function fetchInvoices(writerId) {
    const response = await fetch("/.netlify/functions/get-invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writerId }) 
    });  
            
    const data = await response.json();
    const invoices = data.invoices;
            
    const container = document.getElementById("invoice-entries-container");
    container.innerHTML = "";   

    if (!invoices || invoices.length === 0) {
    console.log("No invoices found.");

    const noInvoices = document.createElement("div");
        
    noInvoices.innerHTML = `
    <div class = "no-games">No Invoices Found</div>
    `;

        container.appendChild(noInvoices);
    }

    invoices.forEach(invoice => {
        const date = invoice.date;
        const total = invoice.total;
        const link = invoice.link;

        const invoiceBox = document.createElement("div");
        invoiceBox.classList.add("invoice-entry-box");
        invoiceBox.style.cursor = "pointer";

        invoiceBox.innerHTML = `
            <div class = "invoice-entry-box-date">${formatDateWithYearNoDOW(date)}</div>
            <div class = "invoice-entry-box-total">$${total}</div>
        `;
                
        invoiceBox.addEventListener("click", () => {
            if (link) {
                window.open(link, "_blank");
            }
        });

            container.appendChild(invoiceBox);
    });
}; 

async function addInvoice(writerId, date, total, link) {
    try {
        const response = await fetch("/.netlify/functions/add-invoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ writerId, date, total, link })
        });

        const data = await response.json();
        if (data.success) {
            alert("Invoice successfully added!");
        } else {
            alert("Failed to add invoice.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error adding invoice.");
    }
}
