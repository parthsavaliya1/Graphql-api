const mongoose = require('mongoose');


const QuoteSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    
    by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

mongoose.model('Quotes',QuoteSchema)