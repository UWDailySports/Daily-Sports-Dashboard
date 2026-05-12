const { Client} = require("pg");

exports.handler = async (event) => {
    console.log("Event:", event);

    try {
        if(!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL environment variable not set");
        }
        
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { require: true, rejectUnauthorized: false },
        });

        await client.connect();
        console.log("Connected to DB");

        const query = 'SELECT * FROM "Sports" ORDER BY sport';
        const result = await client.query(query);
        await client.end();

        return {
            statusCode: 200,
            body: JSON.stringify({ sports: result.rows })
        };
    } catch (err) {
        console.error("Error fetching sports:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }    
};