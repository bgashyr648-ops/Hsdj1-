// ============================================
// COMMAND: song (Interactive - Audio/Video Choice)
// ============================================
cmd({
    pattern: "song",
    alias: ["yt", "music", "ytdl"],
    desc: "Download YouTube song or video (interactive)",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("🎵 Please provide a song name or YouTube link!\n\nExample: `.song Faded Alan Walker`");

        const yts = require('yt-search');
        let url = text;
        let vid = null;

        // URL Check & Extraction
        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }
            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");
            const searchFromUrl = await yts({ videoId: videoId });
            vid = searchFromUrl;
        } else {
            const search = await yts(text);
            if (!search.videos || !search.videos.length) {
                return reply("❌ No results found!");
            }
            // FIX: Pehli video select karne ke liye [0] lagana zaroori hai
            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        // Interactive Message text
        const instructionMessage = `*🎵 YOUTUBE DOWNLOAD MENU*\n\n` +
            `📌 *Title:* ${vid.title}\n` +
            `📺 *Channel:* ${vid.author?.name || 'Unknown'}\n` +
            `🕒 *Duration:* ${vid.timestamp}\n` +
            `👀 *Views:* ${vid.views?.toLocaleString() || 'N/A'}\n\n` +
            `*Is message ka reply (quote) kar ke number likhein:* \n\n` +
            `1️⃣ *Audio File* (MP3 Format)\n` +
            `2️⃣ *Video File* (MP4 Format)\n\n` +
            `> Powered by LOVE-MD`;

        // Send menu with image
        const sentMsg = await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: instructionMessage
        }, { quoted: mek });

        // Message Listener to catch response
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0]; // FIX: Array se pehla message nikalna
            if (!msg || !msg.message || !msg.message.extendedTextMessage) return;
            
            // Check if user is replying to the menu message
            const isReplyToMenu = msg.message.extendedTextMessage.contextInfo?.stanzaId === sentMsg.key.id;
            if (!isReplyToMenu) return;

            const userChoice = msg.message.extendedTextMessage.text?.trim();
            const sender = msg.key.remoteJid;

            if (userChoice === "1") {
                // --- NEW AUDIO DOWNLOAD LOGIC ---
                await reply("🎧 *Downloading Audio... Please wait.*");
                let success = false;
                
                const audioAPIs = [
                    `${API_BASE}/yta6?url=${encodeURIComponent(url)}`,
                    `${API_BASE}/yta7?url=${encodeURIComponent(url)}`,
                    `${API_BASE}/yta1?url=${encodeURIComponent(url)}`
                ];

                for (const apiUrl of audioAPIs) {
                    try {
                        const response = await axios.get(apiUrl, { timeout: 15000 });
                        let audioUrl = response.data?.status && response.data?.download?.url ? response.data.download.url : null;
                        
                        if (audioUrl) {
                            await conn.sendMessage(sender, {
                                audio: { url: audioUrl },
                                mimetype: "audio/mpeg",
                                fileName: `${vid.title}.mp3`,
                                ptt: false
                            }, { quoted: msg });
                            success = true;
                            break;
                        }
                    } catch (e) { continue; }
                }
                if (!success) return reply("❌ Audio download failed! Nayi API ne link generate nahi kiya.");
                await conn.sendMessage(sender, { react: { text: '✅', key: msg.key } });

            } else if (userChoice === "2") {
                // --- NEW VIDEO DOWNLOAD LOGIC ---
                await reply("📹 *Downloading Video... Please wait.*");
                let success = false;
                
                const videoAPIs = [
                    `${API_BASE}/ytv1?url=${encodeURIComponent(url)}`,
                    `${API_BASE}/ytv2?url=${encodeURIComponent(url)}`
                ];

                for (const apiUrl of videoAPIs) {
                    try {
                        const response = await axios.get(apiUrl, { timeout: 15000 });
                        let videoUrl = response.data?.status && response.data?.download?.url ? response.data.download.url : null;
                        
                        if (videoUrl) {
                            await conn.sendMessage(sender, {
                                video: { url: videoUrl },
                                caption: `🎬 *${vid.title}*\n\n> Powered by LOVE-MD`
                            }, { quoted: msg });
                            success = true;
                            break;
                        }
                    } catch (e) { continue; }
                }
                if (!success) return reply("❌ Video download failed! Server issue.");
                await conn.sendMessage(sender, { react: { text: '✅', key: msg.key } });
            }
        });

    } catch (e) {
        console.error("Error in .song command:", e);
        reply("❌ Error occurred, please try again later!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
