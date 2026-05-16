const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const { sport_id } = JSON.parse(event.body); 

        const query = `
        DELETE 
        FROM "Sports"
        WHERE sport_id = $1`;
        await client.query(query, [sport_id]);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Sport deleted!" }),
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