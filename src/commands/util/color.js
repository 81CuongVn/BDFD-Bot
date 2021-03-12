const canvas = require("canvas")

module.exports = {
    name: "color",
    description: "return hex color in image",
    category: "util",
    args: 1,
    fields: ["hex"],
    examples: ["ff0000"],
    usages: ["<hex> <hex> ..."],
    staff: true,
    execute: async (client, message, args) => {
        const embed = new client.discord.MessageEmbed()
        
        for (const arg of args) {
        const c = await canvas.createCanvas(100, 100)
        
        const ctx = c.getContext("2d")
        
        ctx.fillStyle = args.includes("#") ? arg : "#" + arg
        
        ctx.fillRect(0, 0, 100, 100)
        
        const attachment = new client.discord.MessageAttachment(c.toBuffer(), arg + ".png")
        
        embed.attachFiles(attachment)
        }
        
        message.channel.send(undefined, {
            files: embed.files
        })
    }
}