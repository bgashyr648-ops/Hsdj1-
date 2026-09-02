// Tagger MD - Uguu to Catbox Uploader

const { cmd, commands } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

cmd({
  pattern: "url",
  alias: ["uploade", "tourl", "ikup"],
  react: '🖇',
  desc: "Convert media to URL (via Uguu & Catbox)",
  category: "utility",
  use: ".tourl [reply to media]",
  filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    const quotedMsg = quoted ? quoted : m;
    const mimeType = quotedMsg.mimetype || 
                     (quotedMsg.msg && quotedMsg.msg.mimetype) || 
                     (quotedMsg.message && quotedMsg.message[quotedMsg.mtype] && quotedMsg.message[quotedMsg.mtype].mimetype) || 
                     '';
    
    if (!mimeType) {
      return reply("❌ Please reply to an image, video, audio, or any supported file!");
    }

    const mediaBuffer = await quotedMsg.download();

    // Extension mapping
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('image/webp')) extension = '.webp';
    else if (mimeType.includes('video/mp4')) extension = '.mp4';
    else if (mimeType.includes('video')) extension = '.mp4';
    else if (mimeType.includes('audio/mpeg')) extension = '.mp3';
    else if (mimeType.includes('audio/mp4')) extension = '.m4a';
    else if (mimeType.includes('audio/x-m4a')) extension = '.m4a';
    else if (mimeType.includes('audio/ogg')) extension = '.opus';
    else if (mimeType.includes('audio/opus')) extension = '.opus';
    else if (mimeType.includes('audio')) extension = '.audio';
    else if (mimeType.includes('application/zip')) extension = '.zip';
    else if (mimeType.includes('application/pdf')) extension = '.pdf';
    else if (mimeType.includes('text/')) extension = '.txt';
    else extension = '.bin';
    
    const fileName = `tagger-${Date.now()}${extension}`;

    // STEP 1: Upload to Uguu
    const form = new FormData();
    form.append('files[]', Buffer.from(mediaBuffer), {
      filename: fileName,
      contentType: mimeType || 'application/octet-stream'
    });

    const uguuResponse = await axios.post("https://uguu.se/upload", form, {
      headers: {
        ...form.getHeaders(),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      timeout: 60000
    });
    
    let uguuUrl = null;
    if (uguuResponse.data) {
      if (typeof uguuResponse.data === 'string') {
        try {
          const parsed = JSON.parse(uguuResponse.data);
          uguuUrl = parsed.files?.[0]?.url;
        } catch (e) {}
      } else if (uguuResponse.data.files && uguuResponse.data.files[0]) {
        uguuUrl = uguuResponse.data.files[0].url;
      }
    }
    
    if (!uguuUrl) {
      return reply("❌ Uguu upload failed - no URL returned.");
    }

    // STEP 2: Upload to Catbox via URL method
    const catboxForm = new FormData();
    catboxForm.append('reqtype', 'urlupload');
    catboxForm.append('userhash', '');
    catboxForm.append('url', uguuUrl);

    const catboxResponse = await axios.post("https://catbox.moe/user/api.php", catboxForm, {
      headers: {
        ...catboxForm.getHeaders(),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      timeout: 60000
    });

    const catboxUrl = typeof catboxResponse.data === 'string' ? catboxResponse.data.trim() : '';
    
    if (!catboxUrl || !catboxUrl.startsWith('https://')) {
      return reply(`❌ Catbox rejected the URL. Response: ${catboxUrl || 'empty'}`);
    }

    const fileSize = formatBytes(mediaBuffer.length);
    
    let mediaType = 'File';
    if (mimeType.includes('image')) mediaType = '📷 Image';
    else if (mimeType.includes('video')) mediaType = '🎥 Video';
    else if (mimeType.includes('audio/ogg')) mediaType = '🎤 Voice Note';
    else if (mimeType.includes('audio')) mediaType = '🎵 Audio';
    else if (mimeType.includes('application/zip')) mediaType = '📦 Archive';

    await reply(
      `*${mediaType} Uploaded Successfully*\n\n` +
      `*Size:* ${fileSize}\n` +
      `*URL:* ${catboxUrl}\n\n` +
      `> © Uploaded by Tagger MD`
    );

  } catch (error) {
    console.error(error);
    const errMessage = error.response?.data || error.message || error;
    await reply(`❌ Error: ${typeof errMessage === 'object' ? JSON.stringify(errMessage) : errMessage}`);
  }
});
