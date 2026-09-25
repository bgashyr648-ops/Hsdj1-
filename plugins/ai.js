const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

cmd({
    pattern: "tourl",
    alias: ["upload", "url", "link"],
    desc: "Uploads media and returns public URL",
    category: "owner",
    react: "🔗",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    let filePath = null;
    try {
        const targetQuoted = m.quoted ? m.quoted : quoted;
        if (!targetQuoted) {
            return reply("❌ Please reply directly to an image, video, audio, or document!");
        }

        let mime = targetQuoted.mimetype || targetQuoted.mediaType || "";
        await reply("⏳ Downloading media...");

        let mediaBuffer = await targetQuoted.download();
        if (!mediaBuffer) {
            return reply("❌ Failed to download media!");
        }

        let ext = '.bin';
        if (mime.includes('image')) ext = '.jpg';
        else if (mime.includes('video')) ext = '.mp4';
        else if (mime.includes('audio')) ext = '.mp3';
        else if (targetQuoted.fileName) {
            ext = path.extname(targetQuoted.fileName) || '.bin';
        }

        filePath = `./temp_${Date.now()}${ext}`;
        fs.writeFileSync(filePath, mediaBuffer);

        await reply("☁️ Uploading to server...");

        // Catbox के लिए FormData और fetch का सही तरीका (412 एरर नहीं आएगा)
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', fs.createReadStream(filePath));

        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        });

        let directUrl = await response.text();
        directUrl = directUrl ? directUrl.trim() : "";

        if (!directUrl.startsWith('http')) {
            throw new Error("Upload failed, invalid response from server.");
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        let responseText = `🔗 *MEDIA URL GENERATED*\n\n` +
                           `📁 *Link:* ${directUrl}\n\n` +
                           `🔥 *TIGER MD* \n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { text: responseText }, { quoted: mek });

    } catch (e) {
        if (filePath && fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (err) {}
        }
        console.error('Error in tourl command:', e);
        return reply(`❌ Upload failed: ${e.message}`);
    }
});
