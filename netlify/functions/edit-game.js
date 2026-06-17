const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const { gameId, sport, abbreviation, opponent, date, time, location, notes } = JSON.parse(event.body); 

        const query = `
            UPDATE "Games"
            SET sport = $2, abbreviation = $3, opponent = $4, date = $5, time = $6, location = $7, notes = $8
            WHERE game_id = $1
            RETURNING *;
        `;
        await client.query(query, [gameId, sport, abbreviation, opponent, date, time, location, notes]);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Game updated successfully!" }),
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