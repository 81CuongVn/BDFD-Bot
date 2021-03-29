const Discord = require("discord.js")
const cooldowns = new Discord.Collection()

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
    
    if (command.nsfw && !message.channel.nsfw) {
        if (sendMessage) {
            message.channel.send(":x: Cannot use this here")
        }
        return false
    }
    
    if (command.mod) {
        if (!(client.guilds.cache.get("566363823137882154").members.cache.get(message.author.id) || message.member).roles.cache.has(client.utils.staff_roles.moderator)) {
            if (sendMessage) {
                message.channel.send(error, undefined, 64)
            }
            
            return false
        }
    }
    
    if (command.staff) {
        if (!Object.values(client.utils.staff_roles).some(id => (client.guilds.cache.get("566363823137882154").members.cache.get(message.author.id) || message.member).roles.cache.has(id))) {
            if (sendMessage) {
                message.channel.send(error, undefined, 64)
            }
            
            return false
        }
    }
    
    if (command.category === "economy" && client.bjs && client.bjs.has(message.member.id)) {
        return false
    }
    
    if (command.category=== "economy" && client.blacklist.has(message.member.id)) {
        if (sendMessage) message.channel.send(`:x: You are blacklisted from using economy commands.`)
        return false 
    }
    
    if (command.channels && !command.channels.some(id => id === message.channel.id) && sendMessage) {
        message.channel.send(`:x: This command can only be used in ${command.channels.map(id => `<#${id}>`).join(", ")}`, undefined, 64)
        return false
    }
    
    if (command.args && args.length < command.args && sendMessage) {
        message.channel.send(`${message.author} you're missing the \`${command.fields[args.length]}\` argument.\n**__Usage(s)__**:\`\`\`\n${command.usages.map(us => `${client.prefix}${command.name} ${us}`).join("\n") || "none given"}\`\`\`**__Example(s)__**:\`\`\`\n${command.examples.map(ex => `${client.prefix}${command.name} ${ex}`).join("\n") || "none given"}\`\`\`${command.info ? `\n**__Additional Info__**: ${command.info}` : ""}`, undefined, 64)
        
        return false
    }
    
    if (command.cooldown && sendMessage) {
        const id = `${command.name}_${message.author.id}`
        
        const cd = cooldowns.get(id)
        
        if (cd) {
            const embed = new client.discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
            .setFooter(`Neko Anti-spam system 2.0`, client.neko.nekos())
            .setTitle(`Cooldown Error`)
            .setDescription(`You will be able to use \`${command.name}\` again in \`${client.utils.dates.parseMS(command.cooldown - (Date.now() - cd)).array(true).join(" ")}\`.`)
            message.channel.send(embed)
            return false
        } else {
            cooldowns.set(id, Date.now())
            setTimeout(() => cooldowns.delete(id), command.cooldown - 1000)
        }
    }
    
    return true
}