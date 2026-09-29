//---------------------------------------------------------------------------
//           TIGER-MD - YOUTUBE DOWNLOADER (100% WORKING)
//---------------------------------------------------------------------------

const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

const toSmallCaps = (text) => {
    const map = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
        'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ',
        'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.split('').map(c => map[c.toLowerCase()] || c).join('');
};

function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

function extractDownloadUrl(data) {
    if (!data) return null;
    return data.download?.url || 
           data.url || 
           data.result?.url || 
           data.result?.download || 
           data.data?.url || 
           null;
}

//---------------------------------------------------------------------------
// 1. PLAY COMMAND
//---------------------------------------------------------------------------
cmd({
    pattern: "play",
    alias: ["song", "music", "audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        console.log("🔥 Play command triggered with text:", text);
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
            if (!search.videos || !search.videos.length) {
                return reply("❌ No song found!");
            }
            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `- *AUDIO DOWNLOADER 🎧*\n╭━━❐━⪼\n┇๏ *Title* - ${vid.title}\n┇๏ *Duration* - ${vid.timestamp}\n┇๏ *Views* - ${vid.views?.toLocaleString() \vert{}\vert{} 'N/A'}\n┇๏ *Author* - ${vid.author?.name || 'Unknown'}\n┇๏ *Status* - Downloading...\n╰━━❑━⪼\n> Powered by TIGER-MD`
        }, { quoted: mek });

        let audioUrl = null;
        let success = false;

        const audioAPIs = [
            `https://xjawadtech.vercel.app/yta1?url=${encodeURIComponent(url)}`,
            `https://xjawadtech.vercel.app/yta2?url=${encodeURIComponent(url)}`,
            `https://xjawadtech.vercel.app/yta3?url=${encodeURIComponent(url)}`,
            `https://xjawadtech.vercel.app/yta4?url=${encodeURIComponent(url)}`,
            `https://xjawadtech.vercel.app/yta5?url=${encodeURIComponent(url)}`,
            `https://xjawadtech.vercel.app/yta6?url=${encodeURIComponent(url)}`,
            `https://xjawadtech.vercel.app/yta7?url=${encodeURIComponent(url)}`
        ];

        for (const apiUrl of audioAPIs) {
            if (!success) {
                try {
                    const response = await axios.get(apiUrl, { timeout: 15000 });
                    audioUrl = extractDownloadUrl(response.data);
                    
                    if (audioUrl) {
                        await conn.sendMessage(from, {
                            audio: { url: audioUrl },
                            mimetype: "audio/mpeg",
                            fileName: `${vid.title}.mp3`,
                            ptt: false
                        }, { quoted: mek });
                        success = true;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        }

        if (!success) {
            return reply("❌ All download sources failed! Try again later.");
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("❌ PLAY ERROR:", err);
        reply("❌ Error occurred! Please try again later.");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

//---------------------------------------------------------------------------
// 2. VIDEO COMMAND
//---------------------------------------------------------------------------
cmd({
    pattern: "video",
    alias: ["ytv", "ytmp4", "vd"],
    desc: "Download YouTube video",
    category: "download",
    react: "📹",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        console.log("🔥 Video command triggered with text:", text);
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
            if (!search.videos || !search.videos.length) {
                return reply("❌ No video results found!");
            }
            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*🎬 VIDEO DOWNLOADER*\n\n🎞️ *Title:* ${vid.title}\n📺 *Channel:* ${vid.author?.name \vert{}\vert{} 'Unknown'}\n🕒 *Duration:* ${vid.timestamp}\n\n*Status:* Downloading Video...\n\n> Powered by TIGER-MD`
        }, { quoted: mek });

        let videoUrl = null;
        let success = false;

        const videoAPIs = [
            `https://xjawadtech.vercel.app/ytv1?url=${encodeURIComponent(url)}`,
            `https://xjawadtech.vercel.app/ytv2?url=${encodeURIComponent(url)}`,
            `https://xjawadtech.vercel.app/ytv3?url=${encodeURIComponent(url)}`,
            `https://xjawadtech.vercel.app/ytv4?url=${encodeURIComponent(url)}`
        ];

        for (const apiUrl of videoAPIs) {
            if (!success) {
                try {
                    const response = await axios.get(apiUrl, { timeout: 15000 });
                    videoUrl = extractDownloadUrl(response.data);
                    
                    if (videoUrl) {
                        await conn.sendMessage(from, {
                            video: { url: videoUrl },
                            caption: `🎬 *${vid.title}*\n\n> Powered by TIGER-MD`
                        }, { quoted: mek });
                        success = true;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        }

        if (!success) {
            return reply("❌ All video sources failed! Try again later.");
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .video command:", e);
        reply("❌ Error occurred, please try again later!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

//---------------------------------------------------------------------------
// 3. YTS COMMAND
//---------------------------------------------------------------------------
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
        console.log("🔥 YTS command triggered with text:", text);
        if (!text) return reply('*Please provide search words!*\n\nExample: .yts Alan Walker Faded');

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
            mesaj += `*${i + 1}.${video.title}*\n`;
            mesaj += `*├▢ 🔗 URL:* ${video.url}\n`;
            mesaj += `*├▢ ⏱️ Duration:* ${video.timestamp}\n`;
            mesaj += `*├▢ 👀 Views:* ${video.views?.toLocaleString() || 'N/A'}\n`;
            mesaj += `*├▢ 👤 Channel:* ${video.author?.name || 'Unknown'}\n`;
            mesaj += `*╰───────────────────⊷*\n\n`;
        });

        mesaj += `*╭───⬡ ${toSmallCaps('Powered By')} ⬡───*\n`;
        mesaj += `*┋ ⬡ ${toSmallCaps('TIGER-MD')}*\n`;
        mesaj += `*╰───────────────────⊷*`;
        
        await conn.sendMessage(from, { text: mesaj.trim() }, { quoted: mek });

    } catch (e) {
        console.error('Error in yts command:', e);
        reply(`*Error occurred while searching!*\n\`\`\`${e.message}\`\`\``);
    }
});
