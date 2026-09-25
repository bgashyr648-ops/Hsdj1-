const { cmd } = require('../command');

cmd({
    pattern: "baga",
    alias: ["bagasher", "mdvideo"],
    desc: "BAGGA SHER MD working video command",
    category: "owner",
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        await reply("🔥 BAGGA SHER MD video bhej raha hai, sabar kar...");

        // Ekdam reliable public video/status source endpoint
        const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/pinterest?text=whatsapp%20status%20video`);
        const json = await apiResponse.json();

        let videoUrl = "";
        if (json && json.result && json.result.length > 0) {
            const list = json.result;
            videoUrl = list[Math.floor(Math.random() * list.length)];
        }

        // Agar upar wala endpoint na chale toh backup direct MP4 link array use hoga taaki kabhi error na aaye
        if (!videoUrl) {
            const backupVideos = [
                "https://i.imgur.com/3U0Z7x5.mp4",
                "https://i.imgur.com/VQ3fW9m.mp4"
            ];
            videoUrl = backupVideos[Math.floor(Math.random() * backupVideos.length)];
        }

        // WhatsApp par direct video file (MP4) bhejne ke liye
        await conn.sendMessage(
            from,
            {
                video: { url: videoUrl },
                caption: `🎬 *BAGGA SHER MD SPECIAL*\n🔥 *POWERED BY TIGER MD*`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('BAGA ERROR:', error);
        return reply(`❌ Error aa gaya: ${error.message}`);
    }
});
