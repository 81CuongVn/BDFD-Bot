module.exports = {
    name: "avatar",
    aliases: ["av"],
    fields: ["member"],
    examples: ["Ruben"],
    usages: ["[member]"],
    slash: true,
    description: "Display user avatar",
    category: "util",
    execute: async (client, message, args) => {
        const user = args.length ? await client.functions.findUser(args.join(" "), message) : message.author
        
        if (!user) return message.channel.send(`:x: Could not find any user with given query.`)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Here is ${user.username}'s Avatar:`)
        .setImage(user.displayAvatarURL({
            dynamic: true,
            size: 4096
        }))
        
        message.channel.send(embed).catch(err => null)
    }
}