const { cmd } = require('../command');
const axios = require('axios');

const apiKey = "h1QtWouuuycfwXiB8xR7ytupRufcd26u";

// 1. Dance Command (Sirf .dance likhne par dance ka naya GIF aayega)
cmd({
    pattern: "dance",
    alias: ["dancegif"],
    desc: "Send a random changing dance GIF",
    category: "fun",
},
async (conn, mek, m, { reply }) => {
    try {
        // Limit ko 50 kar diya hai taaki bohot saare options mein se har baar alag GIF aaye
        const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=dance&limit=50`;
        const response = await axios.get(apiUrl);
        
        if (response.data.data.length === 0) {
            return reply("Sorry, no GIF found.");
        }

        const randomIndex = Math.floor(Math.random() * response.data.data.length);
        const gifUrl = response.data.data[randomIndex].images.original.url;

        await conn.sendMessage(m.chat, { 
            video: { url: gifUrl }, 
            gifPlayback: true, 
            caption: `Dance GIF` 
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("An error occurred: " + error.message);
    }
});

// 2. Random/Trending GIF Command (Sirf .gif likhne par har baar naya aur alag GIF aayega)
cmd({
    pattern: "gif",
    alias: ["randomgif"],
    desc: "Send a random changing trending GIF",
    category: "fun",
},
async (conn, mek, m, { reply }) => {
    try {
        // Limit ko 50 kiya hai taaki har baar bilkul naya aur alag random GIF mile
        const apiUrl = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=50`;
        const response = await axios.get(apiUrl);
        
        if (response.data.data.length === 0) {
            return reply("Sorry, no GIF found.");
        }

        const randomIndex = Math.floor(Math.random() * response.data.data.length);
        const gifUrl = response.data.data[randomIndex].images.original.url;

        await conn.sendMessage(m.chat, { 
            video: { url: gifUrl }, 
            gifPlayback: true, 
            caption: `Random GIF` 
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("An error occurred: " + error.message);
    }
});
