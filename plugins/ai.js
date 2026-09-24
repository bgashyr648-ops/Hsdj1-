const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "swag",
    alias: ["badboy", "mafia", "attitude", "dp"],
    desc: "Get real badass and stylish boy DPs",
    category: "owner",
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        await reply("🔥 *BAGGA SHER MD* - Asli badmaashi DP nikal rahi hai, thoda sabar kar! 🦁");

        // Yahan hum real Pinterest/Google style aesthetic boy DPs ki free API use kar rahe hain
        let apiUrl = `https://apis.davidcyriltech.my.id/pinterest?query=badboy%20attitude%20stylish%20boy%20dp`;
        
        let res = await axios.get(apiUrl);
        let images = res.data.result || res.data.data;

        if (!images || images.length === 0) {
            // Fallback agar pehli API busy ho toh direct high-quality real boy aesthetic link
            return await conn.sendMessage(from, { 
                image: { url: "https://i.pinimg.com/736x/87/14/8a/87148a25c156972412808e0639014165.jpg" }, 
                caption: `🔥 *TIGER MD - REAL BADBOY DP* 🔥\n\n👑 *Status:* Asli Swag DP Loaded!\n🤖 *Bot:* TIGER MD\n🦁 *Owner:* BAGGA SHER MD` 
            }, { quoted: mek });
        }

        // Random real DP uthayega list me se
        let randomImage = images[Math.floor(Math.random() * images.length)];

        let caption = `🔥 *TIGER MD - REAL BADBOY DP* 🔥\n\n👑 *Status:* Asli Swag & Attitude DP\n🤖 *Bot:* TIGER MD\n🦁 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { image: { url: randomImage }, caption: caption }, { quoted: mek });

    } catch (e) {
        // Fallback agar koi bhi error aaye toh seedha solid real DP bhejega
        let safeUrl = "https://i.pinimg.com/736x/b2/09/25/b20925916053805872851167448d88e0.jpg";
        return await conn.sendMessage(from, { image: { url: safeUrl }, caption: `🔥 *TIGER MD - BADMAASHI DP* 🔥\n👑 *Owner:* BAGGA SHER MD` }, { quoted: mek });
    }
});
