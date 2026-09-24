const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "swag",
    alias: ["badboy", "mafia", "attitude"],
    desc: "Send stylish and badass boy aesthetic DPs",
    category: "owner",
    react: "😎",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        await reply("😎 *BAGGA SHER MD* - Badmaashi aur Swag wali DP nikal rahi hai... Ruko! 🔥");

        let randomSeed = Math.floor(Math.random() * 1000000);
        let prompt = encodeURIComponent("stylish handsome boy profile picture, badboy swag, royal attitude, dark moody aesthetic, turban look, high quality wallpaper");
        let apiUrl = `https://image.pollinations.ai/prompt/${prompt}?seed=${randomSeed}&width=1024&height=1024&nologo=true`;

        let caption = `🔥 *TIGER MD - SWAG & ATTITUDE DP* 🔥\n\n👑 *Category:* Stylish Boy / Badmaashi DP\n🤖 *Bot:* TIGER MD\n🦁 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { image: { url: apiUrl }, caption: caption }, { quoted: mek });

    } catch (e) {
        console.error('Error in swag command:', e);
        return reply(`❌ Error aa gaya bhai, dubara try kar!`);
    }
});
