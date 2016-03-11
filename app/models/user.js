var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
  name: String,
  username: { type: String, required: true, index: { unique: true }},
  password: { type: String, required: true, select: false }
});


//pre save function
//add hash password
UserSchema.pre('save', function(next){
  var user = this;
  //hash password if user new or password has been changed
  if(!user.isModified('password')) return next();
  bcrypt.hash(user.password,null,null, function(err,hash){
    if(err) return next(err);

    user.password = hash;
    console.log("user hash "+ user);
    next();
  });
});


//method to compare given password with db hash
UserSchema.methods.comparePassword= function(password){
  var user = this;
  return bcrypt.compareSync(password,user.password);
}

//return the model
module.exports= mongoose.model('User',UserSchema);
