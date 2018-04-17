const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

MongoClient.connect("mongodb://localhost:27017", function(err, client){
  if(err){
    console.log(err);
    return;
  }

  const db = client.db("football_teams");

  console.log("connected to DB");

  server.post("/api/teams", function(req, res){
    const teamsCollection = db.collection("teams");
    const teamToSave = req.body;

    teamsCollection.save(teamToSave, function(err, result){
      if(err){
        console.log(err);
        res.status(500);
        res.send();
      }

      console.log("Saved to DB");
      res.status(201);
      res.json(teamToSave);
    })
  });

  server.get("/api/teams", function(req,res){
    const teamsCollection = db.collection("teams");
    teamsCollection.find().toArray(function(err, allTeams){
      if(err){
        console.log(err);
        res.status(500);
        res.send();
      }

      res.json(allTeams);

    });
  });

  server.delete("/api/teams", function(req, res){
    const teamsCollection = db.collection("teams");
    const filterObject = {};
    teamsCollection.deleteMany(filterObject,function(err, result){
      if(err){
        console.log(err);
        res.status(500);
        res.send();
      }
      res.status(204);
      res.send();
    })
  })

  server.put("/api/quotes/:id", function(req, res){
    const teamsCollection = db.collection("teams");
    const objectID = ObjectID(req.params.id);
    const filterObject = { _id: objectID };
    const updatedData = req.body;

    teamsCollection.update(filterObject, updatedData, function(err, result){
      if(err){
        console.log(err);
        res.status(500);
        res.send();
      }
      res.status(204);
      res.send();
    });
  });


  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });
});
