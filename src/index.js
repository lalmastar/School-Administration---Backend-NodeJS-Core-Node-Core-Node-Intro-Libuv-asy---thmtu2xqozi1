const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());
// const fs = require('fs');
let studentArray = require('./InitialData');
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

let lastIndex = 8;

app.get('/api/student',(req,res)=>{
    res.json(studentArray);
})

app.get('/api/student/:id',(req,res)=>{
    const {id} = req.params;
    const student = studentArray.find(st => st.id == id);
    if(!student) return res.sendStatus(404);
    return res.json(student);
})

app.post('/api/student',(req,res)=>{
    const {name,currentClass,division} = req.body;
    if(!name || !currentClass || !division) {
        return res.sendStatus(400);
    }
    const id = lastIndex;
    studentArray.push({id,name,currentClass:Number(currentClass),division});
    lastIndex++;
    return res.json({id})
})

app.put('/api/student/:id',(req,res)=> {
    const {id} = req.params;
    let index = studentArray.findIndex(st=>st.id == id);
    if(index === -1) return res.sendStatus(400);
    if(Object.keys(req.body).length === 0) return res.sendStatus(400);
    for(let key in req.body){
        if(key == 'name' || key =='currentClass' || key =="division") continue;
        else return res.sendStatus(400);
    }
    let st = studentArray[index];
    // console.log(st);
    studentArray[index] = {...st,...req.body};
    if(req.body.currentClass) studentArray[index].currentClass = Number(studentArray[index].currentClass);
    return res.json(studentArray[index]);
})

app.delete('/api/student/:id',(req,res)=> {
    const {id} = req.params;
    const index = studentArray.findIndex(st=>st.id==id);
    // console.log(index);
    if(index === -1) return res.sendStatus(404);
    // const student = studentArray[index];
    studentArray.splice(index,1);
    // delete studentArray[index];
    res.sendStatus(200);
})



app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   
