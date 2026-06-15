const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const { selectedSchool } = JSON.parse(event.body);

        if (!selectedSchool) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing school" })
            };
        }

        // if frontend sends object OR string, handle both
        const schoolName =
            typeof selectedSchool === "string"
                ? selectedSchool
                : selectedSchool.school;

        // 1. get school_id
        const getIdQuery = `
            SELECT school_id
            FROM "Schools"
            WHERE school = $1
            LIMIT 1;
        `;

        const idResult = await client.query(getIdQuery, [schoolName]);

        if (!idResult.rows.length) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "School not found" })
            };
        }

        const schoolId = idResult.rows[0].school_id;

        // 2. update user table
        const updateQuery = `
            UPDATE "User_School"
            SET school_id = $1
            WHERE row = 1
            RETURNING *;
        `;

        const updateResult = await client.query(updateQuery, [schoolId]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                data: updateResult.rows[0]
            })
        };

    } catch (err) {
        console.error("update-user-school error:", err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: "Server error"
            })
        };
    } finally {
        await client.end();
    }
};