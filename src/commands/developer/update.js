module.exports = {
    name: "update",
    description: "update bot commands",
    category: "developer",
    execute: async (client, message, args) => {
        client.handlers.loadCommands()
        
        message.channel.send(`Updated ${client.commands.size} commands`)
    }
}