module.exports = (client) => {
    const data = client.deep({...client.utils.variables.timers}, (client.db.get(`timers`) || {}))
    
    data.save = () => {
        const obj = {}
        
        Object.keys(client.utils.variables.timers).map(key => obj[key] = data[key])
        
        client.db.set(`timers`, obj)
        return data
    }
    
    return data
}