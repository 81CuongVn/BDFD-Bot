module.exports = (client, userID) => {
    const data = client.deep({...client.utils.variables.staff}, (client.db.get(`staff_${userID}`) || {}))
    
    
    data.channels = (sort = false, hideTickets = false) => {
        const total = Object.values(data.messages).reduce((x, y) => x + (hideTickets && y.name.includes("ticket") ? 0 : y.amount), 0)
        
        return Object.entries(data.messages).map(data => {
            const channel = client.channels.cache.get(data[0])
            
            if (hideTickets && (channel || data[1]).name.includes("ticket")) return undefined 
            const count = data[1].amount 
            const percentage = (data[1].amount * 100 / total).toFixed(2) 
            
            if (channel) {
                return {
                    count,
                    percentage,
                    channel
                }
            } else {
                return {
                    count,
                    deleted: true,
                    percentage,
                    channel: {
                        name: data[1].name,
                        id: data[0]
                    }
                }
            }
        }).filter(e => e).sort((x, y) => sort ? y.count - x.count : true)
    }
    
    data.save = () => {
        const obj = {}
        
        Object.keys(client.utils.variables.staff).map(key => obj[key] = data[key])
        
        client.db.set(`staff_${userID}`, obj)
        return data
    }
    
    return data
}