/* Save a given player's data in the players table of the playersAndCoaches database */

module.exports.insertRecord = function(player){
    var MongoClient = require('mongodb').MongoClient;  
    var url = "mongodb://localhost:27017/ MongoDatabase"; 
    MongoClient.connect(url, function(err, client) {  
        if (err) throw err;   
        var db = client.db("coachesAndPlayers");
        db.collection("players").insertOne(player, function(err, res) {  
            if (err) throw err;  
            console.log("One record inserted");   
            client.close();  
        });
    });
};