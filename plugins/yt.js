const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

cmd({
    pattern: "play",
    alias: ["song", "audio"],
    desc: "Download audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("Error: Provide a query or URL.");
        let url = text;
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            const videoId = getVideoId(text);
            if (!videoId) return reply("Error: Invalid URL.");
            vid = await yts({ videoId: videoId });
            url = vid.url;
        } else {
            const search = await yts(text);
            if (!search.videos || !search.videos.length) {
                return reply("Error: No results found.");
            } else {
                vid = search.videos[0];
                url = vid.url;
            }
        }

        const title = vid ? vid.title : text;
        const thumbnail = vid ? vid.thumbnail : 'https://i.imgur.com/J82U2Fv.jpg';

        await conn.sendMessage(from, { 
            image: { url: thumbnail }, 
            caption: `Title: ${title}\nStatus: Downloading...` 
        }, { quoted: mek });

        const apiUrl = `https://xjawadtech.vercel.app/yta1?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl, { 
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://xjawadtech.vercel.app/',
                'Origin': 'https://xjawadtech.vercel.app',
                'Accept': 'application/json, text/plain, */*'
            }, 
            timeout: 25000 
        });

        const audioUrl = response.data?.download?.url || response.data?.url || response.data?.result || response.data?.dl;

        if (!audioUrl) return reply("Error: Download link not found in API response.");

        await conn.sendMessage(from, { 
            audio: { url: audioUrl }, 
            mimetype: "audio/mpeg", 
            fileName: `${title}.mp3`, 
            ptt: false 
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("PLAY ERROR:", err);
        reply(`Error: ${err.response?.status || err.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

cmd({
    pattern: "video",
    alias: ["movie", "drama", "ytv"],
    desc: "Download video",
    category: "download",
    react: "📹",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("Error: Provide a query or URL.");
        let url = text;
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            const videoId = getVideoId(text);
            if (!videoId) return reply("Error: Invalid URL.");
            vid = await yts({ videoId: videoId });
            url = vid.url;
        } else {
            const search = await yts(text);
            if (!search.videos || !search.videos.length) {
                return reply("Error: No results found.");
            } else {
                vid = search.videos[0];
                url = vid.url;
            }
        }

        const title = vid ? vid.title : text;
        const thumbnail = vid ? vid.thumbnail : 'https://i.imgur.com/J82U2Fv.jpg';

        await conn.sendMessage(from, { 
            image: { url: thumbnail }, 
            caption: `Title: ${title}\nStatus: Downloading...` 
        }, { quoted: mek });

        const apiUrl = `https://xjawadtech.vercel.app/ytv1?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl, { 
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://xjawadtech.vercel.app/',
                'Origin': 'https://xjawadtech.vercel.app',
                'Accept': 'application/json, text/plain, */*'
            }, 
            timeout: 25000 
        });

        const videoUrl = response.data?.download?.url || response.data?.url || response.data?.result || response.data?.dl;

        if (!videoUrl) return reply("Error: Download link not found in API response.");

        await conn.sendMessage(from, { 
            video: { url: videoUrl }, 
            caption: `Title: ${title}` 
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("VIDEO ERROR:", e);
        reply(`Error: ${e.response?.status || e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
