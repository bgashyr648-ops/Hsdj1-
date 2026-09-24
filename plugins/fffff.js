const { cmd } = require('../command')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')

cmd({
    pattern: "dp",
    alias: ["setdp", "botdp", "setbotdp", "botpp"],
    desc: "Bot ki Profile Picture change karne ke liye",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    try {
        // Check karo sender owner hai ya bot ka apna number hai
        let botJid = conn.decodeJid ? conn.decodeJid(conn.user.id) : (conn.user.jid || conn.user.id);
        let senderJid = conn.decodeJid ? conn.decodeJid(m.sender) : m.sender;

        let isSelfMode = senderJid === botJid;

        // Agar owner ya self nahi hai toh stop karo
        if (!isOwner && !isSelfMode) {
            return reply("❌ Yeh command sirf bot owner ya bot ka apna number use kar sakta hai!");
        }

        // Check karo ki photo par reply hai ya nahi
        let mime = m.quoted ? m.quoted.mtype : m.mtype;
        if (!/image/.test(mime)) return reply("❌ Kisi photo par reply karke `.dp` likhein!");

        // Media download karo
        let media;
        if (m.quoted && m.quoted.download) {
            media = await m.quoted.download();
        } else {
            media = await downloadMediaMessage(
                m.quoted ? m.quoted : m,
                'buffer',
                {},
                { logger: console }
            );
        }

        // Profile picture update karo
        await conn.updateProfilePicture(botJid, media);

        return reply("✅ *Bot Display Picture Updated Successfully!*");

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
