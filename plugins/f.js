//---------------------------------------------------------------------------
//           TIGER-MD - ULTIMATE UNIVERSAL OPEN & DOWNLOAD COMMAND
//---------------------------------------------------------------------------

const { cmd } = require('../command');
const axios = require('axios');
const API_BASE = "https://xjawadtech.vercel.app";

cmd({
    pattern: "open",
    alias: ["link", "view", "download", "fetch"],
    desc: "Universal link opener and media downloader for any website, YouTube, Facebook, Instagram, TikTok",
    category: "tools",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("❌ Please provide any link!\n\nExample: `.open <url>`");

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = text.match(urlRegex);
        if (!matches) return reply("❌ Invalid URL! Please provide a proper link.");

        const targetUrl = matches[0];
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        if (targetUrl.includes("youtube.com") || targetUrl.includes("youtu.be")) {
            try {
                const apiUrl = `${API_BASE}/ytv3?url=${encodeURIComponent(targetUrl)}&key=baggayt`;
                const response = await axios.get(apiUrl, { timeout: 30000 });
                
                if (response.data && response.data.status && response.data.download && response.data.download.url) {
                    await conn.sendMessage(from, {
                        video: { url: response.data.download.url },
                        caption: `🎬 *YouTube Video Downloaded Successfully!*\n\n> Powered by TIGER-MD`
                    }, { quoted: mek });
                } else {
                    await reply("❌ Failed to fetch video from YouTube API.");
                }
            } catch (err) {
                await reply(`❌ YouTube Error: ${err.message}`);
            }
        } 
        else if (targetUrl.includes("facebook.com") || targetUrl.includes("fb.watch") || targetUrl.includes("instagram.com") || targetUrl.includes("tiktok.com") || targetUrl.includes("vm.tiktok.com")) {
            try {
                const socialApi = `${API_BASE}/download?url=${encodeURIComponent(targetUrl)}&key=baggayt`;
                const response = await axios.get(socialApi, { timeout: 30000 });
                
                if (response.data && response.data.status && response.data.download_url) {
                    await conn.sendMessage(from, {
                        video: { url: response.data.download_url },
                        caption: `🎬 *Social Media Video Downloaded Successfully!*\n\n> Powered by TIGER-MD`
                    }, { quoted: mek });
                } else {
                    await conn.sendMessage(from, {
                        text: `🌐 *Social Media Link Processed:*\n🔗 ${targetUrl}\n\nℹ️ Direct video stream not available, but link is active.\n\n> Powered by TIGER-MD`
                    }, { quoted: mek });
                }
            } catch (err) {
                await conn.sendMessage(from, {
                    text: `🌐 *Social Media Link:*\n🔗 ${targetUrl}\n\n> Powered by TIGER-MD`
                }, { quoted: mek });
            }
        }
        else if (targetUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
            await conn.sendMessage(from, {
                image: { url: targetUrl },
                caption: `🖼️ *Image Opened Successfully!*\n\n> Powered by TIGER-MD`
            }, { quoted: mek });
        } 
        else if (targetUrl.match(/\.(mp4|mkv|avi|mov|webm)$/i)) {
            await conn.sendMessage(from, {
                video: { url: targetUrl },
                caption: `🎬 *Video Opened Successfully!*\n\n> Powered by TIGER-MD`
            }, { quoted: mek });
        } 
        else if (targetUrl.match(/\.(mp3|wav|ogg|m4a)$/i)) {
            await conn.sendMessage(from, {
                audio: { url: targetUrl },
                mimetype: "audio/mpeg",
                ptt: false
            }, { quoted: mek });
        } 
        else {
            try {
                const response = await axios.get(targetUrl, {
                    timeout: 20000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                });

                let contentType = response.headers['content-type'] || '';
                
                if (contentType.includes('application/json')) {
                    let jsonText = JSON.stringify(response.data, null, 2);
                    if (jsonText.length > 3000) jsonText = jsonText.substring(0, 3000) + "\n... (truncated)";
                    
                    await conn.sendMessage(from, {
                        text: `🌐 *API / JSON Data Opened:*\n\`\`\`json\n${jsonText}\n\`\`\`\n\n> Powered by TIGER-MD`
                    }, { quoted: mek });
                } else {
                    let htmlData = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
                    let titleMatch = htmlData.match(/<title>(.*?)<\/title>/i);
                    let pageTitle = titleMatch ? titleMatch[1] : "Web Page";
                    
                    await conn.sendMessage(from, {
                        text: `🌐 *Link Opened Successfully!*\n\n📌 *Title:* ${pageTitle}\n🔗 *URL:* ${targetUrl}\n\n> Powered by TIGER-MD`
                    }, { quoted: mek });
                }
            } catch (webErr) {
                await conn.sendMessage(from, {
                    text: `🌐 *Web Link Processed:*\n🔗 ${targetUrl}\n\n> Powered by TIGER-MD`
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
