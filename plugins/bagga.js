const { cmd } = require("../command");

// .t command
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

        const videoUrl = badmashiVideos[Math.floor(Math.random() * badmashiVideos.length)];

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Video link is invalid!`);
        }

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by TAGER-MD | Owner: Bagga Sher MD ✅`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .t:", e);
        await reply(`❌ Error: ${e.message || e}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
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
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const videoUrl = danceVideos[Math.floor(Math.random() * danceVideos.length)];

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Video link is invalid!`);
        }

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by TAGER-MD | Owner: Bagga Sher MD ✅`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .x:", e);
        await reply(`❌ Error: ${e.message || e}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// .v command
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

        const videoUrl = customVideos[Math.floor(Math.random() * customVideos.length)];

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Video link is invalid!`);
        }

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by TAGER-MD | Owner: Bagga Sher MD ✅`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .v:", e);
        await reply(`❌ Error: ${e.message || e}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

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
