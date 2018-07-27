const app = require('express')();
const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
app.use(cors());
const assert = require('assert');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = 'mongodb://127.0.0.1:27017';

MongoClient.connect(url, { useNewUrlParser : true } ,(err, client) =>{
    assert.equal(null, err);
    console.log('connected to db');
    const dbName = 'myproject';
    const dbase = client.db(dbName);

    app.listen(3001, function() {
        console.log('listening on 3001');
    });


    app.post('/name/add', (req, res, next) => {
        var name = {
            first_name : req.body.first_name,
            last_name : req.body.last_name
        };

        dbase.collection("name").save(name, (err, result) => {
            if(err) console.log(err) ;

            res.send('name added successfully');
        });
    });

    app.get('/name', (req, res) =>{
        dbase.collection('name').find().toArray( (err, result) => {
            res.send(result)
        });
    });

    app.get('/name/:id', (req, res, next) =>{
        if (err) throw err;
        
        let id = ObjectID(req.params.id);
        dbase.collection('name').find(id).toArray( (err, result) =>{
            if (err) throw err;

            res.send(result);
        });
    });

    app.put('/name/update/:id', (req, res, next) =>{
        var id ={ 
            _id : new ObjectID(req.params.id) 
        };

        dbase.collection("name").update( id, {$set:{'first_name': req.body.first_name, 'last_name': req.body.last_name}}, (err, result) => {
                if (err) throw err;
        
            res.send('user updated successfully');        
        });
    });

    app.delete('/name/delete/:id', (req, res, next) => {
        let id = ObjectID(req.params.id);
    
        dbase.collection('name').deleteOne({_id : id } , (err, result) => {
          if(err) {
            throw err;
          }
    
          res.send('user deleted');
        });
     });
});