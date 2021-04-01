module.exports = {
    name: "flag",
    description: "flag bot to restart",
    category: "developer",
    execute: async (client, message, args) => {
        if (client.closed) {
            client.closed = false
            message.channel.send(`Unflagged`)
        } else {
            message.channel.send(`Flagged`)
            client.closed = true
        }
    }
}