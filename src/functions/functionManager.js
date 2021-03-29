module.exports = (client) => {
    client.functions = {
        getLeaderboardRank: (userID, type) => require("./getLeaderboardRank")(client, userID, type),
        useItem: (message, data) => require("./useItem")(client, message, data),
        getGang: (id) => require("./getGang")(client, id),
        convert: (arg) => require("./convert")(client, arg),
        roleIncome: (id) => require("./roleIncome")(client, id),
        randomInt: (type, data) => require("./random")(client, type, data),
        getMessages: () => require("./getMessages")(client), 
        findChannel: (guildID, query) => require("./findChannel")(client, guildID, query),
        getGuild: (guildID) => require("./getGuild")(client, guildID),
        getData: (userID) => require("./getData")(client, userID),
        findMember: (message, query) => require("./findMember.js")(client, message, query),
        getStaff: (userID) => require("./getStaff")(client, userID),
        getTimers: () => require("./getTimers")(client),
        findUser: (query, msg) => require("./findUser")(client, query, msg)
    }
}