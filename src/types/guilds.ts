import { Document } from 'mongodb';

/**
 * Represents a Guild Document.
 * @typedef {Object} GuildDocument
 * @property {string} guildId - The ID of the guild.
 * @property {string} guildName - The name of the guild.
 * @property {string=} botChannelId - The ID of the bot channel.
 */
export type GuildDocument = Document & {
    guildId: string;
    guildName: string;
    botChannelId?: string;
}