const axios = require('axios');

cmd({
    pattern: "love",
    alias: ["romance", "couple", "pyar"],
    desc: "Get romantic images",
    category: "fun",
    react: "❤️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        // Hum yahan ek doosri reliable API use kar rahe hain
        let response = await axios.get(`https://nekos.moe/api/v1/random?image=true&nsfw=false`);
        let resData = response.data;

        if (!resData.images || resData.images.length === 0) {
            return reply("Error: Image nahi mili!");
        }

        let imageUrl = `https://nekos.moe/image/${resData.images[0].id}`;

        let caption = `❤️ *ROMANTIC MOOD* ❤️\n\n✨ *Pyar Mohabbat* ✨\n\n🤖 *Bot:* Tiger MD\n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { image: { url: imageUrl }, caption: caption }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("Error: " + e.message);
    }
});
