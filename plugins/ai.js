const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "swag",
    alias: ["badboy", "mafia", "attitude", "dp"],
    desc: "Get stylish boy and girl attitude DPs via API",
    category: "owner",
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        let query = "stylish boy and girl attitude dp"; // Default mixed
        
        // Agar user .swag 1 likhega toh sirf boy aayega
        if (q === "1") {
            query = "stylish badboy attitude boy dp";
        } 
        // Agar user .swag 2 likhega toh sirf girl aayegi
        else if (q === "2") {
            query = "stylish attitude girl dp";
        }

        let apiUrl = `https://apis.davidcyriltech.my.id/pinterest?query=${encodeURIComponent(query)}`;
        let apiData = await axios.get(apiUrl);
        
        let imageUrl = apiData.data.result[Math.floor(Math.random() * apiData.data.result.length)];
        let imgBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        let caption = `🔥 *TIGER MD* \n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { image: Buffer.from(imgBuffer.data), caption: caption }, { quoted: mek });

    } catch (e) {
        console.error('Error in swag command:', e);
        let backupUrl = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1024";
        let buf = await axios.get(backupUrl, { responseType: 'arraybuffer' });
        let caption = `🔥 *TIGER MD* \n👑 *Owner:* BAGGA SHER MD`;
        return await conn.sendMessage(from, { image: Buffer.from(buf.data), caption: caption }, { quoted: mek });
    }
});
