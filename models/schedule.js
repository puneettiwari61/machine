var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dateFormat = require("dateformat")
var scheduleSchema = new Schema({
  bookingDate:{
    type:String,
    required:true
  },
  time:{
    type:String,
    required:true
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isComplete: {
    type: Boolean,
    default: false,
  }
},{ timestamps:true })


scheduleSchema.pre('save',function(next){
  this.bookingDate = dateFormat(this.bookingDate,'mm dd yy')
  next();
})

module.exports = mongoose.model('Schedule',scheduleSchema);

