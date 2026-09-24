const axios = require('axios');

cmd({
    pattern: "love",
    alias: ["romance", "couple", "pyar", "hotlove"],
    desc: "Get full romantic anime images",
    category: "fun",
    react: "❤️‍🔥",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        let queries = ["couple", "kiss", "hug", "holding_hands", "cuddle", "love"];
        let randomQuery = queries[Math.floor(Math.random() * queries.length)];
        
        let query = q ? q : randomQuery;
        let apiUrl = `https://nekos.best/api/v2/search?query=${encodeURIComponent(query)}&type=1`;

        let response = await axios.get(apiUrl);
        let data = response.data;

        if (!data.results || data.results.length === 0) {
            return reply("Error: No image found, try again!");
        }

        let randomIndex = Math.floor(Math.random() * data.results.length);
        let imageUrl = data.results[randomIndex].url;
        let artistName = data.results[randomIndex].artist_name || "Unknown";

        let caption = `❤️‍🔥 *FULL ROMANTIC MOOD* ❤️‍🔥\n\n✨ *Pyar Mohabbat* ✨\n*Artist:* ${artistName}\n\n🤖 *Bot:* Tiger MD\n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { image: { url: imageUrl }, caption: caption }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("Error: " + e.message);
    }
});
