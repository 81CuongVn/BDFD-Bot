module.exports = {
    name: "neko", 
    description: "returns a neko", 
    category: "fun", 
    execute: async(client, message, args) => {
        const embed = new client.discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Here is a neko for ${message.author.username}:`)
        .setImage(client.neko.nekos())
        .setFooter(`Powered by nekos.best api`)
        
        message.channel.send(embed)
    }
}