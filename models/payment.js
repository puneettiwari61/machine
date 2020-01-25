var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paymentSchema = new Schema({
  paymentDate : {
    type: Date,
    default: new Date()
  },
  userId : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},{ timestamps:true })

module.exports = mongoose.model('Payment', paymentSchema);