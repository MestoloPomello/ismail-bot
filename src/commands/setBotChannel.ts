import { ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { setBotChannel } from "../mongodb/guilds";

export const data = new SlashCommandBuilder()
  .setName("setbotchannel")
  .setDescription("Imposta il canale del bot")
  .addStringOption(option =>
    option
      .setName('channelId')
      .setDescription('Il canale da impostare')
      .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {

  if (!interaction.guild) {
    return interaction.reply("Guarda che devo essere in un server");
  }

  if (interaction.guild.channels.cache.get(interaction.options.getString("channelId") || "")) {
    setBotChannel(interaction.guild.id, interaction.options.getString("channelId") || "");
    return interaction.reply("Bene ora mi approprio di quel canale di merda!");
  } else {
    return interaction.reply("Ma questo canale non esiste!");
  }

    
}