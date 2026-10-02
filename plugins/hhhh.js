const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tgrbotai",
    alias: [],
    desc: "AI chat with massive 20+ API fallback chain",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("Please provide a query!\nExample: .tgrbotai Hello");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        let aiReply = null;
        const encodedText = encodeURIComponent(text);

        // List of 20+ APIs to try sequentially
        const apiList = [
            // BK9 APIs
            async () => {
                const res = await axios.get(`https://bk9.fun/ai/gemini?q=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.status && res.data.BK9 ? res.data.BK9 : null;
            },
            async () => {
                const res = await axios.get(`https://bk9.fun/ai/chatgpt?q=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.status && res.data.BK9 ? res.data.BK9 : null;
            },
            // Siputzx APIs
            async () => {
                const res = await axios.get(`https://api.siputzx.my.id/api/ai/gemini?query=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.data ? res.data.data : null;
            },
            async () => {
                const res = await axios.get(`https://api.siputzx.my.id/api/ai/chatgpt?query=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.data ? res.data.data : null;
            },
            // Vapis APIs
            async () => {
                const res = await axios.get(`https://api.vapis.my.id/api/gemini?q=${encodedText}`, { timeout: 10000 });
                return res.data && (res.data.result || res.data.data) ? (res.data.result || res.data.data) : null;
            },
            async () => {
                const res = await axios.get(`https://api.vapis.my.id/api/openai?q=${encodedText}`, { timeout: 10000 });
                return res.data && (res.data.result || res.data.data) ? (res.data.result || res.data.data) : null;
            },
            // Ryzendesu APIs
            async () => {
                const res = await axios.get(`https://api.ryzendesu.vip/api/ai/gemini?text=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.response ? res.data.response : null;
            },
            async () => {
                const res = await axios.get(`https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.response ? res.data.response : null;
            },
            // Lolhuman / Other Public mirrors
            async () => {
                const res = await axios.get(`https://api.lolhuman.xyz/api/openai?apikey=GataDev&text=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.result ? res.data.result : null;
            },
            // Additional fallback endpoints
            async () => {
                const res = await axios.get(`https://itzpire.com/ai/gemini?q=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.result ? res.data.result : null;
            },
            async () => {
                const res = await axios.get(`https://itzpire.com/ai/gpt?q=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.result ? res.data.result : null;
            },
            async () => {
                const res = await axios.get(`https://api.agatz.xyz/api/gemini?message=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.data ? res.data.data : null;
            },
            async () => {
                const res = await axios.get(`https://api.agatz.xyz/api/openai?message=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.data ? res.data.data : null;
            },
            async () => {
                const res = await axios.get(`https://exonix.tech/api/ai/gemini?q=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.result ? res.data.result : null;
            },
            async () => {
                const res = await axios.get(`https://api.dreaded.site/api/gemini?text=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.result ? res.data.result : null;
            },
            async () => {
                const res = await axios.get(`https://www.dark-yasiya-api.site/ai/gemini?q=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.result ? res.data.result : null;
            },
            async () => {
                const res = await axios.get(`https://widipe.com/gemini?text=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.result ? res.data.result : null;
            },
            async () => {
                const res = await axios.get(`https://widipe.com/chatgpt?text=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.result ? res.data.result : null;
            },
            async () => {
                const res = await axios.get(`https://api.botcahx.eu.org/api/search/gemini?text=${encodedText}&apikey=admin`, { timeout: 10000 });
                return res.data && res.data.result ? res.data.result : null;
            },
            async () => {
                const res = await axios.get(`https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodedText}`, { timeout: 10000 });
                return res.data && res.data.result ? res.data.result : null;
            }
        ];

        // Loop through the APIs one by one until one succeeds
        for (let apiFn of apiList) {
            try {
                aiReply = await apiFn();
                if (aiReply) break; // Exit loop if we get a valid response
            } catch (err) {
                // Ignore individual API errors and proceed to the next one
            }
        }

        if (aiReply) {
            await conn.sendMessage(from, { 
                image: { url: "https://files.catbox.moe/example.jpg" },
                caption: `🤖 *TIGER-MD AI RESPONSE*\n\n${aiReply}\n\n> Powered by Bagga Sher MD` 
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        } else {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("All backup APIs are currently down. Please try again later!");
        }

    } catch (e) {
        console.error("AI ERROR:", e.message);
        reply(`Error: ${e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
