const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const { Event, 'Start Date': date, 'Start Time': time, Location: location, 'Category': sport } = JSON.parse(event.body); 

        const opponent = Event.split("vs ")[1].trim();

        // Step 1: Add the game to the Games table
        const insertGameQuery = `
            INSERT INTO "Season" (sport, opponent, date, time, location, notes, available)
            VALUES ($1, $2, $3, $4, $5, $6, TRUE)
            RETURNING *;
        `;
        const result = await client.query(insertGameQuery, [sport, opponent, date, time, location, NULL]);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Game added to available games!" }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "Error processing the request." }),
        };
    } finally {
        await client.end();
    }
}