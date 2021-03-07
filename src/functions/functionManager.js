module.exports = (client) => {
    client.functions = {
        findChannel: (guildID, query) => require("./findChannel")(client, guildID, query),
        findMember: (message, query) => require("./findMember.js")(client, message, query),
        getStaff: (userID) => require("./getStaff")(client, userID),
        getTimers: () => require("./getTimers")(client),
        findUser: (query, msg) => require("./findUser")(client, query, msg)
    }
}