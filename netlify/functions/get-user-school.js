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
    let query = `SELECT * FROM "User_School" JOIN "Schools" ON "Schools.school_id = User_School.school_id`;

    const userSchoolInfo = await client.query(query);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ userSchoolInfo }),
    };
  } catch (err) {
    console.error("Error fetching games:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};