var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var userSchema = new Schema({
  name:{
    type: String,
    required: true,
    trim: true
  },
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password:{
    type: String,
    required: true,
  },
  number: {
    type: Number
  },
  payment: [{
    type: Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  blocked: {
    type: Boolean,
    default: false
  }
},{ timestamps: true})



userSchema.pre('save',function(next){
  if(this.password && this.isModified('password')){
    this.password = bcrypt.hashSync(this.password,10);
  }
  next();
})


userSchema.methods.verifyPassword = function(password){
  return bcrypt.compareSync(password,this.password)
}



module.exports = mongoose.model('User',userSchema);