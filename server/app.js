const express= require("express");
const app =express();
const cors = require('cors');
app.use(cors());
const client=require('./db/conn.js');
const path=require('path');
const bodyParser= require('body-parser');  /* Body-parser is a middleware used in Node.js to handle incoming request bodies in a middleware before your handlers, available under the req.body property.

It is used to parse the incoming request bodies in a middleware before your handlers, available under the req.body property. This is useful for parsing the content of POST requests, for example when submitting a form or when calling an API. It helps to extract the data from the request body, so it can be easily processed and stored in the database. Without body-parser, you would have to manually parse the request body and extract the data, which is a complex and error-prone process.*/
// app.use(bodyParser.json());

app.use(express.json());   //express.json() doing the same functionality of body-parser
// app.use()
const port =process.env.PORT || 3005; // process.env.PORT when we run online server than it will take care, and on localhost port will take 3000
const static_path = path.join(__dirname,"../src/screens/Home.js");
console.log(static_path);
app.use(express.static(static_path));  
app.use(express.urlencoded({extended:false})) //app.use(express.json()); is able to handle the post request which was sent by postman but it is not enugh to handle the direct requests.


app.get("/users",(req,res)=>{
    console.log(req.body);
    client.query('select * from usersignupdata',(err,resp)=>{
    if(!err){
        console.log(resp.rows);
        res.send(resp.rows);
    }else{
        console.log(err.message);
    }
})
client.end;
})

app.get('/users/:username/:password', (req, res)=>{
    const query = 'SELECT count(*) FROM usersignupdata WHERE username=$1 AND password=$2';
  const values = [req.params.username, req.params.password];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred');
      return;
    }

    if (result.rows[0].count > 0) {
      res.send(result.rows);
    } else {
      res.status(404).send('No matching user found');
    }
  });

})

app.post('/users', (req, res)=> {
    const user = req.body;
    let insertQuery = ` insert into usersignupdata(name,email,username,password) values ('${user.name}','${user.email}','${user.username}', '${user.password}');`;
    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful');
        }
        else{ console.log(err.message) }
    })
    client.end;
})

// app.put('/users/:id', (req, res)=> {
//     let user = req.body;
//     let updateQuery = `update userlogin
//                        set username = '${user.username}',
//                        password = '${user.password}'
//                        where id = ${user.id}`

//     client.query(updateQuery, (err, result)=>{
//         if(!err){
//             res.send('Update was successful')
//         }
//         else{ console.log(err.message) }
//     })
//     client.end;
// })

// app.delete('/users/:id', (req, res)=> {
//     let insertQuery = `delete from userlogin where id=${req.params.id}`

//     client.query(insertQuery, (err, result)=>{
//         if(!err){
//             res.send('Deletion was successful')
//         }
//         else{ console.log(err.message) }
//     })
//     client.end;
// })

app.listen(port,()=>{
    console.log(`server is running on port : ${port}`);
})

app.get("/",(req,res)=>{
    res.send("server started");
})


