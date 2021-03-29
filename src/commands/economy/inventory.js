module.exports = {
    name: "inventory",
    description: "show your items",
    category: "economy",
    cooldown: 5000,
    aliases: ["inv"],
    execute: async (client, message, args) => {
        const data = client.functions.getData(message.member.id)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setDescription(Object.entries(data.inventory).map((x, id) => `${x[0]} - ${x[1]}`).join("\n") || "No items")
        
        message.channel.send(embed)
    }
}