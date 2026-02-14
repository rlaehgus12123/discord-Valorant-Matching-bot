const { Client, GatewayIntentBits, Collection } = require("discord.js");
const config = require("./config.json");

const { initDB } = require("./database/db");
const { startScheduler } = require("./systems/scheduler");

const createMatch = require("./commands/createMatch");
const join = require("./commands/join");
const tier = require("./commands/tier");

const handleButtons = require("./interactions/buttons");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection();
client.commands.set("내전생성", createMatch);
client.commands.set("참가", join);
client.commands.set("티어설정", tier);

client.once("ready", () => {
  console.log("봇 온라인");
  initDB();
  startScheduler(client);
});

client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (cmd) await cmd(interaction);
  }

  if (interaction.isButton()) {
    handleButtons(interaction, client);
  }
});

client.login(config.token);