const { cmd } = require('../command');

cmd({
    pattern: "school",
    alias: ["bagasher", "mdvideo", "sadvideo"],
    desc: "BAGGA SHER MD sad videos command",
    category: "owner",
    react: "🥺",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        console.log("🥺 BAGA sad command successfully triggered!");
        await reply("💔 BAGGA SHER MD sad video bhej raha hai...");

        const autoVideoLinks = [
            "https://files.catbox.moe/h3hg03.mp4",
        ];

        const videoUrl = autoVideoLinks[Math.floor(Math.random() * autoVideoLinks.length)];

        await conn.sendMessage(
            from,
            {
                video: { url: videoUrl },
                caption: `💔 *BAGGA SHER MD SAD VIBES*\n🥺 *POWERED BY TIGER MD*`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('BAGA ERROR:', error);
        return reply(`❌ Error aa gaya: ${error.message}`);
    }
});
