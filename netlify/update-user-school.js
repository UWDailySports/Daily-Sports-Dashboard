const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const { selectedSchool } = JSON.parse(event.body); 

        const getIdQuery = `SELECT school_id FROM "Schools" WHERE school = $1;`
        const schoolId = client.query(getIdQuery, selectedSchool);

        const query = `
            UPDATE "User_School"
            SET school_id = $1
            WHERE row = 1
            RETURNING *;
        `;
        await client.query(query, schoolId);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "User school successfully edited!" }),
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