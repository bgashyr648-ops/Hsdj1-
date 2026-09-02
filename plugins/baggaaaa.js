const { cmd } = require("../command");

// .t command (Badmashi type content)
cmd({
    pattern: "t",
    desc: "Send badmashi type video",
    category: "download",
    react: "😈",
    filename: __filename,
    use: ".t"
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Direct video link for .t command (Badmashi)
        const videoUrl = "YOUR_BADMASHI_VIDEO_DIRECT_LINK_HERE";

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Video link is invalid!`);
        }

        // Main video with TAGGER-MD and MUHAMMAD FIDA MD
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by TAGGER-MD | Owner: MUHAMMAD FIDA MD ✅`
        }, { quoted: mek });

        // Independent separate message for Bagga Sher MD / Owner TikTok ID & updates
        await conn.sendMessage(from, {
            text: `🔥 Bot Owner: Bagga Sher MD\n\n📌 TikTok Official ID:\nhttps://tiktok.com/@sadboydj1\n\n✨ Bot ki new new updates aur mazedar videos ke liye TikTok par follow aur like lazmi karein! 🚀`
        });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .t:", e);
        await reply("❌ An error occurred!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// .x command (Girls dance content)
cmd({
    pattern: "x",
    desc: "Send girls dance video",
    category: "download",
    react: "💃",
    filename: __filename,
    use: ".x"
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Direct video link for .x command (Girls dance)
        const videoUrl = "YOUR_GIRLS_DANCE_DIRECT_LINK_HERE";

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Video link is invalid!`);
        }

        // Main video with TAGGER-MD and MUHAMMAD FIDA MD
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by TAGGER-MD | Owner: MUHAMMAD FIDA MD ✅`
        }, { quoted: mek });

        // Independent separate message for Bagga Sher MD / Owner TikTok ID & updates
        await conn.sendMessage(from, {
            text: `🔥 Bot Owner: Bagga Sher MD\n\n📌 TikTok Official ID:\nhttps://tiktok.com/@sadboydj1\n\n✨ Bot ki new new updates aur mazedar videos ke liye TikTok par follow aur like lazmi karein! 🚀`
        });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .x:", e);
        await reply("❌ An error occurred!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// .v command (General / Separate link content)
cmd({
    pattern: "v",
    desc: "Send custom video link",
    category: "download",
    react: "🎬",
    filename: __filename,
    use: ".v"
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Direct video link for .v command
        const videoUrl = "YOUR_V_COMMAND_DIRECT_LINK_HERE";

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Video link is invalid!`);
        }

        // Main video with TAGGER-MD and MUHAMMAD FIDA MD
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by TAGGER-MD | Owner: MUHAMMAD FIDA MD ✅`
        }, { quoted: mek });

        // Independent separate message for Bagga Sher MD / Owner TikTok ID & updates
        await conn.sendMessage(from, {
            text: `🔥 Bot Owner: Bagga Sher MD\n\n📌 TikTok Official ID:\nhttps://tiktok.com/@sadboydj1\n\n✨ Bot ki new new updates aur mazedar videos ke liye TikTok par follow aur like lazmi karein! 🚀`
        });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .v:", e);
        await reply("❌ An error occurred!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
