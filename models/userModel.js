import mongoose from 'mongoose'

const user = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: [6,'password must be at least six character']
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
},{timestamp:true})

const User = mongoose.model('User',user)

export default User