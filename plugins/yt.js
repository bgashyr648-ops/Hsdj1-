//---------------------------------------------------------------------------
//           TIGER-MD - YOUTUBE DOWNLOADER (UPDATED API)
//---------------------------------------------------------------------------
//  🚀 DOWNLOAD VIDEOS AND AUDIO USING JAWADTECH APIs
//  📌 Video API: /ytv3   |   Audio API: /yta9
//---------------------------------------------------------------------------

const { cmd } = require('../command');
const axios = require('axios');
const API_BASE = "https://xjawadtech.vercel.app";

// Small caps font helper
const toSmallCaps = (text) => {
    const map = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
        'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ',
        'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.split('').map(c => map[c.toLowerCase()] || c).join('');
};

// Helper to extract YouTube video ID
function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

// ============================================
// HELPER: Download Audio (uses /yta9)
// ============================================
async function downloadAudio(url) {
    try {
        const apiUrl = `${API_BASE}/yta9?url=${encodeURIComponent(url)}&key=baggayt`;
        const response = await axios.get(apiUrl, { timeout: 20000 });
        
        if (response.data?.status && response.data?.download?.url) {
            return response.data.download.url;
        }
        return null;
    } catch (e) {
        console.error("❌ Audio API Error:", e.message);
        return null;
    }
}

// ============================================
// HELPER: Download Video (uses /ytv3)
// ============================================
async function downloadVideo(url) {
    try {
        const apiUrl = `${API_BASE}/ytv3?url=${encodeURIComponent(url)}&key=baggayt`;
        const response = await axios.get(apiUrl, { timeout: 20000 });
        
        if (response.data?.status && response.data?.download?.url) {
            return response.data.download.url;
        }
        return null;
    } catch (e) {
        console.error("❌ Video API Error:", e.message);
        return null;
    }
}

// ============================================
// COMMAND: play (Audio Only)
// ============================================
cmd({
    pattern: "play",
    alias: ["song", "music", "audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("❌ Please provide song name\nExample: .play Shape of You");

        const yts = require('yt-search');
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
            if (!search.videos || !search.videos.length) {
                return reply("❌ No song found!");
            }
            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `- *AUDIO DOWNLOADER 🎧*\n╭━━❐━⪼\n┇๏ *Title* - ${vid.title}\n┇๏ *Duration* - ${vid.timestamp}\n┇๏ *Views* - ${vid.views?.toLocaleString() || 'N/A'}\n┇๏ *Author* - ${vid.author?.name || 'Unknown'}\n┇๏ *Status* - Downloading...\n╰━━❑━⪼\n> Powered by TIGER-MD`
        }, { quoted: mek });

        const audioUrl = await downloadAudio(url);

        if (!audioUrl) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Download failed! Try again later.");
        }

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${vid.title}.mp3`,
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("❌ PLAY ERROR:", err);
        reply("❌ Error occurred! Please try again later.");
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
        if (!text) return reply("🎥 Please provide a video name or link!\n\nExample: `.video Alone Marshmello`");

        const yts = require('yt-search');
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
            if (!search.videos || !search.videos.length) {
                return reply("❌ No video results found!");
            }
            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*🎬 VIDEO DOWNLOADER*\n\n🎞️ *Title:* ${vid.title}\n📺 *Channel:* ${vid.author?.name || 'Unknown'}\n🕒 *Duration:* ${vid.timestamp}\n\n*Status:* Downloading Video...\n\n> Powered by TIGER-MD`
        }, { quoted: mek });

        const videoUrl = await downloadVideo(url);

        if (!videoUrl) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Download failed! Try again later.");
        }

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `🎬 *${vid.title}*\n\n> Powered by TIGER-MD`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .video command:", e);
        reply("❌ Error occurred, please try again later!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// ============================================
// COMMAND: drama (Same style as video)
// ============================================
cmd({
    pattern: "drama",
    alias: ["kdrama", "shortdrama"],
    desc: "Download drama/short video from YouTube",
    category: "download",
    react: "🎭",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("🎭 Please provide a drama name or link!\n\nExample: `.drama My Drama`");

        const yts = require('yt-search');
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
            if (!search.videos || !search.videos.length) {
                return reply("❌ No drama results found!");
            }
            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*🎭 DRAMA DOWNLOADER*\n\n🎞️ *Title:* ${vid.title}\n📺 *Channel:* ${vid.author?.name || 'Unknown'}\n🕒 *Duration:* ${vid.timestamp}\n\n*Status:* Downloading...\n\n> Powered by TIGER-MD`
        }, { quoted: mek });

        const videoUrl = await downloadVideo(url);

        if (!videoUrl) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Download failed! Try again later.");
        }

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `🎭 *${vid.title}*\n\n> Powered by TAGER-MD`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .drama command:", e);
        reply("❌ Error occurred, please try again later!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// ============================================
// COMMAND: song (Interactive - Choose Audio/Video)
// ============================================
cmd({
    pattern: "song",
    alias: ["yt", "music", "ytdl"],
    desc: "Download YouTube song or video (interactive)",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("🎶 Please provide a YouTube video name or link.\n\nExample: `.song Alone - Alan Walker`");

        const yts = require('yt-search');
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
            if (!search.videos || !search.videos.length) {
                return reply("❌ No results found!");
            }
            vid = search.videos[0];
        }

        if (!vid) return reply("❌ No results found!");

        const caption = `*╭┈───〔 ${toSmallCaps('YT Downloader')} 〕┈───⊷*
*├▢ 🎬 Title:* ${vid.title}
*├▢ 📺 Channel:* ${vid.author?.name || 'Unknown'}
*├▢ ⏰ Duration:* ${vid.timestamp}
*├▢ 👀 Views:* ${vid.views?.toLocaleString() || 'N/A'}
*╰───────────────────⊷*
*╭───⬡ ${toSmallCaps('Select Format')} ⬡───*
*┋ ⬡ 1* 🎧 ${toSmallCaps('Audio (MP3)')}
*┋ ⬡ 2* 📹 ${toSmallCaps('Video (MP4)')}
*╰───────────────────⊷*

> Powered by TIGER-MD`;

        const sent = await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek });

        const msgId = sent.key.id;

        const songListener = async (msgData) => {
            const received = msgData.messages[0];
            if (!received.message) return;

            const selected = received.message.conversation || received.message.extendedTextMessage?.text;
            const replyToBot = received.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;

            if (replyToBot) {
                conn.ev.off("messages.upsert", songListener);
                await conn.sendMessage(from, { react: { text: '⬇️', key: received.key } });

                if (selected === "1" || selected === "2") {
                    const type = selected === "1" ? "mp3" : "mp4";

                    if (type === "mp3") {
                        const audioUrl = await downloadAudio(vid.url);
                        if (!audioUrl) {
                            return await conn.sendMessage(from, {
                                text: "❌ Audio download failed! Try again later."
                            }, { quoted: received });
                        }
                        await conn.sendMessage(from, {
                            audio: { url: audioUrl },
                            mimetype: "audio/mpeg",
                            fileName: `${vid.title}.mp3`,
                            ptt: false
                        }, { quoted: received });
                    } else {
                        const videoUrl = await downloadVideo(vid.url);
                        if (!videoUrl) {
                            return await conn.sendMessage(from, {
                                text: "❌ Video download failed! Try again later."
                            }, { quoted: received });
                        }
                        await conn.sendMessage(from, {
                            video: { url: videoUrl },
                            caption: `🎬 *${vid.title}*\n\n> Powered by TIGER-MD`
                        }, { quoted: received });
                    }

                    await conn.sendMessage(from, { react: { text: '✅', key: received.key } });
                } else {
                    await conn.sendMessage(from, {
                        text: `❌ *Invalid selection!*\nPlease reply with:\n1️⃣ for Audio (MP3)\n2️⃣ for Video (MP4)`
                    }, { quoted: received });
                }
            }
        };

        conn.ev.on("messages.upsert", songListener);

        setTimeout(() => {
            conn.ev.off("messages.upsert", songListener);
        }, 20000);

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
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
        if (!text) return reply('*Please provide search words!*\n\nExample: .yts Alan Walker Faded');

        const yts = require('yt-search');
        const search = await yts(text);

        if (!search.videos || !search.videos.length) {
            return reply('*No results found!*');
        }

        const results = search.videos.slice(0, 10);

        let mesaj = `*╭┈───〔 ${toSmallCaps('YouTube Search')} 〕┈───⊷*\n`;
        mesaj += `*├▢ 🔎 Query:* ${text}\n`;
        mesaj += `*├▢ 📊 Results:* ${search.videos.length}\n`;
        mesaj += `*╰───────────────────⊷*\n\n`;

        results.forEach((video, i) => {
            mesaj += `*${i + 1}. ${video.title}*\n`;
            mesaj += `*├▢ 🔗 URL:* ${video.url}\n`;
            mesaj += `*├▢ ⏱️ Duration:* ${video.timestamp}\n`;
            mesaj += `*├▢ 👀 Views:* ${video.views?.toLocaleString() || 'N/A'}\n`;
            mesaj += `*├▢ 👤 Channel:* ${video.author?.name || 'Unknown'}\n`;
            mesaj += `*╰───────────────────⊷*\n\n`;
        });

        mesaj += `*╭───⬡ ${toSmallCaps('Powered By')} ⬡───*\n`;
        mesaj += `*┋ ⬡ ${toSmallCaps('TIGER-MD)}*\n`;
        mesaj += `*╰───────────────────⊷*`;

        await conn.sendMessage(from, { text: mesaj.trim() }, { quoted: mek });

    } catch (e) {
        console.error('Error in yts command:', e);
        reply(`*Error occurred while searching!*\n\`\`\`${e.message}\`\`\``);
    }
});
