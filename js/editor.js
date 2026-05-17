
 async function inviteWriter(first_name, last_name, email) {

    if (!email || !first_name || !last_name) {
        alert("Missing fields");
        return;
    }

    const response = await fetch("/.netlify/functions/invite-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email })
    });

    const text = await response.text();

    console.log("NETLIFY RAW RESPONSE:", text);

    let data;
    try {
        data = JSON.parse(text);
    } catch {
        data = { message: text };
    }

    if (response.ok) {
        alert("Invite sent!");
    } else {
        alert("Error: " + data.error);
    }
}


//#endregion 



 
 