const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const { writer_id, first_name, last_name, position, email, phone, x, headshot, hire_date, end_date } = JSON.parse(event.body); 

        const query = `
            UPDATE "Writers"
            SET first_name = $2, last_name = $3, position = $4, email = $5, phone = $6, x = $7, headshot = $8, hire_date = $9, end_date = $10
            WHERE writer_id = $1
            RETURNING *;
        `;
        await client.query(query, [writer_id, first_name, last_name, position, email, phone, x, headshot, hire_date, end_date]);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Writer edited successfully!" }),
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