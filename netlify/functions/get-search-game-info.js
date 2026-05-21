const { Client } = require("pg");

exports.handler = async (event) => {
  try {

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    let query = `
      SELECT * FROM "Games"
      LEFT JOIN "Assignments" ON "Assignments".game_id = "Games".game_id
      LEFT JOIN "Writers" ON "Writers".writer_id = "Assignments".writer_id
      ORDER BY date DESC, time DESC;
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