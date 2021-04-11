module.exports = (client, userID, type = "total") => {
    let top;
    
    const all = client
    .db
    .all()
    .filter(data => data.ID.startsWith("data_")).map(data => {
        const d = JSON.parse(data.data)
        return {
            data: d,
            ID: data.ID,
            user_id: data.ID.split("_")[1],
            money: Number(d.money),
            bank: Number(d.bank)
        }
    })
    .sort((x, y) => {
        if (type === "money") return y.money - x.money
        else if (type === "bank") return y.bank - x.bank
        else return (y.bank + y.money) - (x.bank + x.money)
    })
    
    return {
        position: top, 
        array: all 
    }
}