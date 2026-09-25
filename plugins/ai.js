const { cmd } = require('../command');

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

        await reply("⚡ TIGER MD AI is processing...");

        // Yahan apni bilkul fresh aur asli Groq API key daal le
        const apiKey = "YOUR_REAL_GROQ_API_KEY_HERE";

        if (!apiKey || apiKey.includes("YOUR_REAL")) {
            return reply("❌ Bhai, code ke andar apni asli Groq API key nahi dali tune! Use daal kar dobara try kar.");
        }

        const apiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are TIGER MD AI, an elite software developer and master assistant created by BAGGA SHER MD. Provide clean, production-ready, error-free JavaScript/Node.js code and accurate technical solutions instantly in Roman English."
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

        const result = await apiResponse.json();
        
        if (!result.choices || !result.choices.length) {
            return reply(`❌ API Error: ${JSON.stringify(result)}`);
        }

        let aiAnswer = result.choices[0].message.content;

        let responseText = `🤖 *TIGER MD ADVANCED AI*\n\n${aiAnswer}\n\n` +
                           `🔥 *POWERED BY BAGGA SHER MD*`;

        return await conn.sendMessage(from, { text: responseText }, { quoted: mek });

    } catch (e) {
        console.error('Error in AI command:', e);
        return reply(`❌ Code mein yeh error aa gaya hai: ${e.message}`);
    }
});
