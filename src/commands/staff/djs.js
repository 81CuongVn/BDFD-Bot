const fetch = require("node-fetch")
const { Client, Message } = require("discord.js");

module.exports = {
    name: "djs",
    aliases: ["docs"],
    args: 1,
    staff: true,
    category: "staff",
    description: "returns discord.js information from the specific query",
    usages: ["<query>"],
    fields: ["query"],
    examples: ["GuildMember"],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const request = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${args.join(".").replace(/#/g, ".")}`).catch(err => null)

        if (!request) return message.channel.send(`Could not find anything`)

        const res = await request.json()

        message.channel.send({
            embed: res
        })
    }
}