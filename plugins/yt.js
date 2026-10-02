//---------------------------------------------------------------------------
//           TIGER-MD - YOUTUBE DOWNLOADER (UPDATED WITH YOUR API)
//---------------------------------------------------------------------------

const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const API_BASE = "https://server-alpha-pearl.vercel.app";

// Helper to extract YouTube video ID
function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

// ============================================
// HELPER: Download Audio
// ============================================
async function downloadAudio(url) {
    try {
        console.log("🔍 Calling Audio API for URL:", url);
        const apiUrl = `${API_BASE}/?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        console.log("📥 Audio API Response Status:", response.status);
        
        if (response.data && response.data.success && response.data.downloadUrl) {
            return response.data.downloadUrl;
        }
        console.log("⚠️ Audio API returned invalid data structure:", response.data);
        return null;
    } catch (e) {
        console.error("❌ Audio API Exception:", e.message);
        return null;
    }
}

// ============================================
// HELPER: Download Video
// ============================================
async function downloadVideo(url) {
    try {
        console.log("🔍 Calling Video API for URL:", url);
        const apiUrl = `${API_BASE}/?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        console.log("📥 Video API Response Status:", response.status);
        
        if (response.data && response.data.success && response.data.downloadUrl) {
            return response.data.downloadUrl;
        }
        console.log("⚠️ Video API returned invalid data structure:", response.data);
        return null;
    } catch (e) {
        console.error("❌ Video API Exception:", e.message);
        return null;
    }
}

// ============================================
// COMMAND: play (Audio Only)
// ============================================
cmd({
    pattern: "play",
    alias: ["song", "audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        console.log("🟢 .play command triggered with text:", text);
        if (!text) return reply("❌ Please provide song name\nExample: .play Shape of You");

        let url = text;
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }
            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");
            vid = await yts({ videoId: videoId });
        } else {
            const search = await yts(text);
            if (!search || !search.videos || !search.videos.length) {
                return reply("❌ No song found!");
            }
            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `- *AUDIO DOWNLOADER 🎧*\n╭━━❐━⪼\n┇๏ *Title* - ${vid.title}\n┇๏ *Duration* - ${vid.timestamp}\n┇๏ *Status* - Downloading...\n╰━━❑━⪼\n> Powered by TIGER-MD`
        }, { quoted: mek });

        const audioUrl = await downloadAudio(url);

        if (!audioUrl) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ API Download failed! Link not found.");
        }

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${vid.title}.mp3`,
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("❌ CRITICAL PLAY ERROR:", err);
        reply(`❌ Error occurred: ${err.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// ============================================
// COMMAND: video (Video Download)
// ============================================
cmd({
    pattern: "video",
    alias: ["ytv", "ytmp4", "vd"],
    desc: "Download YouTube video",
    category: "download",
    react: "📹",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        console.log("🟢 .video command triggered with text:", text);
        if (!text) return reply("🎥 Please provide a video name or link!\n\nExample: `.video Alone Marshmello`");

        let url = text;
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }
            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");
            vid = await yts({ videoId: videoId });
        } else {
            const search = await yts(text);
            if (!search || !search.videos || !search.videos.length) {
                return reply("❌ No video results found!");
            }
            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*🎬 VIDEO DOWNLOADER*\n\n🎞 *Title:* ${vid.title}\n🕒 *Duration:* ${vid.timestamp}\n\n*Status:* Downloading Video...\n\n> Powered by TIGER-MD`
        }, { quoted: mek });

        const videoUrl = await downloadVideo(url);

        if (!videoUrl) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ API Download failed! Link not found.");
        }

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `🎬 *${vid.title}*\n\n> Powered by TIGER-MD`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("❌ CRITICAL VIDEO ERROR:", e);
        reply(`❌ Error occurred: ${e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// ============================================
// COMMAND: yts (Search)
// ============================================
cmd({
    pattern: "yts",
    alias: ["ytsearch", "searchyt"],
    use: '.yts jawad',
    react: "🔎",
    desc: "Search YouTube and get video details",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, text, reply }) => {
    try {
        console.log("🟢 .yts command triggered with text:", text);
        if (!text) return reply('*Please provide search words!*\n\nExample: .yts Alan Walker Faded');

        const search = await yts(text);

        if (!search || !search.videos || !search.videos.length) {
            return reply('*No results found!*');
        }

        const results = search.videos.slice(0, 5);

        let mesaj = `*╭┈───〔 YouTube Search 〕┈───⊷*\n`;
        mesaj += `*├▢ 🔎 Query:* ${text}\n`;
        mesaj += `*╰───────────────────⊷*\n\n`;

        results.forEach((video, i) => {
            mesaj += `*${i + 1}.${video.title}*\n`;
            mesaj += `*├▢ 🔗 URL:* ${video.url}\n`;
            mesaj += `*├▢ ⏱️ Duration:* ${video.timestamp}\n`;
            mesaj += `*╰───────────────────⊷*\n\n`;
        });

        mesaj += `> Powered by TIGER-MD`;

        await conn.sendMessage(from, { text: mesaj.trim() }, { quoted: mek });

    } catch (e) {
        console.error('❌ CRITICAL YTS ERROR:', e);
        reply(`*Error occurred while searching!*\n\`\`\`${e.message}\`\`\``);
    }
});
