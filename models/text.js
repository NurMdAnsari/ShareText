const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const textSchema = new Schema({ 
    text: {type: String, required: true},
    created : {type: Date, default: Date.now},
    important:{type:Boolean,default:false},
    pin:{type:Boolean,default:false},
    hidden:{type:Boolean,default:false}
});

module.exports = mongoose.model('Text', textSchema);