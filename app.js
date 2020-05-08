//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ =require("lodash");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://MandarMaster:mandar@619@cluster0-vgmw1.mongodb.net/ToDoListApp",{ useNewUrlParser: true,useUnifiedTopology: true });
const todolistAppSchema= new mongoose.Schema({
  listName:String,
  listItems:[{
    itemName:String
  }]
});

const List= mongoose.model("list",todolistAppSchema);

app.get("/",function(req,res){
  res.redirect("/today");
});


app.get("/:listN",function(req,res){
  const currentListName=req.params.listN;

  List.findOne({listName:_.capitalize(currentListName)},function(err,foundItem){
    if(err)
    console.log(err);
  else{
    if(!foundItem){
      const list= new List({
        listName:_.capitalize(currentListName),
        listItems:[{itemName:"Hello"},{itemName:"You can delete this"},{itemName:"By checking this checkox"}]
      });
      list.save();
      res.redirect("/"+_.capitalize(currentListName));
  }
  else
    res.render("list",{listTitle:_.capitalize(currentListName),items:foundItem.listItems});
}



});

  });




  app.post("/",function(req,res){
    const currentListName=req.body.listTitle;
    const toBeInserted= {itemName:req.body.newItem}

    List.findOneAndUpdate({listName:_.capitalize(currentListName)},{ $push: {listItems:toBeInserted} },function(err){
      if(err)
      console.log(err);
      else
      console.log("success");
    });

    res.redirect("/"+_.capitalize(currentListName));
  });


app.post("/delete",function(req,res){
  const toBeDeleted=req.body.checkedItem;
  const listToBeModified=req.body.listCurrent;
  const itemId=req.body.checkedItem;
  List.findOneAndUpdate({listName:_.capitalize(listToBeModified)},{ $pull:{ listItems:{_id:itemId} } },function(err){
    if(err)
      console.log(err);
  });

  res.redirect("/"+_.capitalize(listToBeModified));

});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
