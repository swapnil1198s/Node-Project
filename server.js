const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;  
//var url = "mongodb://localhost:27017/ MongoDatabase"; 
const insertMod = require('./insert');


app.use(bodyParser.urlencoded({ extended: false}));


//*******Get requests********//

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/static/index.html');
});

app.get('/coach', (req,res)=>{
    res.sendFile(__dirname + '/static/coach.html');
    
})

app.get('/admin', (req,res)=>{
    res.sendFile(__dirname + '/static/admin.html');
})

app.get('/searchPlayer', (req, res)=>{
    //console.log(req.query);
    var url = "mongodb://localhost:27017/ MongoDatabase"; 
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("coachesAndPlayers");
        dbo.collection("players").find(req.query, {_id:0, name:1, sport:1, team:1, effeciency:1}).toArray(function(err, results){
            if(err) throw err;
            if(results == undefined){
                res.end("No match found");
            }else{
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write("<h1 style='color:maroon;'>Search Results (Most to least effecient player):</h1>");
                res.write("<div style='background-color: skyblue;padding:2px;'><hr>");
                results.sort(function(a,b){return b.effeciency - a.effeciency});  //In order of most effecient to least effecient
                results.forEach(function(result){
                    //convert the object to string for writing to HTML
                    let objStr = "Name: " + result.name + " | " + "Sport: " + result.sport + " |  " + "Effeciency Rating: " + result.effeciency + "  |  " + "Team: " + result.team;
                    //Add this to our result page
                    res.write('<h3>'+objStr + '</h3><hr>');
                })
                res.write("</div>");
                res.end();
            }
        });
    });
})

app.get('/bulls', (req,res)=>{
    res.sendFile(__dirname + '/static/bulls.html');
});

app.get('/warriors', (req,res)=>{
    res.sendFile(__dirname + '/static/warriors.html');
});

app.get('/wind', (req,res)=>{
    res.sendFile(__dirname + '/static/wind.html');
})

app.get('/lightning', (req,res)=>{
    res.sendFile(__dirname + '/static/lightning.html');
})

//******Post requests*********//

app.post('/selected', (req,res)=>{
    let userType = req.body.userType;
    if(userType == "coach"){
        res.redirect('/coach');
    }
    else{
        res.redirect('/admin');
    }
});

app.post('/addPlayer', (req,res)=>{
    var team = req.body.team;
    var name = req.body.name;
    var effeciency = req.body.effeciency;
    var sport = req.body.sport;
    var player = {name, sport, effeciency,team};

    insertMod.insertRecord(player); //insert the player information in the coachesAndPlayers database
    res.redirect('/' + team); 
    res.end();
});

app.post('/teamSelected', (req,res)=>{
    let team = req.body.team;
    res.redirect('/'+team);
})

const port = 8000;
app.listen(port, () => console.log('This app is running on port ' + port));