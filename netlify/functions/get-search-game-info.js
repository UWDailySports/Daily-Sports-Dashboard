const { Client } = require("pg");

exports.handler = async (event) => {
  try {

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    let query = `SELECT
    "Games".game_id AS game_id,
    "Games".date,
    "Games".time,
    "Games".sport,
    "Games".opponent,
    "Games".location,
    "Games".notes,
    "Games".available,

    "Assignments".assignment_id,

    "Writers".writer_id,
    "Writers".first_name,
    "Writers".last_name

    FROM "Games"
    LEFT JOIN "Assignments"
        ON "Assignments".game_id = "Games".game_id
    LEFT JOIN "Writers"
        ON "Writers".writer_id = "Assignments".writer_id
    ORDER BY "Games".date DESC, "Games".time DESC;;
        `;


    console.log("Final query:", query);
    console.log("Values:");

    const result = await client.query(query);
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ games: result.rows }),
    };
  } catch (err) {
    console.error("Error fetching all games:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};