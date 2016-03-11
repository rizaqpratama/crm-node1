var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port     = process.env.PORT || 8080;
var User     = require('./app/models/user');

//connect db
mongoose.connect('mongodb://localhost:27017/myCrmDb');



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//add cors support
app.use(function(req,res , next){
  res.setHeader('Access-Control-Allow-Origin',"*");
  res.setHeader('Access-Control-Allow-Methods','GET, POST');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization');
  //continue next midleware chain
  next();
});

//log request
app.use(morgan('dev'));

//ROUTES

app.get('/',function(req,res){
  res.send('Welcome to the home');
});

var apiRouter= express.Router();
//middleware for apirouter request
apiRouter.use(function(req,res,next){
  //log
  console.log('Somebody just came to our app!');
  next(); //remember always call this method on midleware, if not will die!
});

apiRouter.get('/',function(req,res){
  res.json({message:'hoore! selamat datang di api kita'});
});

//user Route
apiRouter.route('/users')
.post(function(req,res){
  var user = new User();
  user.name = req.body.name;
  user.username = req.body.username;
  user.password= req.body.password;
  //save user
  user.save(function(err){
    if(err){
      if(err.code==11000){
        //duplicate entry
        return res.json({message:'A user with that username already exist', success: false});
      }else{
        return res.send(err);
      }
    }
    res.json({message:'User created!'});
  });
})
.get(function(req,res){
  User.find(function(err,users){
    if(err) res.send(err);
    res.json(users);
  })
});


apiRouter.route('/users/:user_id')
.get(function(req,res){
  User.findById(req.params.user_id, function(err,user){
    if(err) res.send(err);
    res.json(user);
  });
})
.put(function(req,res){
  User.findById(req.params.user_id, function(err,user){
    if(err) res.send(err);

    if(req.body.name) user.name= req.body.name;
    if(req.body.username) user.username = req.body.username;
    if(req.body.password) user.password= req.body.password;

    user.save(function(err){
      if(err) res.send(err);
      res.json({message:'User updated!'});
    });
  });
})
.delete(function(req,res){
  User.remove({
    _id : req.params.user_id
  },function(err,user){
    if(err) return res.send(err);
    res.json({message:'Successfully deleted'});
  })
})
;




app.use('/api',apiRouter);

app.listen(port);
console.log('Keajaiban terjadi di port : '+ port);