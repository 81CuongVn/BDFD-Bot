module.exports = (client) => {
    client.managers = {
        StaffStatus: () => new (require("./StaffStatus"))(client), 
        Giveaway: (data) => new (require("./Giveaway"))(client, data)
    }
}