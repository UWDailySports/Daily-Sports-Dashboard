const { Client } = require("pg");

exports.handler = async (event) => {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    });

    await client.connect();

    // Base query
    const query = `SELECT * FROM "Schools"`;

    const result = await client.query(query);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ schools : result.rows }),
    };
  } catch (err) {
    console.error("Error fetching games:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};