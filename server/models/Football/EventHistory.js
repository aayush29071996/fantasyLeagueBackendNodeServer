var mongoose = require('mongoose');
Schema = mongoose.Schema;


var EventHistorySchema = new mongoose.Schema({

    eventId:{type:String, unique:true},
    matchId:{type:String, required:true},
    playerId:{type:String},
    position:{type:String,default:"None"},
    eventPoints:{type:Number, default:0},
    playerPoints:{type:Number, default:0},
    createdOn:{type:Date, default:Date.now}


});

var EventHistory = mongoose.model('EventHistory',EventHistorySchema);
module.exports = EventHistory;