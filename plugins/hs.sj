const { cmd } = require('../command');
const crypto = require('crypto');
const { generateWAMessageContent, generateWAMessageFromContent, jidNormalizedUser } = require('@whiskeysockets/baileys');

// ==================== SAFE V2 RELAY FUNCTION ====================
async function relayGroupStatusV2(conn, jid, text) {
    const messageSecret = crypto.randomBytes(32);
    const mediaObject = { text: text };
    
    const inside = await generateWAMessageContent(mediaObject, { 
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
    
    return msg;
}

// ==================== MAIN .gcstatus COMMAND ====================
cmd({
    pattern: "gcstatus",
    alias: ["statusgc", "swgc"],
    desc: "Text or Media → ALL groups",
    category: "owner",
    react: "📢",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, isCreator }) => {
    if (!isCreator) return reply("❌ Only for owners!");
    
    try {
        const quotedMsg = m.quoted;
        const mimeType = quotedMsg ? (quotedMsg.msg || quotedMsg).mimetype || '' : '';
        const caption = text?.trim() || "";
        
        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);
        const total = groupIds.length;
        
        if (!total) return reply("❌ You are not in any groups!");
        
        // ==================== CASE 1: MEDIA ====================
        if (quotedMsg && mimeType) {
            if (!mimeType.startsWith('image/') && !mimeType.startsWith('video/') && !mimeType.startsWith('audio/')) {
                return reply("❌ Unsupported! Reply to image, video, or audio.");
            }
            
            await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
            const mediaBuffer = await quotedMsg.download();
            if (!mediaBuffer) throw new Error("Failed to download media");
            
            await reply(`🚀 Sending Media to ${total} groups...`);
            
            let success = 0;
            let failed = 0;
            
            for (let i = 0; i < groupIds.length; i++) {
                try {
                    const groupMetadata = await conn.groupMetadata(groupIds[i]);
                    const participants = groupMetadata.participants || [];
                    const mentionedJid = participants.map(p => p.id);
                    const contextInfo = { isGroupStatus: true, mentionedJid };
                    
                    let messageContent = {};
                    if (mimeType.startsWith('image/')) {
                        messageContent = { image: mediaBuffer, caption, mimetype: mimeType, contextInfo };
                    } else if (mimeType.startsWith('video/')) {
                        messageContent = { video: mediaBuffer, caption, mimetype: mimeType, contextInfo };
                    } else if (mimeType.startsWith('audio/')) {
                        messageContent = { audio: mediaBuffer, mimetype: 'audio/ogg; codecs=opus', ptt: true, contextInfo };
                    }
                    
                    await conn.sendMessage(groupIds[i], messageContent);
                    success++;
                    await new Promise(resolve => setTimeout(resolve, 800));
                } catch (err) {
                    failed++;
                }
            }
            
            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
            await reply(`🎉 Media Broadcast Complete!\n📊 Total: ${total}\n✅ Success: ${success}\n❌ Failed: ${failed}`);
            return;
        }
        
        // ==================== CASE 2: TEXT V2 STATUS ====================
        const statusText = caption;
        if (!statusText) {
            return reply(`⚠️ Provide text or reply to media!`);
        }
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        await reply(`🚀 Broadcasting text to ${total} groups...`);
        
        let success = 0;
        let failed = 0;
        
        for (let i = 0; i < groupIds.length; i++) {
            try {
                await relayGroupStatusV2(conn, groupIds[i], statusText);
                success++;
                await new Promise(resolve => setTimeout(resolve, 800));
            } catch (err) {
                failed++;
                console.error(`Failed at ${groupIds[i]}:`, err.message);
            }
        }
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        await reply(`🎉 Text Broadcast Complete!\n📊 Total: ${total}\n✅ Success: ${success}\n❌ Failed: ${failed}`);
        
    } catch (error) {
        console.error("Error:", error);
        await reply(`❌ Error: ${error.message}`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }).catch(() => {});
    }
});
