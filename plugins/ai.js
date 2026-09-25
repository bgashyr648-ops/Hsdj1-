const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "ai",
    alias: ["chat", "gpt", "ask", "bot"],
    desc: "WhatsApp par sabhi kaam aur coding karne ke liye advanced AI",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bhai koi sawal ya coding command likho! Jaise: .ai JavaScript ka code likho");

        await reply("⚡ TIGER MD AI is processing your request...");

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_GROQ_API_KEY_HERE',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are TIGER MD AI, an elite software developer and master assistant created by BAGGA SHER MD. Provide clean, production-ready, error-free JavaScript/Node.js code and accurate technical solutions instantly. Format code blocks properly for WhatsApp."
                    },
                    {
                        role: "user",
                        content: q
                    }
                ],
                temperature: 0.7,
                max_tokens: 4096
            })
        });

        const result = await response.json();
        
        if (!result.choices || !result.choices[0]) {
            throw new Error("API response error or limit reached.");
        }

        let aiAnswer = result.choices[0].message.content;

        let responseText = `🤖 *TIGER MD ADVANCED AI*\n\n${aiAnswer}\n\n` +
                           `🔥 *POWERED BY BAGGA SHER MD*`;

        return await conn.sendMessage(from, { text: responseText }, { quoted: mek });

    } catch (e) {
        console.error('Error in AI command:', e);
        return reply(`❌ Error: ${e.message}\n\nBhai, API key check kar ya dobara try kar!`);
    }
});
