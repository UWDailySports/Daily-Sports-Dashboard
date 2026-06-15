import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function handler(event) {
    try {
        const query = event.queryStringParameters?.q || "";

        if (!query) {
            return {
                statusCode: 200,
                body: JSON.stringify({ schools: [] })
            };
        }

        const search = `%${query.toLowerCase()}%`;

        const result = await sql`
            SELECT school_id, school
            FROM "Schools"
            WHERE LOWER(school) LIKE ${search}
            ORDER BY school
            LIMIT 10
        `;

        return {
            statusCode: 200,
            body: JSON.stringify({ schools: result })
        };

    } catch (err) {
        console.error("search-schools error:", err);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Database error" })
        };
    }
}