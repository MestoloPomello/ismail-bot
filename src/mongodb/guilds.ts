import { CommandInteraction } from 'discord.js';
import { Collection, MongoClient, Document } from 'mongodb';
import {
    DATABASE_NAME,
    collections
} from '../utils/constants';
import { GuildDocument } from '../types/guilds';


if (!process.env.MONGODB_URI) {
    throw new Error("Invalid MONGODB_URI");
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {});
let mongoClient: MongoClient;


/**
 * Retrieves a collection from the MongoDB database.
 *
 * @param {string} collectionName - The name of the collection to retrieve.
 * @return {Promise<Collection<T>>} A promise that resolves to the requested collection.
 */
export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
    if (!mongoClient) {
        mongoClient = await client.connect();
    }
    const db = mongoClient.db(DATABASE_NAME);
    return db.collection(collectionName);
}


/**
 * Inserts a new guild installation document into the database.
 *
 * @param {CommandInteraction} interaction - The command interaction object.
 * @return {Promise<void>} Returns a promise that resolves when the operation is complete.
 */
export async function newGuildInstallation(newGuild: GuildDocument): Promise<void> {
    const collection = await getCollection<GuildDocument>(collections.GUILDS);
    try {
        await collection.insertOne({
            guildId: newGuild.guildId,
            guildName: newGuild.guildName
        } as GuildDocument);
    
        console.log(`[newGuildInstallation] Added guild ${newGuild.guildName} with ID ${newGuild.guildId}`);
    } catch (error) {
        console.error(`[newGuildInstallation] ERROR: Failed to add guild ${newGuild.guildName} with ID ${newGuild.guildId}`);
    }
}


/**
 * Retrieves all guilds from the database.
 *
 * @return {Promise<GuildDocument[]>} An array of guild documents.
 */
export async function getAllGuilds(): Promise<GuildDocument[]> {
    const collection = await getCollection<GuildDocument>(collections.GUILDS);
    return collection.find({}).toArray();
}


/**
 * Sets the bot channel for a guild.
 *
 * @param {string} guildId - The ID of the guild.
 * @param {string} botChannelId - The ID of the bot channel.
 * @return {Promise<void>} A promise that resolves when the bot channel is set.
 */
export async function setBotChannel(guildId: string, botChannelId: string): Promise<void> {
    const collection = await getCollection<GuildDocument>(collections.GUILDS);
    await collection.updateOne({ guildId }, { $set: { botChannelId } });
}