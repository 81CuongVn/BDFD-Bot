module.exports = {
    name: "bot-info",
    aliases: ["stats", "statistics"],
    category: "info",
    description: "display bot info",
    execute: async (client, message, args) => {
        const cpu = await client.os.cpu.usage(250)
        
        const embed = new client.discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle(`${client.user.username} Statistics`)
        .setThumbnail(client.user.displayAvatarURL({
            size: 4096
        }))
        .setDescription(`Developer: <@${client.owners[0]}>\nLibrary: discord.js v${client.discord.version}\nMemory: ${(await client.os.mem.info()).usedMemPercentage}%\nDisk: ${(await client.os.drive.used()).usedPercentage}%\nCPU: ${cpu}%\nUsers: ${client.users.cache.size}\nCommands: ${client.commands.size}\nEvents fired: ${client.counters.events}\nCommands used: ${client.counters.commands}\nUptime: ${client.utils.dates.parseMS(client.uptime).array(true).join(" ")}`)
        
        message.channel.send(embed)
    }
}