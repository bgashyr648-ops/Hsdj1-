//---------------------------------------------------------------------------
//           LOVE-MD - YOUTUBE DOWNLOADER
//---------------------------------------------------------------------------

const { cmd } = require('../command');
const axios = require('axios');

// ============================================================
// NEW API
// ============================================================
// Yahan apni NEW API ka endpoint lagayen.
// Example:
// const API_ENDPOINT = "https://example.com/api/youtube?url=";
const API_ENDPOINT = "YOUR_NEW_API_ENDPOINT?url=";


// ============================================================
// SMALL CAPS
// ============================================================
const toSmallCaps = (text) => {
    const map = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ',
        'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
        'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ',
        'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ',
        'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ',
        'z': 'ᴢ'
    };

    return text
        .split('')
        .map(c => map[c.toLowerCase()] || c)
        .join('');
};


// ============================================================
// YOUTUBE VIDEO ID
// ============================================================
function getVideoId(url) {
    const match = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );

    return match ? match[1] : null;
}


// ============================================================
// NEW API REQUEST
// Response expected:
//
// {
//   "status": true,
//   "creator": "JawadTechXD",
//   "download": {
//      "url": "https://..."
//   }
// }
// ============================================================
async function getDownloadUrl(url) {

    const apiUrl = `${API_ENDPOINT}${encodeURIComponent(url)}`;

    try {

        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        const data = response.data;

        if (
            data &&
            data.status === true &&
            data.download &&
            data.download.url
        ) {
            return data.download.url;
        }

        return null;

    } catch (error) {

        console.error(
            'NEW API ERROR:',
            error.message
        );

        return null;
    }
}


// ============================================================
// GET YOUTUBE VIDEO
// ============================================================
async function getYouTubeVideo(text) {

    const yts = require('yt-search');

    let vid;

    if (
        text.startsWith('http://') ||
        text.startsWith('https://')
    ) {

        if (
            !text.includes('youtube.com') &&
            !text.includes('youtu.be')
        ) {
            throw new Error('Please provide a valid YouTube URL!');
        }

        const videoId = getVideoId(text);

        if (!videoId) {
            throw new Error('Invalid YouTube URL!');
        }

        vid = await yts({
            videoId: videoId
        });

    } else {

        const search = await yts(text);

        if (
            !search.videos ||
            !search.videos.length
        ) {
            throw new Error('No YouTube results found!');
        }

        vid = search.videos[0];
    }

    if (!vid) {
        throw new Error('No results found!');
    }

    return vid;
}


// ============================================================
// PLAY - AUDIO
// ============================================================
cmd({
    pattern: "play",
    alias: ["audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (
    conn,
    mek,
    m,
    { from, text, reply }
) => {

    try {

        if (!text) {
            return reply(
                "❌ Please provide song name\n\nExample: .play Shape of You"
            );
        }

        const vid = await getYouTubeVideo(text);

        await conn.sendMessage(
            from,
            {
                image: {
                    url: vid.thumbnail
                },
                caption:
`- *AUDIO DOWNLOADER 🎧*

╭━━❐━⪼
┇๏ *Title* - ${vid.title}
┇๏ *Duration* - ${vid.timestamp}
┇๏ *Views* - ${vid.views?.toLocaleString() || 'N/A'}
┇๏ *Author* - ${vid.author?.name || 'Unknown'}
┇๏ *Status* - Downloading...
╰━━❑━⪼

> Powered by LOVE-MD`
            },
            { quoted: mek }
        );

        const audioUrl = await getDownloadUrl(
            vid.url
        );

        if (!audioUrl) {
            return reply(
                "❌ Audio download failed! Try again later."
            );
        }

        await conn.sendMessage(
            from,
            {
                audio: {
                    url: audioUrl
                },
                mimetype: "audio/mpeg",
                fileName: `${vid.title}.mp3`,
                ptt: false
            },
            { quoted: mek }
        );

        await conn.sendMessage(
            from,
            {
                react: {
                    text: "✅",
                    key: m.key
                }
            }
        );

    } catch (error) {

        console.error(
            "PLAY ERROR:",
            error
        );

        reply(
            `❌ ${error.message || "Download error!"}`
        );

        await conn.sendMessage(
            from,
            {
                react: {
                    text: "❌",
                    key: m.key
                }
            }
        );
    }
});


// ============================================================
// VIDEO
// ============================================================
cmd({
    pattern: "video",
    alias: ["ytv", "ytmp4", "vd"],
    desc: "Download YouTube video",
    category: "download",
    react: "📹",
    filename: __filename
}, async (
    conn,
    mek,
    m,
    { from, text, reply }
) => {

    try {

        if (!text) {
            return reply(
                "🎥 Please provide a video name or YouTube link!\n\nExample: .video Alone Marshmello"
            );
        }

        const vid = await getYouTubeVideo(text);

        await conn.sendMessage(
            from,
            {
                image: {
                    url: vid.thumbnail
                },
                caption:
`*🎬 VIDEO DOWNLOADER*

🎞️ *Title:* ${vid.title}
📺 *Channel:* ${vid.author?.name || 'Unknown'}
🕒 *Duration:* ${vid.timestamp}

*Status:* Downloading Video...

> Powered by LOVE-MD`
            },
            { quoted: mek }
        );

        const videoUrl = await getDownloadUrl(
            vid.url
        );

        if (!videoUrl) {
            return reply(
                "❌ Video download failed! Try again later."
            );
        }

        await conn.sendMessage(
            from,
            {
                video: {
                    url: videoUrl
                },
                caption:
`🎬 *${vid.title}*

> Powered by LOVE-MD`
            },
            { quoted: mek }
        );

        await conn.sendMessage(
            from,
            {
                react: {
                    text: "✅",
                    key: m.key
                }
            }
        );

    } catch (error) {

        console.error(
            "VIDEO ERROR:",
            error
        );

        reply(
            `❌ ${error.message || "Download error!"}`
        );

        await conn.sendMessage(
            from,
            {
                react: {
                    text: "❌",
                    key: m.key
                }
            }
        );
    }
});


// ============================================================
// SONG - AUDIO / VIDEO
// ============================================================
cmd({
    pattern: "song",
    alias: ["yt", "ytdl"],
    desc: "Download YouTube audio or video",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (
    conn,
    mek,
    m,
    { from, text, reply }
) => {

    try {

        if (!text) {
            return reply(
                "🎶 Please provide a YouTube video name or link.\n\nExample: .song Alone Alan Walker"
            );
        }

        const vid = await getYouTubeVideo(text);

        const caption =
`*╭┈───〔 ${toSmallCaps('YT Downloader')} 〕┈───⊷*

*├▢ 🎬 Title:* ${vid.title}
*├▢ 📺 Channel:* ${vid.author?.name || 'Unknown'}
*├▢ ⏰ Duration:* ${vid.timestamp}
*├▢ 👀 Views:* ${vid.views?.toLocaleString() || 'N/A'}

*╭───⬡ ${toSmallCaps('Select Format')} ⬡───*
*┋ ⬡ 1* 🎧 ${toSmallCaps('Audio (MP3)')}
*┋ ⬡ 2* 📹 ${toSmallCaps('Video (MP4)')}
*╰───────────────────⊷*

> Powered by LOVE-MD`;

        const sent = await conn.sendMessage(
            from,
            {
                image: {
                    url: vid.thumbnail
                },
                caption: caption
            },
            { quoted: mek }
        );

        const msgId = sent.key.id;

        const songListener = async (msgData) => {

            try {

                const received =
                    msgData.messages[0];

                if (!received?.message) return;

                const selected =
                    received.message.conversation ||
                    received.message.extendedTextMessage?.text;

                const replyToBot =
                    received.message.extendedTextMessage
                        ?.contextInfo
                        ?.stanzaId === msgId;

                if (!replyToBot) return;

                conn.ev.off(
                    "messages.upsert",
                    songListener
                );

                if (
                    selected !== "1" &&
                    selected !== "2"
                ) {

                    return conn.sendMessage(
                        from,
                        {
                            text:
`❌ *Invalid selection!*

Reply with:
1️⃣ Audio (MP3)
2️⃣ Video (MP4)`
                        },
                        { quoted: received }
                    );
                }

                await conn.sendMessage(
                    from,
                    {
                        react: {
                            text: "⬇️",
                            key: received.key
                        }
                    }
                );

                const downloadUrl =
                    await getDownloadUrl(
                        vid.url
                    );

                if (!downloadUrl) {

                    return conn.sendMessage(
                        from,
                        {
                            text:
                                "❌ Download failed! Try again later."
                        },
                        { quoted: received }
                    );
                }

                if (selected === "1") {

                    await conn.sendMessage(
                        from,
                        {
                            audio: {
                                url: downloadUrl
                            },
                            mimetype: "audio/mpeg",
                            fileName:
                                `${vid.title}.mp3`,
                            ptt: false
                        },
                        { quoted: received }
                    );

                } else {

                    await conn.sendMessage(
                        from,
                        {
                            video: {
                                url: downloadUrl
                            },
                            caption:
`🎬 *${vid.title}*

> Powered by LOVE-MD`
                        },
                        { quoted: received }
                    );
                }

                await conn.sendMessage(
                    from,
                    {
                        react: {
                            text: "✅",
                            key: received.key
                        }
                    }
                );

            } catch (error) {

                console.error(
                    "SONG LISTENER ERROR:",
                    error
                );

            }
        };

        conn.ev.on(
            "messages.upsert",
            songListener
        );

        setTimeout(() => {

            conn.ev.off(
                "messages.upsert",
                songListener
            );

        }, 30000);

    } catch (error) {

        console.error(
            "SONG ERROR:",
            error
        );

        reply(
            `❌ ${error.message || "Error occurred!"}`
        );
    }
});


// ============================================================
// YTS - YOUTUBE SEARCH
// ============================================================
cmd({
    pattern: "yts",
    alias: ["ytsearch", "searchyt"],
    use: ".yts jawad",
    react: "🔎",
    desc: "Search YouTube",
    category: "search",
    filename: __filename
}, async (
    conn,
    mek,
    m,
    { from, text, reply }
) => {

    try {

        if (!text) {
            return reply(
                "*Please provide search words!*\n\nExample: .yts Alan Walker Faded"
            );
        }

        const yts = require("yt-search");

        const search = await yts(text);

        if (
            !search.videos ||
            !search.videos.length
        ) {
            return reply(
                "*No results found!*"
            );
        }

        const results =
            search.videos.slice(0, 10);

        let mesaj =
`*╭┈───〔 ${toSmallCaps('YouTube Search')} 〕┈───⊷*

*├▢ 🔎 Query:* ${text}
*├▢ 📊 Results:* ${search.videos.length}
*╰───────────────────⊷*

`;

        results.forEach((video, i) => {

            mesaj +=
`*${i + 1}. ${video.title}*
*├▢ 🔗 URL:* ${video.url}
*├▢ ⏱️ Duration:* ${video.timestamp}
*├▢ 👀 Views:* ${video.views?.toLocaleString() || 'N/A'}
*├▢ 👤 Channel:* ${video.author?.name || 'Unknown'}
*╰───────────────────⊷*

`;
        });

        mesaj +=
`*╭───⬡ ${toSmallCaps('Powered By')} ⬡───*
*┋ ⬡ ${toSmallCaps('LOVE-MD')}*
*╰───────────────────⊷*`;

        await conn.sendMessage(
            from,
            {
                text: mesaj.trim()
            },
            { quoted: mek }
        );

    } catch (error) {

        console.error(
            "YTS ERROR:",
            error
        );

        reply(
            `*Error occurred while searching!*\n\`\`\`${error.message}\`\`\``
        );
    }
});
