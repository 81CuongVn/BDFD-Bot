module.exports = (client, err) => {
    const channel = client.channels.cache.get(client.utils.channels.errorsChannelID)
    
    if  (!channel) return undefined
    
    const embed = new client.discord.MessageEmbed()
    .setColor("RED")
    .setTitle(`An error occurred`)
    .setDescription(`\`\`\`js\n${require("util").inspect(err)}\`\`\``)
    .setTimestamp()
    
    channel.send(embed).catch(err => null)
}