module.exports = (client) => {
    client.handlers = {
        slashCommand: (i) => require("./slashCommand")(client, i),
        slashCommandHandler: () => require("./slashCommandHandler")(client),
        staffPresenceTracking: (oldp, newp) => require("./staffPresenceTracking")(client, oldp, newp),
        rubenBTS: (oldp, newp) => require("./RubenBTS")(client, oldp, newp),
        newMember: (member) => require("./newMember")(client, member),
        fetchGiveaways: () => require("./fetchGiveaways")(client),
        staffMessageTracking: (m) => require("./staffMessageTracking")(client, m),
        loadCommands: () => require("./loadCommands")(client),
        commandHandler: (m) => require("./commandHandler")(client, m),
        error: (err) => require("./error")(client, err),
        requestHandler: (message, args, command, sendMessage = true) => require("./requestHandler")(client, message, args, command, sendMessage)
    }
}