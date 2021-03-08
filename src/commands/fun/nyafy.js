module.exports = {
    name: "nyafy",
    aliases: ["nya"],
    args: 1,
    usages: ["<text>"],
    examples: ["You're cute"],
    fields: ["text"],
    category: "fun",
    description:"Turn your text into cat",
    execute: async (client, message, args) => {
        message.channel.send(args.join(" ").replace(/(l|r)/gi, "w").replace(/o/gi, "u").split(/ +/g).map(word => Math.floor(Math.random() * 100) > 70 ? word + " nya" : word).join(" ") + " nya")
    }
}