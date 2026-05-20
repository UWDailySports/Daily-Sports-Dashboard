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

            let opponent = null;

            if (typeof Event === "string") {

                // remove sport prefix safely
                let cleaned = Event.startsWith(sport + " ")
                    ? Event.slice(sport.length).trim()
                    : Event;

                // match vs / at formats
                const match = cleaned.match(/^(vs|at)\s+(.+)/i);

                if (match) {
                    opponent = match[2].trim();
                } else {
                    // fallback: no vs/at → treat whole string as opponent/location
                    opponent = cleaned.trim();
                }
            }

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