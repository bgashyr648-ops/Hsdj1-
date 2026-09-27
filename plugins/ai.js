const { cmd } = require('../command');

cmd({
    pattern: "baga",
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
            "https://files.catbox.moe/mh3gpw.mp4",
            "https://files.catbox.moe/gc4zr4.mp4",
            "https://files.catbox.moe/1nkppm.mp4",
            "https://files.catbox.moe/e0xano.mp4",
            "https://files.catbox.moe/omqibi.mp4",
            "https://files.catbox.moe/xi2l1z.mp4",
            "https://files.catbox.moe/ibngya.mp4",
            "https://files.catbox.moe/9buer6.mp4",
            "https://files.catbox.moe/cj3zg4.mp4",
            "https://files.catbox.moe/n27yto.mp4",
            "https://files.catbox.moe/xmqhkb.mp4",
            "https://files.catbox.moe/gjx33m.mp4",
            "https://files.catbox.moe/s86keo.mp4",
            "https://files.catbox.moe/gyyp98.mp4",
            "https://files.catbox.moe/5bggsh.mp4",
            "https://files.catbox.moe/9crp6t.mp4",
            "https://files.catbox.moe/yno4hj.mp4",
            "https://files.catbox.moe/j0968m.mp4",
            "https://files.catbox.moe/svxeyt.mp4",
            "https://files.catbox.moe/b6r8em.mp4",
            "https://files.catbox.moe/jaldod.mp4",
            "https://files.catbox.moe/7aiit9.mp4",
            "https://files.catbox.moe/vv2of4.mp4",
            "https://files.catbox.moe/f2zqfn.mp4",
            "https://files.catbox.moe/yz3917.mp4",
            "https://files.catbox.moe/ej9nk4.mp4",
            "https://files.catbox.moe/8q4agd.mp4",
            "https://files.catbox.moe/0pgigf.mp4",
            "https://files.catbox.moe/dj9op2.mp4",
            "https://files.catbox.moe/pxn1ej.mp4",
            "https://files.catbox.moe/5epgs1.mp4",
            "https://files.catbox.moe/00rhkm.mp4",
            "https://files.catbox.moe/ry4p60.mp4"
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
