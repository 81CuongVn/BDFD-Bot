module.exports = (client, guildID) => {
    const d = {
        income_roles: [],
        shop_items: [],
        economy_emoji: "<:bdfd_coin:766607515445231637>",
        cock_fight: {
            start: 50,
            max: 75,
            ratio: 2
        },
        slut: {
            disabled_channels: [],
            fine: {
                type: "percentage",
                value: 10,
            },
            min: {
                type: "number",
                value: 1000
            },
            max: {
                type: "number",
                value: 2000
            },
            fine_ratio: 50,
            replies: [],
            fine_replies: []
        },
        work: {
            disabled_channels: [],
            min: {
                type: "number",
                value: 240
            },
            max: {
                type: "number",
                value: 1000
            },
            replies: []
        },
        rob: {
            fine_ratio: 50,
            fine: {
                value: 10,
                type: "percentage",
            },
            min: {
                type: "percentage",
                value: 10,
            },
            max: {
                type: "percentage",
                value: 15,
            },
            replies: [],
            fine_replies: []
        },
        crime: {
            disabled_channels: [],
            fine: {
                value: 10,
                type: "percentage",
            },
            fine_ratio: 50,
            min: {
                type: "number",
                value: 1000
            },
            max: {
                type: "number",
                value: 2500
            },
            fine_replies: [],
            replies: []
        }
    }
    
    const data = client.db.get(`guild_${guildID}`) || {}
    
    return client.deep(d, data)
}