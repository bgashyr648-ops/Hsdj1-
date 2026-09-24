const { cmd } = require('../command');
const axios = require('axios');

const apiKey = "h1QtWouuuycfwXiB8xR7ytupRufcd26u";

// 1. Dance GIF Command
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

// 2. Random GIF Command
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
