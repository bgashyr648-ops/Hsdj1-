const { cmd } = require("../command");

// Direct video links for .t command (Badmashi Type)
const badmashiVideos = [
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579538798_B9SJlFwdN.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579524775_OsJZ7YKsS.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579514843_DCYXSfMxy.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579505269_wpJ10Zki0.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579489798_CnPqfL7Mk.mp4"
];

// Direct video links for .x command (Dance links)
const danceVideos = [
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788580101346_CSwmugqJx.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788580361513_UNR1SGDYp.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788580368695_L-j-XZR5S.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788580375457_67fSEF8Q5.mp4"
];

// Direct video links for .v command (Custom links)
const customVideos = [
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579538798_B9SJlFwdN.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579524775_OsJZ7YKsS.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579514843_DCYXSfMxy.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579505269_wpJ10Zki0.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579489798_CnPqfL7Mk.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579479175_mM4ww7KO0.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579464218_75qSDHhB7.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579447001__GOtBMjyO.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788579433187_C9zQfk6oT.mp4"
];

// Helper function to send video safely
async function sendVideoCommand(conn, mek, m, from, reply, videoArray) {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        
        const videoUrl = videoArray[Math.floor(Math.random() * videoArray.length)];
        
        if (!videoUrl) {
            return await reply("❌ No video found in the list!");
        }

        // Try sending as video message
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `> Powered by TAGER-MD | Owner: Bagga Sher MD ✅`,
            mimetype: "video/mp4"
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (err) {
        console.error("Video send error:", err);
        // Fallback: If video streaming fails, send it as a clickable text link so it never crashes or throws unhandled error
        await conn.sendMessage(from, { 
            text: `⚠️ Direct video stream failed, but here is your link:\n\n${err.url || videoArray[0]}\n\n> Powered by TAGER-MD` 
        }, { quoted: mek });
    }
}

// .t command
cmd({
    pattern: "t",
    desc: "Send badmashi type video",
    category: "download",
    react: "😈",
    filename: __filename,
    use: ".t"
}, async (conn, mek, m, { from, reply }) => {
    await sendVideoCommand(conn, mek, m, from, reply, badmashiVideos);
});

// .x command
cmd({
    pattern: "x",
    desc: "Send girls dance video",
    category: "download",
    react: "💃",
    filename: __filename,
    use: ".x"
}, async (conn, mek, m, { from, reply }) => {
    await sendVideoCommand(conn, mek, m, from, reply, danceVideos);
});

// .v command
cmd({
    pattern: "v",
    desc: "Send custom video link",
    category: "download",
    react: "🎬",
    filename: __filename,
} , async (conn, mek, m, { from, reply }) => {
    await sendVideoCommand(conn, mek, m, from, reply, customVideos);
});
