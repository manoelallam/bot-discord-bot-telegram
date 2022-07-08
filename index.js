import dotenvsafe from "dotenv-safe"
import Discord from "discord.js"
import {Telegraf} from "telegraf"

// compara se todas as variavies de ambiente do .env estão de acordo com o .env.example
dotenvsafe.config()

// Inicializando o bot do telegram
const botTelegram = new Telegraf(process.env.BOT_TOKEN);

// Inicializando a api do discord
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

// criando mensagem para ser exibida ao ligar o bot no servidor do discord em um canal especifico
client.once("ready", () => {
  client.channels.cache.get(process.env.DISCORD_OPS_CHANNEL_ID).send(`bot ligado!`);
})

// Esse metodo recebe as mensagens enviads via chat do discord e verifica se a mesma contem $msg
// para assim poder execultar o que cotem no IF
client.on("message", (msg, member) => {
   if (msg.content.startsWith("$msg ")) {
  		const mensagem = msg.content.split(" ").slice(1,).join(" ")

      msg.reply(mensagem)
      // Timeout setado para o bot do telegram não ser banido, pois o mesmo não pode receber
      // mais de uma mensagem por segundo e mais de 20 mensagens por minuto
      setTimeout(() => {
        // Enviando mensagem para o telegram
        botTelegram.telegram.sendMessage(process.env.CHAT_ID, `${msg.author.username} ${mensagem}`);
      }, "2000")
    }
})

// fazendo login no nosso bot do Discord
client.login(process.env.DISCORD_TOKEN)
