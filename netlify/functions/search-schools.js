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

    const result = await sql`
        SELECT school_id, school
        FROM "Schools"
        WHERE LOWER(school) LIKE ${'%' + query.toLowerCase() + '%'}
        ORDER BY school
        LIMIT 10
    `;

    return {
        statusCode: 200,
        body: JSON.stringify({ schools: result })
    };
}