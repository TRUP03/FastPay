//jshint esversion:6
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Truptee:Truptee123@cluster0.u3q7n.mongodb.net/People_in_bank", {
    useNewUrlParser: true
});

const peopleSchema = new mongoose.Schema({
    name: "string",
    amount:"Number",
    email:"string"
});
const Person = mongoose.model('Person', peopleSchema);

const historySchema = new mongoose.Schema({
    name: "string",
    amount: "Number",
    person_id:"string"
});
const History = mongoose.model('History', historySchema);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/addUser', (req, res) => {
    res.render('user');
});
app.get('/customers', (req, res) => {
    Person.find({},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.render('customers',{people:result});
        }
    });
  
});
app.get('/transaction', (req, res) => {
    Person.find({}, (err, result) => {
        if (err) console.log(err);
        else res.render('transaction', {
            people: result
        });
    });

});

app.post('/history', (req, res) => {
    const name = req.body.name;
    const amount = req.body.amount;
    const person_id = req.body.person_id;
    const his = new History({
        name: name,
        amount: amount,
        person_id:person_id
    });
    his.save();  
    Person.findOne({person_id:person_id},(err, result)=>{
        if(err){
            console.log(err);
        }else{
            Person.updateOne({amount:result.amount},{$set: {amount : result.amount + amount}});
        }
    });
    // })
    res.redirect('/history');
});
app.post('/addUser', (req, res) => {
    const name = req.body.name;
    const amount = req.body.amount;
    const email = req.body.email;
    const person = new Person({
        name: name,
        amount: amount,
        email:email
    });
    person.save(()=>{
        console.log("User Added");
    });
    res.redirect('/customers');
});
app.get('/history', (req, res) => {
    History.find({}, (err, result) => {
        if (err) console.log(err);
        else res.render('history', {
            people: result
        });
    });

});
app.post('/delete/:itemId',(req, res)=>{
   const id = req.params.itemId;
    History.findByIdAndDelete({_id:id},(err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/history');
            console.log('deleted');
        }
    });
});


app.listen(3000, () => {
    console.log("done");
});