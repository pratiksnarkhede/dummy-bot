const { getRandomFacts } = require("allfacts");
const giveMeAJoke = require("discord-jokes");
const { Client, Intents, Permissions, MessageEmbed } = require("discord.js");
var catMe = require("cat-me");
const express = require("express");
const app = express();
const prefix = "!";
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
require("dotenv").config();

app.listen(process.env.PORT || 3000, () => {
  console.log("server started");
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (messageCreate) => {
  client.user.setActivity(`!help`, { type: "PLAYING" }); 
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
  } else if (command === "help") {
    // shows help
    const helpEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Dummy Help")
      .setDescription("My prefix for commands is !")
      .setThumbnail("https://i.imgur.com/r4t0Yve.png")
      .addFields(
        {
          name: "Command",
          value: `
      !help
      !kick @user
      !ping
      !fact
      !joke
      !cat
    `,
          inline: true,
        },
        {
          name: "Utility",
          value: `
      - Display this message
      - Kick users from server
      - Shows ping for message
      - Shows random fact around the world
      - You will see how good is dummy at jokes
      - Shows random ASCII cat 😊
    `,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter("More commands will be added soon.");

    messageCreate.channel.send({ embeds: [helpEmbed] });
  }
});

client.on("messageCreate", (messageCreate) => {
  if (!messageCreate.guild) return;
  if (messageCreate.content.startsWith("!kick")) {
    const user = messageCreate.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = messageCreate.guild.members.resolve(user);
      // check for user permission to kick member
      if (
        messageCreate.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)
      ) {
        // if user is me or dummy
        if (user.discriminator === "7504" || user.discriminator === "4456") {
          messageCreate.reply("Wtf u doing, I can't kick myself");
        }
        // If the member is in the server
        else if (member) {
          member
            .kick()
            .then(() => {
              messageCreate.reply(`Successfully kicked ${user.tag}`);
              console.log(user);
            })
            .catch((err) => {
              messageCreate.reply("That user is a mod/admin, I can't do that.");
              console.error(err);
            });
        } else {
          messageCreate.reply("That user isn't in this guild!");
        }
      } else {
        messageCreate.reply("Nice try, but u dont have permission lol.");
      }
    } else {
      messageCreate.reply("You didn't mention the user to kick!");
    }
  }
});

client.login(process.env.BOT_TOKEN);
