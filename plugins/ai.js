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

        // Yahan apni asli working Groq API keys daal le, ek nahi chali toh doosri chal padegi
        const apiKeys = [
            "gsk_YOUR_REAL_KEY_1_HERE",
            "gsk_YOUR_REAL_KEY_2_HERE"
        ];

        let result = null;
        let success = false;

        for (let i = 0; i < apiKeys.length; i++) {
            if (apiKeys[i].includes("YOUR_REAL_KEY")) continue;

            try {
                const apiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKeys[i]}`,
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

                const data = await apiResponse.json();
                if (data.choices && data.choices.length > 0) {
                    result = data.choices[0].message.content;
                    success = true;
                    break;
                }
            } catch (err) {
                console.log(`Key ${i+1} error, trying next...`);
            }
        }

        if (!success || !result) {
            return reply("❌ Bhai, abhi API keys active nahi hain ya limit cross ho gayi hai. Apni ek asli Groq key yahan daal le!");
        }

        let responseText = `🤖 *TIGER MD ADVANCED AI*\n\n${result}\n\n` +
                           `🔥 *POWERED BY BAGGA SHER MD*`;

        return await conn.sendMessage(from, { text: responseText }, { quoted: mek });

    } catch (e) {
        console.error('Error in AI command:', e);
        return reply(`❌ Error aa gaya: ${e.message}`);
    }
});
