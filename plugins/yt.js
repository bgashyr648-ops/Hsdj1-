const { cmd } = require('../command');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

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
        if (!search.videos || search.videos.length === 0) {
            return reply("Error: No results found.");
        }
        
        let vid = search.videos[0];
        let url = vid.url;
        let title = vid.title;
        let thumbnail = vid.thumbnail;

        await conn.sendMessage(from, { 
            image: { url: thumbnail }, 
            caption: `Title: ${title}\nStatus: Downloading...` 
        }, { quoted: mek });

        const audioPath = path.join(__dirname, `${Date.now()}.mp3`);
        let stream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });
        
        stream.pipe(fs.createWriteStream(audioPath));

        stream.on('end', async () => {
            await conn.sendMessage(from, { 
                audio: { url: audioPath }, 
                mimetype: "audio/mpeg", 
                fileName: `${title}.mp3`, 
                ptt: false 
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
            try { fs.unlinkSync(audioPath); } catch (e) {}
        });

        stream.on('error', (err) => {
            console.error("YTDL ERROR:", err);
            reply("Error: Failed to download audio.");
            try { fs.unlinkSync(audioPath); } catch (e) {}
        });

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
        if (!search.videos || search.videos.length === 0) {
            return reply("Error: No results found.");
        }
        
        let vid = search.videos[0];
        let url = vid.url;
        let title = vid.title;
        let thumbnail = vid.thumbnail;

        await conn.sendMessage(from, { 
            image: { url: thumbnail }, 
            caption: `Title: ${title}\nStatus: Downloading...` 
        }, { quoted: mek });

        const videoPath = path.join(__dirname, `${Date.now()}.mp4`);
        let stream = ytdl(url, { quality: 'highest' });
        
        stream.pipe(fs.createWriteStream(videoPath));

        stream.on('end', async () => {
            await conn.sendMessage(from, { 
                video: { url: videoPath }, 
                caption: `Title: ${title}` 
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
            try { fs.unlinkSync(videoPath); } catch (e) {}
        });

        stream.on('error', (err) => {
            console.error("YTDL VIDEO ERROR:", err);
            reply("Error: Failed to download video.");
            try { fs.unlinkSync(videoPath); } catch (e) {}
        });

    } catch (e) {
        console.error("VIDEO ERROR:", e);
        reply(`Error: ${e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
