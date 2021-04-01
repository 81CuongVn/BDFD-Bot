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
    ws: {
        intents: [
            "GUILDS", 
            "GUILD_MEMBERS", 
            "GUILD_MESSAGE_REACTIONS",
            "GUILD_EMOJIS", 
            "GUILD_VOICE_STATES", 
            "GUILD_MESSAGES"
        ]
    },
    presence: {
        activity: {
            name: `nekos conquer BDFD server`,
            type: "WATCHING"
        }
    }
})

client.options.restTimeOffset = 250
client.counters = {
    commands: 0,
    events: 0 
}
client.closed = false 
client.cooldowns = new Discord.Collection()

client.rls = new Discord.Collection()
client.gangs_net = new Discord.Collection()

client.os = require("node-os-utils")

client.translate = require("@34r7h/google-translate-api")

client.random = require("random-between")
client.presences = new Discord.Collection()
client.neko = new (require("nekos.best-api"))()
client.nekolife = new (require("nekos.life"))()
client.snipes = new Discord.Collection()
client.esnipes = new Discord.Collection()
client.giveaways = new Discord.Collection()
client.commands = new Discord.Collection()
client.owners = ["739591551155437654"]
client.prefix = config.prefix 
client.blacklist = new Discord.Collection()

client.axios = require("axios")
client.db = require("quick.db")
client.discord = Discord 
client.ms = require("ms")
client.parse = require("parse-ms")
client.fs = require("fs")
client.deep = require("deepmerge")

client.on("messageDelete", (m) => require("./src/events/messageDelete")(client, m))

client.on("messageUpdate", (oldm, newm) => require("./src/events/messageUpdate")(client, oldm, newm))

client.on("message", (m) => require("./src/events/message")(client, m))

client.on("guildMemberAdd", (member) => require("./src/events/guildMemberAdd")(client, member))

client.on("ready", () => require("./src/events/ready")(client))

client.login(config.token)