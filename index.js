const axios = require('axios');
const qrcode = require("qrcode-terminal");

const { Client, LocalAuth, MessageMedia} = require("whatsapp-web.js");

//Whatsapp Authentication
//Linux Chrome Path
const client = new Client({
  puppeteer: {
    executablePath: '/usr/bin/google-chrome-stable',
  },
  authStrategy: new LocalAuth()
});

client.initialize();
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});
client.on("authenticated", () => {
  console.log("Auth Completed!");
});
client.on("ready", () => {
  console.log("Bot is ready!");
});


client.on("message", (message) => {
 if (message.body.toLowerCase().includes("/d ")) {
    var download_link = message.body.slice(3);
    if (download_link.includes("http://") || ("https://")) {
      
      message.reply("Downloading, Please Wait...");

		let mimetype;
            (async () => {
              const attachment = await axios.get(download_link, {
                responseType: 'arraybuffer'
              }).then(response => {
                mimetype = response.headers['content-type'];
                return response.data.toString('base64');
              });
              const media = new MessageMedia(mimetype, attachment, 'Downloader', { unsafeMime: true }, { sendMediaAsDocument: true });
              client.sendMessage(message.from, media);
            })();
          }
      else {
        message.reply("Invalid Direct Link! Use https! or http!");
      }
}
});