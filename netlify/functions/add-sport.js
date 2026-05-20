console.log("Add writer function hit");

const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const { sport_name, sid, sid_email, sid_phone } = JSON.parse(event.body);

        const insertSportQuery = `
            INSERT INTO "Sports" (sport, sid, sid_email, sid_phone)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await client.query(insertSportQuery, [sport_name, sid, sid_email, sid_phone]);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Sport added successfully!" }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "Error adding sport." }),
        };
    } finally {
        await client.end();
    }
}
        
