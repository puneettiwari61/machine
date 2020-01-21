var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
  date:{
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
  }
},{ timestamps:true })

module.exports = mongoose.model('Schedule',scheduleSchema);

