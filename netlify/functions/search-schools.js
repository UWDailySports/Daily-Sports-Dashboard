import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

export async function handler(event) {
    const query = event.queryStringParameters?.q || "";

    if (!query) {
        return {
            statusCode: 200,
            body: JSON.stringify({ schools: [] })
        };
    }

    try {
        const search = `%${query.toLowerCase()}%`;

        const result = await client.query(
            `
            SELECT school_id, school
            FROM "Schools"
            WHERE LOWER(school) LIKE $1
            ORDER BY school
            LIMIT 10
            `,
            [search]
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ schools: result.rows })
        };

    } catch (err) {
        console.error("search-schools error:", err);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Database error" })
        };
    }
}