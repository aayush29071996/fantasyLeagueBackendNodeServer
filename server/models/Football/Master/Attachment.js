/*
var mongoose = require('mongoose');
var AttachmentSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Attachment', AttachmentSchema);
*/
