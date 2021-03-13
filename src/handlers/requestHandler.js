module.exports = async (client, message, args, command, sendMessage = true) => {
    const error = `${client.utils.emojis.no_perms} ${message.author} You do not have enough permissions to use this command!`
    
    if (command.category === "developer" && !client.owners.includes(message.author.id)) {
        if (sendMessage) {
            const embed = new client.discord.MessageEmbed()
            .setColor("RED")
            .setTitle(`**Missing Permissions**`)
            .setDescription("Owner only command!")
            
            message.channel.send("", {
                type: 3,
                embed 
            }, 64)
        }
        return false
    }
    
    if (command.mod) {
        if (!message.member.roles.cache.has(client.utils.staff_roles.moderator)) {
            if (sendMessage) {
                message.channel.send(error)
            }
            
            return false
        }
    }
    
    if (command.staff) {
        if (!Object.values(client.utils.staff_roles).some(id => message.member.roles.cache.has(id))) {
            if (sendMessage) {
                message.channel.send(error)
            }
            
            return false
        }
    }
    
    if (command.channels && !command.channels.some(id => id === message.channel.id) && sendMessage) {
        message.channel.send(`:x: This command can only be used in ${command.channels.map(id => `<#${id}>`).join(", ")}`)
        return false
    }
    
    if (command.args && args.length < command.args && sendMessage) {
        message.channel.send(`${message.author} you're missing the \`${command.fields[args.length]}\` argument.\n**__Usage(s)__**:\`\`\`\n${command.usages.map(us => `${client.prefix}${command.name} ${us}`).join("\n") || "none given"}\`\`\`**__Example(s)__**:\`\`\`\n${command.examples.map(ex => `${client.prefix}${command.name} ${ex}`).join("\n") || "none given"}\`\`\``)
        
        return false
    }
    
    return true
}