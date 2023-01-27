import User from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import validator from 'validator'

const singJwt = (id,admin) =>{
    return jwt.sign({id:id,admin:admin},'secret-key')
}

export const add_user = async(req,res,next) =>{
    try {
            const newUser = await User.create(req.body)
            res.status(201).json({newUser})
    } catch (err) {
        if(err.code){
        err.message = 'user alredy existed'
            res.status(500).json({err:err.message})
        }else{
        res.status(500).json({err:err.message})
        }
    }
}

export const login = async(req,res,next) =>{
    try{
        const user = await User.findOne({username:req.body.username})
        if(!user){
            throw Error('no user found')
        }

        if(!req.body.password){
            throw Error('please provide your password')
        }

        if(req.body.password !== user.password){
            throw Error('password did not match')
        }
        const jwt = singJwt(user._id,user.isAdmin)
        res.status(200).json({user,jwt})
    }catch(err){
        res.status(404).json({err: err.message})
    }
}

export const delete_user = async(req,res,next) =>{
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const update_user = async(req,res,next) =>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const users = async (req,res,next) =>{
    try{
        const users = await User.find()
        res.status(200).json(users)
    }catch(err){
        res.json(err)
    }
}