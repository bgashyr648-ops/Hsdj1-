const { cmd } = require('../command');
const crypto = require('crypto');
const { generateWAMessageContent, generateWAMessageFromContent, jidNormalizedUser } = require('@whiskeysockets/baileys');

cmd({
    pattern: "gcstatus",
    alias: ["statusgc", "swgc"],
    desc: "Broadcast V2 Status to all groups from any chat",
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
        if (!statusText) return reply("❌ Please provide text for the status broadcast!");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        let success = 0;
        let failed = 0;
        
        for (let i = 0; i < groupIds.length; i++) {
            try {
                const jid = groupIds[i];
                const messageSecret = crypto.randomBytes(32);
                
                const inside = await generateWAMessageContent({ text: statusText }, { 
                    upload: conn.waUploadToServer 
                });
                
                const messageStructure = {
                    groupStatusMessageV2: {
                        message: {
                            ...inside,
                            messageContextInfo: { messageSecret }
                        }
                    }
                };
                
                const botUserJid = jidNormalizedUser(conn.user.id);
                const msg = generateWAMessageFromContent(jid, messageStructure, { 
                    userJid: botUserJid 
                });
                
                await conn.relayMessage(jid, msg.message, { 
                    messageId: msg.key.id 
                });
                
                success++;
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (err) {
                failed++;
            }
        }
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        await reply(`🎉 Status V2 Sent! Success: ${success} | Failed: ${failed}`);
        
    } catch (error) {
        console.error("Error:", error);
        await reply(`❌ Error: ${error.message}`);
    }
});
