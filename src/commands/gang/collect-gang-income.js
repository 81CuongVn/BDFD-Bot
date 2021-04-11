module.exports = {
    name: "collect-gang-income",
    cooldown: 86400000,
    category: "gangs",
    description: "Collect part of gang income",
    execute: async (client, message, args) => {
        const data = client.functions.getData(message.author.id)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("RED")
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            dynamic: true
        }))
        
        if (!data.gang) return message.channel.send(embed.setDescription(`You have to be in a gang to use this command.`)), message.deleteCooldown()
        
        await client.api.channels(message.channel.id).typing.post()
        
        let net = 0n
        
        const gangs = client.db.get("gangs")
        
        const gang = gangs.find(w => w.members[message.author.id])
        
        if (!gang) return message.channel.send(embed.setDescription(`Unknown gang.`)), message.deleteCooldown()
        
        Object.keys(gang.members).map(id => {
            if (id === "325663449680052227") return 
            const d = client.functions.getData(id)
            net += (BigInt(d.money) + BigInt(d.bank))
        })
        
        client.gangs_net.set(gang.owner_id, net)
        
        net = net * 1n / (50n ** BigInt(Object.keys(gang.members).length))
        
        if (net < 1n) net = 0n 
        
        embed.setColor("GREEN")
        embed.setTitle(`${gang.name} Income Collected!`)
        embed.setDescription(`You have collected <:bdfd_coin:766607515445231637>${net.shorten()}.`)
        
        data.money = (BigInt(data.money) + net).toString()
        
        client.db.set(`data_${message.author.id}`, data)
        
        message.channel.send(embed)
    }
}