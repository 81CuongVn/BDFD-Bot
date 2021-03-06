module.exports = {
    name: "end",
    mod: true,
    description: "finishes a giveaway",
    fields: ["messageID"],
    examples: ["858381910669483727"],
    usages: ["[messageID]"],
    category: "giveaway",
    execute:async (client, message, args) => {
        let giveaway 
        
        const giveaways = client.giveaways.filter(g => g.data.channelID === message.channel.id && !g.data.ended)
        
        if (!giveaways.size) return message.channel.send(`There are no giveaways to end in this channel.`)
        
        if (!args.length) {
            giveaway = giveaways.last()
        } else {
            giveaway = giveaways.get(args[0])
        }
        
        if (!giveaway) return message.channel.send(`Could not find any giveaway with this ID`)
        
        if (giveaway.ended) return message.channel.send(`This giveaway has already ended.`)
        
        await message.react("<a:loading:817811225479872512>")
        
        await giveaway.end()
        
        message.reactions.cache.get("817811225479872512").users.remove(client.user.id)
    }
}