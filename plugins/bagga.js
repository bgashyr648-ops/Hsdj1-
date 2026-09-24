const { cmd } = require('../command');
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
        let queries = ["couple", "kiss", "hug", "waifu", "neko"];
        let randomQuery = queries[Math.floor(Math.random() * queries.length)];
        
        let apiUrl = `https://nekos.best/api/v2/search?query=${randomQuery}&type=1&amount=20`;
        let response = await axios.get(apiUrl);
        let data = response.data;

        if (!data || !data.results || data.results.length === 0) {
            return reply("Error: Image nahi mili!");
        }

        let randomIndex = Math.floor(Math.random() * data.results.length);
        let imageUrl = data.results[randomIndex].url;
        let artistName = data.results[randomIndex].artist_name || "Unknown";

        let caption = `❤️‍🔥 *FULL ROMANTIC MOOD* ❤️‍🔥\n\n✨ *Pyar Mohabbat* ✨\n*Artist:* ${artistName}\n\n🤖 *Bot:* TIGER MD`;

        return await conn.sendMessage(from, { image: { url: imageUrl }, caption: caption }, { quoted: mek });

    } catch (e) {
        console.error('Error in love command:', e);
        return reply(`❌ Error: ${e.message}`);
    }
});
