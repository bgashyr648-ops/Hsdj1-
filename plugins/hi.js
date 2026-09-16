const { cmd } = require('../command');

// 1. .morning Command (50 Sad Shayari)
cmd({
    pattern: "morning",
    desc: "Sends 50 deep sad morning poetry",
    category: "general",
    react: "🥀",
    filename: __filename,
    use: ".morning"
}, async (conn, mek, m, { reply }) => {
    const quotes = [
        "Subah ka sooraj bhi unke liye nikalta hai, jinki zindagi mein abhi bhi koi umeed baki ho.",
        "Ankh khulte hi unki yaad aana, aur phir din bhar ka wahi dard, yehi ab subah ka dastoor ban gaya hai.",
        "Subah ki pehli kiran jab khidki par padti hai, toh bas unka chhod kar jana yaad aata hai.",
        "Raat kat jati hai kisi tarah aansuon mein, par ye subah ka waqt aur bhi zyada saza lagta hai.",
        "Kismat walo ki subah khushiyon se hoti hai, hamari subah toh bas unke intezar mein dhal jati hai.",
        "Subah subah phone utha kar dekhna ki shayad unka koi msg aaya ho, aur phir wahi khali screen dekh kar rona.",
        "Subah ka sooraj bhi gawah hai ki humne kitni raatein unki yaad mein ro kar guzaari hain.",
        "Bina unke ye subah bilkul adhoori lagti hai, jaise jism se rooh nikal gayi ho.",
        "Subah ki hawa jab dil ko chu kar guzarti hai, toh unke diye zakhm fir se hare ho jate hain.",
        "Subah ka waqt ho ya sham ka, ab toh har pal unhi ki kami mehsoos hoti hai.",
        "Uthte hi jiska chehra sabse pehle yaad aaye, uska door chale jana hi sabse badi saza hai.",
        "Subah ki roshni mein bhi andhera sa lagta hai, jab apne hi paraye ho jayein.",
        "Neend khulti hai toh lagta hai wo paas honge, par haqiqat phir rula deti hai.",
        "Subah ka pehla chai ka cup aur unke sath bitaye lamhe, ab bas yaadein ban kar reh gaye hain.",
        "Har subah ye soch kar aankh khulti hai ki shayad aaj sab theek ho jaye, par wahi dard milta hai.",
        "Subah ki khamoshi bhi ab cheekh kar unka naam leti hai.",
        "Humne toh subah ka sooraj bhi unhi ke naam kiya tha, par wo kisi aur ke ho gaye.",
        "Subah ki dhoop bhi ab sard lagti hai, jab dil mein apno ki di hui thandak ho.",
        "Roj subah khud ko yeh keh kar samjhate hain ki sab theek ho jayega, par dil nahi manta.",
        "Subah ka aaghaz hi jab rone se ho, toh poora din kaisa guzrega ye kehne ki zaroorat nahi.",
        "Kayi subah aisi bhi aati hain jinka koi ant nahi hota, bas dard hota hai.",
        "Subah ki pehli dua mein bhi unhi ka naam hota hai, jo ab hamare naseeb mein nahi.",
        "Aankh khulte hi tera khayal aana, ye batata hai ki hum tujhse kitna hare hain.",
        "Subah ke is waqt mein bhi tera intezar karna meri sabse badi kamzori ban gayi hai.",
        "Waqt badal gaya, log badal gaye, par hamari subah aaj bhi unhi ke intezar se shuru hoti hai.",
        "Subah ki pehli kiran dekh kar dil yeh kehta hai ki tu laut kar aayega.",
        "Kitni ajeeb subah hai ye, jisme sans toh hai par zindagi nahi.",
        "Subah ki umeed bhi ab dam tod chuki hai, bas akelapan reh gaya hai.",
        "Har subah ek naya zakhm le kar aati hai, aur hum chupchap seh lete hain.",
        "Subah ka sooraj bhi hum par hasta hai, ki dekh tu aaj bhi akela hai.",
        "Apni hi tanhai se ab dar lagne laga hai, jab subah bhi bina aawaz ke guzar jaye.",
        "Subah ki pehli dhoop mein bhi unki yaadon ke saaye nazar aate hain.",
        "Dil chahta hai ki subah hi na ho, kam az kam sapno mein toh wo paas hote hain.",
        "Subah ke sannate mein sirf dil ke tutne ki aawaz sunai deti hai.",
        "Wo jo subah ki pehli khushi hua karte the, ab wahi sabse bada dukh hain.",
        "Subah ki shuruat agar rone se ho, toh socho din kitna bhari guzrega.",
        "Jinko subah ka pehla paigam bheja karte the, aaj unka rasta takna padta hai.",
        "Subah ki hawa bhi poochti hai ki kahan gaya wo shakhs jo tumhe hasta dekhna chahta tha.",
        "Bikhar chuke hain hum is kadar, ki ab subah ka sooraj bhi hume samet nahi pata.",
        "Subah ka pehla pal aur unki bewafai, dono hamesha yaad rehte hain.",
        "Kitna mushkil hota hai us subah ka samna karna, jiske baad koi kal na ho.",
        "Subah ki roshni ankhon ko chubhti hai, kyunki andhere mein rona aadat ban gayi hai.",
        "Apni hi parchai se ab darr lagta hai, subah hote hi yeh bhi poonchti hai ki wo kahan hai.",
        "Subah ki chai bhi ab kadwi lagti hai, jab yaad mein unke aansu mil jayein.",
        "Har subah ek nayi jung hoti hai, khud ko zinda sabit karne ki.",
        "Subah ka sooraj uthata hai duniya ko, aur hume hamari tanhai yaad dilata hai.",
        "Tere bina ye subah bhi kisi shaam se kam nahi lagti.",
        "Subah ki pehli aahat par dil dhak se reh jata hai, ki shayad wahi ho.",
        "Khuda kare aisi subah kisi ko na mile, jisme apno ka saya bhi na ho.",
        "Zindagi ruk si gayi hai us mod par, jahan se har subah bas dard shuru hota hai."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    let msg = `┏━━━ 🥀 *TIGER MD* 🥀 ━━━┓\n\n`;
    msg += `🖤 *SAD MORNING*\n`;
    msg += `💬 "${randomQuote}"\n\n`;
    msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
    msg += `🔥 *DEVELOPER : BAGGA SHER MD*`;

    return await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
});

// 2. .night Command (50 Sad Shayari)
cmd({
    pattern: "night",
    desc: "Sends 50 deep sad night poetry",
    category: "general",
    react: "🖤",
    filename: __filename,
    use: ".night"
}, async (conn, mek, m, { reply }) => {
    const quotes = [
        "Raat ki tanhai mein jab dil rota hai, tab samajh aata hai ki dard kya hota hai.",
        "Sote wo hain jinhe kisi ki yaad nahi satati, hum toh raaton ko bas karwatein badalte hain.",
        "Chand aur taare bhi hum par haste hain, ki dekho ye akela fir se ro raha hai.",
        "Raat ka andhera jitna gehra hota hai, unki yaadein utni hi tez hone lagti hain.",
        "Har raat bas yahi dua hoti hai ki subah na ho, kyunki neend mein wo mil toh jaate hain.",
        "Raat ke 2 baje unka last seen dekhna aur chupchap ro kar so jana, yehi hamari kismat hai.",
        "Is andheri raat mein humare aansu ponchne wala koi nahi hota.",
        "Raat ki khamoshi mein dil ki aawaz sirf wahi sun sakta tha jo ab door chala gaya.",
        "Bikhar gaye hain hum is raat ki tarah, koi sametne wala bhi nahi bacha.",
        "Raat ke sannaate mein purani chats padhna aur akele muskurana, phir rona.",
        "Kitni lambi hoti hai ye raatein jab dil mein kisi ke liye bepanah dard ho.",
        "Raat bhar jagne ki saza sirf wahi janta hai jisne kisi ko khoya ho.",
        "Aasmaan ka chand bhi chup ho jata hai jab hamari siskiyan nikalती hain.",
        "Raat ka har ek pal ek saal jaisa lagta hai jab wo sath na ho.",
        "Neend aankhon se rooth chuki hai, aur yaadein jaan liye ja rahi hain.",
        "Raat ke andhere mein apni hi cheekhon ko daba kar rona padta hai.",
        "Koi pooch le agar ki kyu jagte ho raat bhar, toh jawab mein bas muskurana padta hai.",
        "Yeh raat hai ya koi imtihaan, jo khatam hone ka naam hi nahi leti.",
        "Raat ke is pehar mein bas unka ek msg aa jaye, yehi aakhri khwahish hoti hai.",
        "Bina unke ye raat kaatna kisi saza se kam nahi lagta.",
        "Raat ki thandi hawa bhi ab jism ko nahi, rooh ko jala deti hai.",
        "Har raat yehi lagta hai ki subah tak shayad hum bhi na bachein.",
        "Raat ke andhere mein chupaye hue aansu subah tak khul kar samne aa jate hain.",
        "Dil kehta hai unhe yaad na karo, par ye raat unhi ke naam ho jati hai.",
        "Raat bhar taaron se baatein karna aur unse puchna ki wo kahan hai.",
        "Kitna ajab dastoor hai is raat ka, neend aati nahi aur wo jaate nahi.",
        "Raat ke sannaate mein jab koi apna ghair lagne lage, toh jeene ka dil nahi karta.",
        "Humne to raat ko bhi din jaisa roshan kiya tha unki yaadon se, par unhone andhera kar diya.",
        "Raat ke is andhere mein khud ko akela pa kar dil baith jata hai.",
        "Kaash ki ye raat kabhi khatam hi na ho, kyunki subah hote hi haqiqat rula deti hai.",
        "Raat ke saaye mein bhi unhi ka chehra nazar aata hai.",
        "Sone ki koshish mein jab ghanto guzar jayein, tab dard ka ehsaas hota hai.",
        "Raat ki tanhai humse hamari hasi bhi chheen chuki hai.",
        "Har raat ek naye dard ki shuruat hoti hai.",
        "Raat ke waqt mobile ki screen bar bar on karna ki shayad unka msg aaya ho.",
        "Yeh andheri raat aur yeh hamara tuta hua dil, dono ki kahani ek jaisi hai.",
        "Raat ke andhere mein dard likhna aur subah unhe mita dena.",
        "Kitna kuch kehna hota hai unse, par ye raat sirf rula kar reh jati hai.",
        "Raat ki gehrai mein utrte hi saansein rukne lagti hain.",
        "Apne hi ghar mein paraye ho gaye hain, jab se unhone raat ko baat karni chhod di.",
        "Raat ke sannaate mein dil ki dhadkan bhi shor machane lagti hai.",
        "Wo chain se so rahe hain apni duniya mein, aur yahan hamari raat barbaad hai.",
        "Raat ka har ek ghanta ekzakht zakhm de kar jata hai.",
        "Is raat ko gawaah bana kar humne sirf unhe yaad kiya hai.",
        "Raat ki roshni (chand ki) bhi ab hume zakhm lagti hai.",
        "Kismat ne aisi raat di hai jiska koi savera nahi.",
        "Raat bhar rote rote subah kab ho jati hai pata hi nahi chalta.",
        "Dil ka bojh utar nahi pata, chahe poori raat ansuon mein nikal jaye.",
        "Yeh raat sirf unki yaadon ki qaid ban kar reh gayi hai.",
        "Zindagi ka sabse bada sach yahi hai ki raat akeli hi kaatni padti hai."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    let msg = `┏━━━ 🖤 *TIGER MD* 🖤 ━━━┓\n\n`;
    msg += `🥀 *SAD NIGHT*\n`;
    msg += `💬 "${randomQuote}"\n\n`;
    msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
    msg += `🔥 *DEVELOPER : BAGGA SHER MD*`;

    return await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
});

// 3. .hello Command (50 Sad Shayari)
cmd({
    pattern: "hello",
    desc: "Sends 50 deep sad hello poetry",
    category: "general",
    react: "🖤",
    filename: __filename,
    use: ".hello"
}, async (conn, mek, m, { reply }) => {
    const quotes = [
        "Hello kehne se shuru hoti thi jo baat, aaj wo 'kaise ho' tak bhi nahi pahunchti.",
        "Ek 'hello' sunne ke liye taras gaye hain hum, jo kabhi ghanto baatein kiya karte the.",
        "Jab samne wala 'hello' keh kar bhi anjaan ban jaye, toh dil toot jata hai.",
        "Tera wo pehla 'hello' aaj bhi mere kaano mein goonjta hai.",
        "Hello kehna ab ek rasam ban gayi hai, jisme na koi pyaar hai na apna pan.",
        "Kisi ko 'hello' bhejna aur uske reply ka ghanto intezar karna hi sabse bada dard hai.",
        "Wo 'hello' jo kabhi chehre par muskan lata tha, ab rula deta hai.",
        "Ek purane 'hello' par click karke bas purani yaadein padhte rehte hain.",
        "Hello kehne ki himmat ab bachi nahi, aur khamoshi ab bardaasht hoti nahi.",
        "Jab koi 'hello' ka jawab na de, toh samajh jana chahiye ki ab rasta badal lena hi behtar hai.",
        "Bas ek 'hello' ki doori thi, par darmiyaan faasle sadiyon ke aa gaye.",
        "Hello keh kar haal-chaal puchne wale hi aaj sabse bada gham de gaye.",
        "Wo pehla hello yaad hai jab hum anjaan the, aur aaj sab kuch badal gaya.",
        "Ek 'hello' se shuru hua safar aaj khamoshi par khatam ho gaya.",
        "Jab samne se 'hello' na aaye, toh dil khud hi samajh jata hai ki ab jagah nahi rahi.",
        "Hello likh kar mita dena, yehi hamari roz ki kahani ban gayi hai.",
        "Tera wo pyaara sa hello ab kisi aur ke liye bachta hai.",
        "Ek chhota sa 'hello' bhi ab bardaasht nahi hota, kyunki piche dard bahut hai.",
        "Hello kehne se pehle sochna padta hai ki samne wala kya sochega.",
        "Wo waqt alag tha jab 'hello' par dil khush ho jata tha.",
        "Aaj 'hello' kehna bhi ek ehsaan sa lagta hai.",
        "Kisi ke ek 'hello' ke liye apna sab kuch daav par laga diya.",
        "Hello kehne par jab aage se 'ji boliye' aaye, toh lagta hai paraye ho gaye.",
        "Wo 'hello' sunne ke liye hum aaj bhi tars rahe hain.",
        "Ek simple sa 'hello' bhi zindagi badal sakta hai, ye usne hi sikhaya tha.",
        "Hello likh kar wapas back kar lena, yehi hamara haal hai.",
        "Jab koi 'hello' keh kar bhi door rahe, toh paas hone ka kya fayda.",
        "Tera wo 'hello' mere liye ek aakhri umeed jaisa tha.",
        "Hello kehne ki aadat ne hume andar se tod diya hai.",
        "Ab kisi ko 'hello' kehne se bhi darr lagta hai ki kahin fir se dard na mile.",
        "Ek 'hello' ka msg bhi ab naseeb walon ko milta hai.",
        "Hello keh kar dil ka haal batane ki koshish ki, par samne wale ne ignore kar diya.",
        "Wo din kitne haseen the jab bas ek 'hello' se subah ho jati thi.",
        "Aajkal 'hello' sirf dikhawa ban kar reh gaya hai.",
        "Kisi ka 'hello' padh kar ankhon mein aansu aa jana hi pyaar ki asli saza hai.",
        "Hello kehne se darte hain ki kahin wo fir se chhod na de.",
        "Ek chhota sa 'hello' aur uske pichhe chhupa hua samandar barabar dard.",
        "Jab 'hello' ka reply 'hmm' mein aaye, toh dil toot jata hai.",
        "Tera wo andaz se 'hello' kehna aaj bhi yaad hai.",
        "Hello kehne wale hi aaj anjaanon ki tarah guzar jate hain.",
        "Ek 'hello' ki talash mein poori zindagi nikal gayi.",
        "Hello kehne par jab samne wala block kar de, toh duniya veeran lagti hai.",
        "Ab kisi ke 'hello' par yakeen nahi hota, sab dhokha lagta hai.",
        "Wo 'hello' jo dil ko chu jaye, ab kahan milta hai.",
        "Hello keh kar apne dard ko chupana padta hai.",
        "Ek 'hello' ke pichhe kitne aansu chhupe hain, ye koi nahi jaanta.",
        "Jab 'hello' ka jawab na mile, toh khamoshi ko hi jawab maan lena chahiye.",
        "Tera wo 'hello' keh kar muskurana aaj bhi rulata hai.",
        "Hello kehne se shuru hui kahani rone par khatam hui.",
        "Bas ek 'hello' aur sab kuch khatam."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    let msg = `┏━━━ 🖤 *TIGER MD* 🖤 ━━━┓\n\n`;
    msg += `🥀 *SAD HELLO*\n`;
    msg += `💬 "${randomQuote}"\n\n`;
    msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
    msg += `🔥 *DEVELOPER : BAGGA SHER MD*`;

    return await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
});

// 4. .hi Command (50 Sad Shayari)
cmd({
    pattern: "hi",
    desc: "Sends 50 deep sad hi poetry",
    category: "general",
    react: "🥀",
    filename: __filename,
    use: ".hi"
}, async (conn, mek, m, { reply }) => {
    const quotes = [
        "Ek chhota sa 'Hi' aur piche chhupa hua hazaron baaton ka dard.",
        "Hi keh kar baat shuru toh karna chahte hain, par himmat nahi hoti.",
        "Jab samne se 'Hi' ka reply na aaye, toh khud se nafrat hone lagti hai.",
        "Tera wo pehla 'Hi' mere dil par likha hua hai.",
        "Hi kehne par jab samne wala busy hone ka bahana banaye.",
        "Ek 'Hi' ki aas mein poora din nikal jata hai.",
        "Hi likh kar delete kar dena hi hamari rojana ki aadat ban gayi hai.",
        "Wo 'Hi' jo kabhi khushiyan lata tha, ab sirf dard deta hai.",
        "Kisi ke ek 'Hi' ke liye humne kitna intezar kiya hai, ye koi nahi janta.",
        "Hi kehne se dar lagta hai ki kahin wo bura na maan jaye.",
        "Jab 'Hi' ka jawab sirf ek emoji ho, toh dil toot jata hai.",
        "Tera wo andaz se 'Hi' bhejna aaj bhi yaad hai.",
        "Ek simple sa 'Hi' bhi ab naseeb mein nahi raha.",
        "Hi keh kar haal puchna aur badle mein ignore hona.",
        "Wo din jab 'Hi' ke baad ghanto baatein khatam nahi hoti thi.",
        "Aaj 'Hi' kehna bhi ek gunaah jaisa lagता hai.",
        "Kisi ke ek 'Hi' ke intezar mein raat se subah ho jati hai.",
        "Hi likh kar send karne ki taqat ab baaki nahi rahi.",
        "Jab koi 'Hi' keh kar bhi apna na lage.",
        "Tera wo 'Hi' mere liye kisi umeed se kam nahi tha.",
        "Hi kehne ki saza ye mili ki hum akela ho gaye.",
        "Ek 'Hi' aur samne se block ka aana, yehi hamari kismat hai.",
        "Ab kisi ko 'Hi' kehne ki khwahish hi khatam ho chuki hai.",
        "Wo 'Hi' jo dil ko cheer gaya.",
        "Hi keh kar apne aansuon ko chhupana padta hai.",
        "Ek 'Hi' ke pichhe kitne dukh hain, ye bas hum jante hain.",
        "Jab 'Hi' ka jawab ghanto baad aaye, toh baat karne ka dil hi toot jata hai.",
        "Tera wo 'Hi' kehna ab kisi aur ke liye hoga.",
        "Hi kehne wale hi aaj sabse bade ajnabi ban gaye hain.",
        "Ek 'Hi' ki talash mein hum khud ko kho chuke hain.",
        "Hi kehne par jab samne se 'Kaun ho?' aaye, toh rooh kaanp jati hai.",
        "Ab kisi ke 'Hi' par dil nahi phisalta, darr lagta hai.",
        "Wo 'Hi' jo humne pehli baar bheja tha, kaash wo wahi rok lete.",
        "Hi keh kar baat badhane ki koshish, aur samne se khamoshi.",
        "Ek chhota sa 'Hi' aur zindagi ka sabse bada dhokha.",
        "Jab 'Hi' ka jawab cold mile, toh samajh jana chahiye.",
        "Tera wo cute sa 'Hi' ab yaad ban kar rulaata hai.",
        "Hi kehne ki himmat jutane mein hi ghanto lag jate hain.",
        "Ek 'Hi' ke intezar mein aankh lag jati hai.",
        "Hi kehne se shuru hui kahani adhoori reh gayi.",
        "Jab koi 'Hi' keh kar bhi dil se utar jaye.",
        "Tera wo 'Hi' mere liye sab kuch tha, par mere liye kuch nahi.",
        "Hi likhna aur phir sochna ki kya zaroorat hai.",
        "Ek 'Hi' jo kabhi aadat thi, aaj saza ban gayi hai.",
        "Hi kehne par jab samne wala seen karke chhod de.",
        "Ab 'Hi' kehne se bhi dil ghabrata hai.",
        "Wo 'Hi' jo kabhi muskuraane ki wajah tha.",
        "Ek 'Hi' ke intezar mein sab kuch haar gaye.",
        "Hi keh kar khud ko aur zyada dard dena.",
        "Bas ek 'Hi' aur sab kuch khatam."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    let msg = `┏━━━ 🥀 *TIGER MD* 🥀 ━━━┓\n\n`;
    msg += `🖤 *SAD HI*\n`;
    msg += `💬 "${randomQuote}"\n\n`;
    msg += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
    msg += `🔥 *DEVELOPER : BAGGA SHER MD*`;

    return await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
});
