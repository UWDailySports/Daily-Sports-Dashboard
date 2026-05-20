const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const rows = JSON.parse(event.body);

        for (const row of rows) {
            const {
                Event,
                'Start Date': date,
                'Start Time': time,
                Location: location,
                Category: sport
            } = row;

            if (!Event) continue;

            const cleaned = Event.replace(`${sport} `, "");

            const match = cleaned.match(/(vs|at)\s(.+)/i);
            const opponent = match ? match[2].trim() : null;

            await client.query(
                `INSERT INTO "Season" (sport, opponent, date, time, location, notes, available)
                 VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
                [sport, opponent, date, time, location, null]
            );
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (err) {
        console.error(err);

        return {
            statusCode: 500,
            body: JSON.stringify({ success: false })
        };

    } finally {
        await client.end();
    }
};