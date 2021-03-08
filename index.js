const Discord = require("discord.js")
const config = require("./config.json")

//a cute client
const client = new Discord.Client({
    disableMentions: "everyone",
    fetchAllMembers: true,
    partials: [
        "USER",
        "GUILD_MEMBER",
        "CHANNEL",
        "REACTION",
        "MESSAGE"
    ],
    presence: {
        activity: {
            name: `nekos conquer BDFD server`,
            type: "WATCHING"
        }
    }
})

client.options.restTimeOffset = 0
client.counters = {
    commands: 0,
    events: 0 
}

client.os = require("node-os-utils")

client.presences = new Discord.Collection()
client.neko = new (require("nekos.best-api"))()

client.snipes = new Discord.Collection()
client.esnipes = new Discord.Collection()
client.giveaways = new Discord.Collection()
client.commands = new Discord.Collection()
client.owners = ["739591551155437654", "392609934744748032"]
client.prefix = config.prefix 

client.axios = require("axios")
client.db = require("quick.db")
client.discord = Discord 
client.ms = require("ms")
client.parse = require("parse-ms")
client.fs = require("fs")
client.deep = require("deepmerge")

client.on("messageReactionAdd", (r, u) => require("./src/events/messageReactionAdd")(client, r, u))

client.on("messageDelete", (m) => require("./src/events/messageDelete")(client, m))

client.on("messageUpdate", (oldm, newm) => require("./src/events/messageUpdate")(client, oldm, newm))

client.on("message", (m) => require("./src/events/message")(client, m))

client.on("presenceUpdate", (oldp, newp) => require("./src/events/presenceUpdate")(client, oldp, newp))

client.on("ready", () => require("./src/events/ready")(client))

client.login(config.token)