const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

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
        
        let search = await yts(text);
        let vid = search.videos[0];
        if (!vid) return reply("Error: No results found.");

        let url = vid.url;
        let title = vid.title;
        let thumbnail = vid.thumbnail;

        await conn.sendMessage(from, { 
            image: { url: thumbnail }, 
            caption: `Title: ${title}\nStatus: Downloading...` 
        }, { quoted: mek });

        const apiUrl = `https://api.jawadtechxd.live/download/ytmp3?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        const audioUrl = response.data?.download?.url || response.data?.url;

        if (!audioUrl) return reply("Error: Download link not found.");

        await conn.sendMessage(from, { 
            audio: { url: audioUrl }, 
            mimetype: "audio/mpeg", 
            fileName: `${title}.mp3`, 
            ptt: false 
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("PLAY ERROR:", err);
        reply(`Error: ${err.message}`);
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
        
        let search = await yts(text);
        let vid = search.videos[0];
        if (!vid) return reply("Error: No results found.");

        let url = vid.url;
        let title = vid.title;
        let thumbnail = vid.thumbnail;

        await conn.sendMessage(from, { 
            image: { url: thumbnail }, 
            caption: `Title: ${title}\nStatus: Downloading...` 
        }, { quoted: mek });

        const apiUrl = `https://api.jawadtechxd.live/download/ytmp4?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        const videoUrl = response.data?.download?.url || response.data?.url;

        if (!videoUrl) return reply("Error: Download link not found.");

        await conn.sendMessage(from, { 
            video: { url: videoUrl }, 
            caption: `Title: ${title}` 
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("VIDEO ERROR:", e);
        reply(`Error: ${e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
