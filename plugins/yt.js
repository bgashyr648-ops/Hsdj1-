//---------------------------------------------------------------------------
//           TIGER-MD - YOUTUBE DOWNLOADER (DEBUGGED & FIXED)
//---------------------------------------------------------------------------

const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const API_BASE = "https://xjawadtech.vercel.app";

// Helper to extract YouTube video ID
function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

// ============================================
// HELPER: Download Audio (Auto Fallback for yta1 to yta9)
// ============================================
async function downloadAudio(url) {
    const endpoints = ['yta1', 'yta2', 'yta3', 'yta4', 'yta5', 'yta6', 'yta8', 'yta9'];
    
    for (const ep of endpoints) {
        try {
            console.log(`🔍 Trying Audio API [${ep}] for URL:`, url);
            const apiUrl = `${API_BASE}/${ep}?url=${encodeURIComponent(url)}&key=baggayt`;
            const response = await axios.get(apiUrl, { timeout: 20000 });
            
            if (response.data && response.data.status && response.data.download && response.data.download.url) {
                console.log(`✅ Success with Audio API [${ep}]`);
                return response.data.download.url;
            }
        } catch (e) {
            console.log(`⚠️ Audio API [${ep}] failed:`, e.message);
        }
    }
    
    console.error("❌ All Audio APIs failed!");
    return null;
}

// ============================================
// HELPER: Download Video
// ============================================
async function downloadVideo(url) {
    try {
        console.log("🔍 Calling Video API for URL:", url);
        const apiUrl = `${API_BASE}/ytv3?url=${encodeURIComponent(url)}&key=baggayt`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        console.log("📥 Video API Response Status:", response.status);
        
        if (response.data && response.data.status && response.data.download && response.data.download.url) {
            return response.data.download.url;
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
