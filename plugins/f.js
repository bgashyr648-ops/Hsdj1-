//---------------------------------------------------------------------------
//           TIGER-MD - UNIVERSAL OPEN COMMAND
//---------------------------------------------------------------------------

const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "open",
    alias: ["link", "view"],
    desc: "Open any link (Video, Image, API or Webpage)",
    category: "tools",
    react: "🌐",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("❌ Please provide any link!\n\nExample: `.open https://example.com/file.jpg`");

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = text.match(urlRegex);
        if (!matches) return reply("❌ Invalid URL! Please provide a proper link.");

        const targetUrl = matches[0];
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // 1. Image Link
        if (targetUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
            await conn.sendMessage(from, {
                image: { url: targetUrl },
                caption: `🖼️ *Image Opened Successfully!*\n\n> Powered by TIGER-MD`
            }, { quoted: mek });
        } 
        // 2. Video Link
        else if (targetUrl.match(/\.(mp4|mkv|avi|mov)$/i)) {
            await conn.sendMessage(from, {
                video: { url: targetUrl },
                caption: `🎬 *Video Opened Successfully!*\n\n> Powered by TIGER-MD`
            }, { quoted: mek });
        } 
        // 3. Audio Link
        else if (targetUrl.match(/\.(mp3|wav|ogg|m4a)$/i)) {
            await conn.sendMessage(from, {
                audio: { url: targetUrl },
                mimetype: "audio/mpeg",
                ptt: false
            }, { quoted: mek });
        } 
        // 4. API or Website Link
        else {
            try {
                const response = await axios.get(targetUrl, { timeout: 15000 });
                let contentType = response.headers['content-type'] || '';
                
                if (contentType.includes('application/json')) {
                    let jsonText = JSON.stringify(response.data, null, 2);
                    if (jsonText.length > 3000) jsonText = jsonText.substring(0, 3000) + "\n... (truncated)";
                    
                    await conn.sendMessage(from, {
                        text: `🌐 *API Response:*\n\`\`\`json\n${jsonText}\n\`\`\`\n\n> Powered by TIGER-MD`
                    }, { quoted: mek });
                } else {
                    await conn.sendMessage(from, {
                        text: `🔗 *Link Opened:* ${targetUrl}\n\n> Powered by TIGER-MD`
                    }, { quoted: mek });
                }
            } catch (e) {
                await conn.sendMessage(from, {
                    text: `🔗 *Link:* ${targetUrl}\n\n> Powered by TIGER-MD`
                }, { quoted: mek });
            }
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("❌ OPEN ERROR:", err);
        reply(`❌ Error: ${err.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
