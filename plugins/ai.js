const { cmd } = require('../command');

cmd({
    pattern: "baga",
    alias: ["bagasher", "mdvideo"],
    desc: "BAGGA SHER MD special video command (No API Key Required)",
    category: "owner",
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const queries = [
            'sad status',
            'attitude status',
            'tiktok dance',
            'aesthetic video',
            'trending reels'
        ];

        const query = q?.trim() || queries[Math.floor(Math.random() * queries.length)];

        await reply(`🔥 BAGGA SHER MD is fetching video for "${query}"...`);

        // Public video API jo bina kisi key ke direct chalegi
        const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/pinterest?text=${encodeURIComponent(query)}`);
        const resData = await apiResponse.json();

        if (!resData || !resData.result || resData.result.length === 0) {
            return reply(`❌ Bhai, "${query}" ki video nahi mili.`);
        }

        // Random video/image link uthana
        const mediaList = resData.result;
        const randomMedia = mediaList[Math.floor(Math.random() * mediaList.length)];

        if (!randomMedia) {
            return reply('❌ Media link nahi mila.');
        }

        // WhatsApp par video bhejna
        await conn.sendMessage(
            from,
            {
                video: { url: randomMedia },
                caption: `🎬 *BAGGA SHER MD SPECIAL*\n\nQuery: ${query}\n🔥 *POWERED BY TIGER MD*`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('BAGA COMMAND ERROR:', error);
        return reply(`❌ Error aa gaya: ${error.message}`);
    }
});
