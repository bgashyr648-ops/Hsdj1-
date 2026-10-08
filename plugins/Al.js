const { fana } = require("../njabulo/fana");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');
const moment = require("moment-timezone");
const { generateWAMessageContent, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

// ========== GOOGLE TRANSLATE API ==========
let translateText = async (text, targetLang) => {
    try {
        if (!targetLang || targetLang === 'en') return text;
        try {
            const { translate } = require('@vitalets/google-translate-api');
            const result = await translate(text, { to: targetLang });
            return result.text;
        } catch (e) {
            const response = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`, {
                timeout: 5000
            });
            if (response.data && response.data.responseData) {
                return response.data.responseData.translatedText || text;
            }
            return text;
        }
    } catch (error) {
        console.error('Translation error:', error.message);
        return text;
    }
};

// ========== AI APIS ==========
const AI_APIS = [
    async (q) => {
        const url = `https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(url, { timeout: 30000 });
        return data?.data?.response || null;
    },
    async (q) => {
        const url = `https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(url, { timeout: 30000 });
        return data?.data?.response || data?.response || null;
    },
    async (q) => {
        const url = `https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(url, { timeout: 30000 });
        return data?.data?.response || data?.response || null;
    }
];

// ========== AI FETCHER WITH FALLBACK ==========
const askAI = async (query) => {
    for (const api of AI_APIS) {
        try {
            console.log('🔄 Trying AI API...');
            const response = await api(query);
            if (response && typeof response === 'string' && response.trim().length > 0) {
                console.log(`✅ AI API Success! Response length: ${response.length} chars`);
                return response.trim();
            }
        } catch (error) {
            console.log(`❌ AI API failed: ${error.message}`);
            continue;
        }
    }
    return "⚠️ AI service is currently unavailable. Please try again later.";
};

// ========== ANIMATED TYPING INDICATOR ==========
async function sendTypingAnimation(zk, chatId, ms) {
    const frames = ['◐', '◓', '◑', '◒'];
    let i = 0;
    const typingMsg = await zk.sendMessage(chatId, { text: `🧠 *ɴᴏʙɪᴛᴀ ᴍᴅ ᴛʜɪɴᴋɪɴɢ* ${frames[0]}` }, { quoted: ms });
    
    const interval = setInterval(async () => {
        i = (i + 1) % frames.length;
        try {
            await zk.sendMessage(chatId, { text: `🧠 *ɴᴏʙɪᴛᴀ ᴍᴅ ᴛʜɪɴᴋɪɴɢ* ${frames[i]}`, edit: typingMsg.key });
        } catch (e) {}
    }, 500);
    
    return { typingMsg, interval };
}

// ========== GOOGLE IMAGE SEARCH API ==========
const GCSE_KEY = 'AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI';
const GCSE_CX = 'baf9bdb0c631236e5';

async function searchImages(query) {
    try {
        const { data } = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                q: query,
                key: GCSE_KEY,
                cx: GCSE_CX,
                searchType: 'image',
                num: 8,
                safe: 'off'
            },
            timeout: 15000
        });
        
        if (!data.items || data.items.length === 0) {
            return [];
        }
        return data.items.map(item => item.link);
    } catch (error) {
        console.error('Image search error:', error.message);
        return [];
    }
}

// ========== COMMAND 1: AI CHAT (.ai) ==========
fana({ nomCom: "ai", categorie: "AI", reaction: "🧠" }, async (dest, zk, commandOptions) => {
    const { ms, arg, reply } = commandOptions;
    const text = arg.join(" ");
    
    if (!text) {
        return reply("❌ Please provide a prompt or question for Nobita MD AI.\nExample: `.ai Hello`");
    }

    const { typingMsg, interval } = await sendTypingAnimation(zk, dest, ms);

    try {
        let aiResponse = await askAI(text);
        
        aiResponse += `\n\n> *Powered by Nobita MD*\n> *Owner: Hamad Fida*`;

        clearInterval(interval);
        await zk.sendMessage(dest, { text: aiResponse, edit: typingMsg.key });
    } catch (error) {
        clearInterval(interval);
        reply(`❌ Error: ${error.message}`);
    }
});

// ========== COMMAND 2: IMAGE SEARCH (.image) ==========
fana({ nomCom: "image", categorie: "Search", reaction: "🖼️" }, async (dest, zk, commandOptions) => {
    const { ms, arg, reply } = commandOptions;
    const query = arg.join(" ");

    if (!query) {
        return reply("❌ Please provide a search query for images.\nExample: `.image cat`");
    }

    reply("🔍 Searching images for you...");

    try {
        const imageUrls = await searchImages(query);
        if (imageUrls.length === 0) {
            return reply("❌ No images found.");
        }

        for (let i = 0; i < Math.min(imageUrls.length, 5); i++) {
            await zk.sendMessage(dest, { 
                image: { url: imageUrls[i] }, 
                caption: `🖼️ Nobita MD Image Result ${i + 1}: *${query}*\n> *Owner: Hamad Fida*` 
            }, { quoted: ms });
        }
    } catch (error) {
        reply(`❌ Error fetching images: ${error.message}`);
    }
});
