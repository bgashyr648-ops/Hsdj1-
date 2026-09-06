const { cmd } = require('../command');
const { generateWAMessageContent, generateWAMessageFromContent, jidNormalizedUser } = require('@whiskeysockets/baileys');

cmd({
    pattern: "gcstatus",
    alias: ["statusgc", "swgc"],
    desc: "Silent Group Status Broadcast",
    category: "owner",
    react: "📢",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, isCreator }) => {
    if (!isCreator) return reply("❌ Only for owners!");
    
    try {
        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);
        
        if (!groupIds.length) return reply("❌ No groups found!");

        const statusText = text?.trim() || (m.quoted ? m.quoted.text : "");
        if (!statusText) return reply("❌ Please provide text or media caption for the status!");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        let success = 0;
        let failed = 0;
        
        for (let i = 0; i < groupIds.length; i++) {
            try {
                const jid = groupIds[i];
                
                const content = await generateWAMessageContent({ text: statusText }, { upload: conn.waUploadToServer });
                const botUserJid = jidNormalizedUser(conn.user.id);
                
                const fullMessage = generateWAMessageFromContent(jid, {
                    groupStatusMessageV2: {
                        message: content
                    }
                }, { userJid: botUserJid });
                
                await conn.relayMessage(jid, fullMessage.message, { messageId: fullMessage.key.id });
                
                success++;
                await new Promise(resolve => setTimeout(resolve, 400)); // थोड़ा सुरक्षित डिले
            } catch (err) {
                failed++;
            }
        }
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        
        const responseStyle = `🔥 GC Status Deployed Successfully!\n\n` +
            `📊 Total Groups Updated: ${success}\n` +
            `❌ Failed: ${failed}\n\n` +
            `⚡ Owner: *Bagga Sher MD*\n` +
            `💬 _"Tu sade level da hi nahi hai!"_`;
            
        await reply(responseStyle);
        
    } catch (error) {
        console.error("Error:", error);
        await reply(`❌ Error: ${error.message}`);
    }
});
