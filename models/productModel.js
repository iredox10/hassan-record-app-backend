import mongoose from 'mongoose'

const product = new mongoose.Schema({
    productName:{
        type: String, 
        required: true,
        unique: true
    },
    quantity:{
        type: Number, 
        required: true,
    },
    pieces:{
        type: Number, 
        required: true,
    },
    piecesAmount:{
        type: Number, 
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    transactions:Array,
    borrowed: Array

},{timestamps:true})

product.pre('save', function(){
    if(this.pieces == 0){
        this.pieces = 0
    }
})
export const Product = mongoose.model('Product', product)