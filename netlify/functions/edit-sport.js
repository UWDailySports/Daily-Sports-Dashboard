const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const { sport_id, sport, abbreviation, sid, email, phone } = JSON.parse(event.body); 

        const query = `
            UPDATE "Sports"
            SET sport = $2, abbreviation = $3, sid = $4, sid_email = $5, sid_phone = $6
            WHERE sport_id = $1
            RETURNING *;
        `;
        await client.query(query, [sport_id, sport, abbreviation, sid, email, phone]);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Sport edited successfully!" }),
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