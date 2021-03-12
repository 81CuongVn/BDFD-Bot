module.exports = async (client, member) => {
    const total = Date.now() - member.user.createdTimestamp
    if (total >= client.ms("14d")) return 
    
    const embed = new client.discord.MessageEmbed()
    .setColor("RED")
    .setAuthor(`${member.user.tag} seems to be an alt`, member.user.displayAvatarURL({dynamic:true}))
    .setDescription(`\`!banid ${member.id} 0 alt\``)
    .setFooter(`Creation Date: ${client.utils.dates.parseMS(total).array(true).join(" ")} ago`)
    .setTimestamp(member.user.createdTimestamp)
    client.channels.cache.get("609163301481480203").send(embed)
}