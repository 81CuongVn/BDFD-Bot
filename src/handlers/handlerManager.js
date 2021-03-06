module.exports = (client) => {
    client.handlers = {
        staffPresenceTracking: (oldp, newp) => require("./staffPresenceTracking")(client, oldp, newp),
        fetchGiveaways: () => require("./fetchGiveaways")(client),
        staffMessageTracking: (m) => require("./staffMessageTracking")(client, m),
        loadCommands: () => require("./loadCommands")(client),
        commandHandler: (m) => require("./commandHandler")(client, m),
        error: (err) => require("./error")(client, err),
        requestHandler: (message, args, command, sendMessage = true) => require("./requestHandler")(client, message, args, command, sendMessage)
    }
}