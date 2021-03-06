module.exports = (client) => {
    client.managers = {
        Giveaway: (data) => new (require("./Giveaway"))(client, data)
    }
}