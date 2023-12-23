import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { SERVER_ISMAIL } from "./utils/constants";
import {
    newGuildInstallation,
    getAllGuilds
} from "./mongodb/guilds";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {

    // Redeploy all commands
    deployCommandsForAllRegisteredGuilds();

    console.log("\tIsmailBot started");
});


client.on("guildCreate", async (guild) => {
    newGuildInstallation({ guildId: guild.id, guildName: guild.name });
    deployCommands({ guildId: guild.id });
});


client.on(`guildMemberAdd`, async member => {
	//await member.guild.channels.get(`847843183345926155`).send(`<@${member.id}>, benvenuto testa del cazzo`);
});


client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);



// Functions

async function deployCommandsForAllRegisteredGuilds(): Promise<void> {
    const registeredGuilds = await getAllGuilds();
    for (const guild of registeredGuilds) {
        deployCommands({ guildId: guild.guildId });
    }
}