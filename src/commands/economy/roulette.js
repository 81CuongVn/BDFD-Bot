module.exports ={
    name: "roulette",
    description: "roulette?",
    args: 2,
    category: "economy",
    fields: ["amount", "color"],
    examples: ["all red", "5e5 black"],
    usages: ["<amount | all>", "color"],
    cooldown: 10000,
    execute: async (client, message, args) => {
        
        message.channel.send(`Soon...`)
    }
}