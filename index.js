const { getRandomFacts } = require("allfacts");
const giveMeAJoke = require("discord-jokes");
// const discord = require("discord.js");
const { Client, Intents } = require('discord.js');
var catMe = require("cat-me");
const express = require("express");
const app = express();
const prefix = "!";
// const client = new discord.Client();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require("dotenv").config();

app.listen(process.env.PORT || 3000, () => {
  console.log("server started");
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (messageCreate) => {
  if (messageCreate.author.bot) return;
  if (!messageCreate.content.startsWith(prefix)) {
    console.log(messageCreate.author);
  }
  const commandBody = messageCreate.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();
  if (command === "ping") {
    const timeTaken = Date.now() - messageCreate.createdTimestamp;
    messageCreate.reply(`Latency of Message = ${timeTaken}ms.`);
  } else if (command === "fact") {
    getRandomFacts().then((fact) => {
      messageCreate.reply(fact[0].name);
    });
  } else if (command === "joke") {
    giveMeAJoke.getRandomDadJoke(function (joke) {
      messageCreate.reply(joke);
    });
  } else if (command === "cat") {
    messageCreate.channel.send(catMe());
  }
  client.user.setPresence({
    status: "online",
    activity: {
      name: "Destiny 2",
      type: "PLAYING",
    },
  });
});

client.on("messageCreate", (messageCreate) => {
  if (!messageCreate.guild) return;
  if (messageCreate.content.startsWith("!kick")) {
    const user = messageCreate.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = messageCreate.guild.members.resolve(user);
      // if user is me or dummy
      if (user.discriminator === "7504" || user.discriminator === "4456") {
        messageCreate.reply("Wtf u doing, I can't kick myself");
      }
      // If the member is in the guild
      else if (member) {
        member
          .kick()
          .then(() => {
            messageCreate.reply(`Successfully kicked ${user.tag}`);
            console.log(user);
          })
          .catch((err) => {
            messageCreate.reply("Looks like you don't have permission");
            console.error(err);
          });
      } else {
        messageCreate.reply("That user isn't in this guild!");
      }
    } else {
      messageCreate.reply("You didn't mention the user to kick!");
    }
  }
});

client.login(process.env.BOT_TOKEN);
