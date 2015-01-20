var express = require('express')
  , mongoskin = require('mongoskin')
  , bodyParser = require('body-parser')
var router = express.Router();

var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
  
/// While testing with Restclient - set the content-type to post right.
///  "start": "node ./bin/www" - removed from package.json
//// 
 
var db = mongoskin.db('mongodb://xxxxx:yyyyyyy@ds031711.mongolab.com:31711/heroku_app33095594' ,  {safe:true})
//var db = mongoskin.db('mongodb://@localhost:27017/mome' , {safe:true})

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
})

app.get('/', function(req, res, next) {
  res.send('please select a collection, e.g., /collections/messages')
})

app.get('/collections/:collectionName', function(req, res, next) {
  req.collection.find({} ,{limit:10, sort: [['_id',-1]]}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.post('/collections/:collectionName', function(req, res, next) {
     // console.log('Requesttt: %s', req.body.name )
    //  res.send(req.body)

  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

app.put('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.delete('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

//app.listen(3000) commented
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Woooow app listening at http://%s:%s', host, port)
 
})

// module.exports = router;