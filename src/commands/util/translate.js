module.exports = {
    name: "translate",
    description: "translates text to a different language",
    args: 2,
    fields: ["language", "text"],
    usages: ["<language> <text>"],
    examples: ["en hola como estas"],
    category: "util",
    cooldown: 5000,
    execute: async (client, message, args) => {
        const translation = await client.translate(args.slice(1).join(" "), {
            to: args[0].toLowerCase()
        })
        .catch(err => err.message)
        
        const embed = new client.discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        .setColor("RED")
        
        if (typeof translation !== "object") return message.channel.send(embed.setDescription(`Something went wrong!\`\`\`\n${translation}\`\`\``))
        
        embed.setColor("GREEN")
        embed.setTitle(`Translated from \`${translation.from.language.iso}\``)
        embed.setDescription(translation.text)
        
        message.channel.send(embed)
    }
}