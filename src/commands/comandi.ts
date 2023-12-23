import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("comandi")
  .setDescription("Lista comandi");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Cristo!");
}