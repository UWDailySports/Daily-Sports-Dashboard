const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const { writer_id } = JSON.parse(event.body); 
        
        const updateAssignmentsQuery = `
            UPDATE "Assignments"
            SET writer_id = 0
            WHERE writer_id = $1
            RETURNING *;
        `;
        await client.query(updateAssignmentsQuery, [writer_id]);

        const deleteWriterQuery = `
        DELETE 
        FROM "Writers"
        WHERE writer_id = $1`;
        await client.query(deleteWriterQuery, [writer_id]);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Writer deleted!" }),
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