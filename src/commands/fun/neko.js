module.exports = {
    name: "neko", 
    description: "returns a neko", 
    category: "fun", 
    execute: async(client, message, args) => {
        const url = client.neko.nekos()
        
        if (Math.floor(Math.random() * 100) > 92) new Promise((res, rej) => {
            client.user.setAvatar(url)
            .then(() => res())
            .catch(() => rej())
            
            setTimeout(() => {
                rej()
            }, 17500)
        })
        
        const embed = new client.discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Here is a neko for ${message.author.username}:`)
        .setImage(url)
        .setFooter(`Powered by nekos.best api ${Math.floor(Math.random() * 100) > 60 ? "| Using this too much may make me~" : ""}`)
        
        message.channel.send(embed)
    }
}