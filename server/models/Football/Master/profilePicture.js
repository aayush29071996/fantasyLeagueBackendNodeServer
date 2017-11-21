
var mongoose = require('mongoose');
var profilePictureSchema = new mongoose.Schema({

    username:{type:String, required:true },
    type: {
        type: String,
        enum: ['image', 'audio', 'video', 'file'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    viewport: {
        type: String,
        enum: ['desktop', 'mobile'],
        default: 'mobile'
    }
});

module.exports = mongoose.model('profilePicture', profilePictureSchema);

