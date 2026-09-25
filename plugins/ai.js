const { cmd } = require('../command');

cmd({
    pattern: "baga",
    alias: ["bagasher", "mdvideo"],
    desc: "BAGGA SHER MD 50 working videos command",
    category: "owner",
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        await reply("🔥 BAGGA SHER MD video bhej raha hai...");

        const autoVideoLinks = [
            "https://assets.mixkit.co/videos/preview/mixkit-tree-in-the-winter-1557-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-42296-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-sunset-26070-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31938-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-silhouette-of-a-person-against-a-sunset-31922-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41687-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-flame-burning-in-a-campfire-4328-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-1516-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-fuell-station-at-night-41584-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-highway-traffic-in-the-evening-41583-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-highway-in-the-desert-41585-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-scenic-aerial-view-of-sunset-over-the-mountains-42416-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-green-house-plant-moving-with-the-wind-43306-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-cosmic-background-of-a-starry-night-sky-42533-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-neon-lights-tunnel-background-42998-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-fireworks-in-the-night-sky-42867-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-ferris-wheel-at-night-with-lights-41724-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-cat-eyes-41926-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-puppy-running-in-the-grass-42234-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-lion-walking-in-the-grass-41617-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-tiger-walking-in-the-forest-41619-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-horse-running-in-a-field-41620-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-bird-flying-in-the-sky-41621-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-fish-swimming-in-the-sea-41622-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-butterfly-on-a-flower-41623-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-bee-on-a-flower-41624-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-spider-web-with-dew-drops-41625-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41626-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-computer-at-night-41627-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-woman-using-a-smartphone-41628-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-people-walking-in-a-busy-street-41629-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-cars-moving-on-a-bridge-at-night-41630-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-train-moving-on-the-railway-41631-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-airplane-taking-off-into-the-sky-41632-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-ship-sailing-in-the-ocean-41633-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-rocket-launching-into-space-41634-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-moon-shining-in-the-night-sky-41635-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-sun-rising-over-the-horizon-41636-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-snow-falling-in-a-pine-forest-41637-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-autumn-leaves-falling-from-trees-41638-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-spring-flowers-blooming-41639-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-summer-beach-with-waves-41640-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-desert-sand-dunes-in-the-sun-41641-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-mountain-peak-covered-with-snow-41642-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-river-flowing-through-the-valley-41643-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-lake-water-reflecting-trees-41644-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-green-fields-under-a-blue-sky-41645-large.mp4"
        ];

        const videoUrl = autoVideoLinks[Math.floor(Math.random() * autoVideoLinks.length)];

        await conn.sendMessage(
            from,
            {
                video: { url: videoUrl },
                caption: `🎬 *BAGGA SHER MD SPECIAL*\n🔥 *POWERED BY TIGER MD*`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('BAGA ERROR:', error);
        return reply(`❌ Error aa gaya: ${error.message}`);
    }
});
