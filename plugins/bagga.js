const { cmd } = require('../command');
const axios = require('axios');

const apiKey = "h1QtWouuuycfwXiB8xR7ytupRufcd26u";

// 1. Love Command (Aapki original working command)
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

        let caption = `❤️‍🔥 *FULL ROMANTIC MOOD* ❤️‍🔥\n\n✨ *Pyar Mohabbat* ✨\n*Artist:* ${artistName}\n\n🤖 *Bot:* TIGER MD\n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { image: { url: imageUrl }, caption: caption }, { quoted: mek });

    } catch (e) {
        console.error('Error in love command:', e);
        return reply(`❌ Error: ${e.message}`);
    }
});

// 2. Dance GIF Command
cmd({
    pattern: "dance",
    alias: ["dancegif"],
    desc: "Get random dance GIFs",
    category: "fun",
    react: "💃",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        let apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=dance&limit=50`;
        let response = await axios.get(apiUrl);
        let data = response.data;

        if (!data || !data.data || data.data.length === 0) {
            return reply("❌ Error: GIF nahi mili!");
        }

        let randomIndex = Math.floor(Math.random() * data.data.length);
        let gifUrl = data.data[randomIndex].images.original.url;

        let caption = `💃 *DANCE GIF* 💃\n\n🤖 *Bot:* TIGER MD\n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { video: { url: gifUrl }, gifPlayback: true, caption: caption }, { quoted: mek });

    } catch (e) {
        console.error('Error in dance command:', e);
        return reply(`❌ Error: ${e.message}`);
    }
});

// 3. Random GIF Command
cmd({
    pattern: "gif",
    alias: ["giphy", "randomgif"],
    desc: "Get random trending GIFs",
    category: "fun",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        let apiUrl = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=50`;
        let response = await axios.get(apiUrl);
        let data = response.data;

        if (!data || !data.data || data.data.length === 0) {
            return reply("❌ Error: GIF nahi mili!");
        }

        let randomIndex = Math.floor(Math.random() * data.data.length);
        let gifUrl = data.data[randomIndex].images.original.url;

        let caption = `🎬 *RANDOM GIPHY* 🎬\n\n🤖 *Bot:* TIGER MD\n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { video: { url: gifUrl }, gifPlayback: true, caption: caption }, { quoted: mek });

    } catch (e) {
        console.error('Error in gif command:', e);
        return reply(`❌ Error: ${e.message}`);
    }
});
