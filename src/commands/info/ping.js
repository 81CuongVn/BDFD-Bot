module.exports = {
    name: "ping",
    description: "returns bot latency",
    category: "info",
    execute: async (client, message, args) => {
        const m = await message.channel.send(`Pinging...`)
        
        m.edit(`Pong! ${m.createdTimestamp - message.createdTimestamp}ms`)
    }
}