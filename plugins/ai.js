const { cmd } = require('../command');

cmd({
    pattern: "baga",
    alias: ["bagasher", "mdvideo"],
    desc: "BAGGA SHER MD Pinterest API video command",
    category: "owner",
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        await reply("🔥 BAGGA SHER MD searching Pinterest...");

        // Pinterest ki direct public API jo search karke video degi
        const searchTerm = q ? encodeURIComponent(q) : "status";
        const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/pinterest?text=${searchTerm}`);
        const json = await apiResponse.json();

        if (!json || !json.result || json.result.length === 0) {
            return reply("❌ Bhai, API se video nahi mili, dobara try kar.");
        }

        const videoList = json.result;
        const videoUrl = videoList[Math.floor(Math.random() * videoList.length)];

        if (!videoUrl) {
            return reply("❌ Video ka direct link nahi mila.");
        }

        // WhatsApp par video bhejne ke liye
        await conn.sendMessage(
            from,
            {
                video: { url: videoUrl },
                caption: `🎬 *BAGGA SHER MD PINTEREST*\n🔥 *POWERED BY TIGER MD*`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('BAGA API ERROR:', error);
        return reply(`❌ Error aa gaya: ${error.message}`);
    }
});
