import { Borrow } from '../models/borrowModel.js'
import {Product} from '../models/productModel.js'
import {Transaction} from '../models/transactionModel.js'

export const home = async (req,res) =>{
    res.json('welcome home')
}

export const add_product = async (req,res,next) =>{
    try{
        const product = await Product.create(req.body)
        res.status(201).json(product)
    }catch(err){
        res.json(err)
    }
}
export const view_products = async (req,res) =>{
    try{
        const products = await Product.find()
        res.status(200).json(products)
    }catch(err){
        res.status(500).json(err)
    }
}

export const view_product = async (req,res) =>{
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
}

export const delete_product = async (req,res) =>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id)
        res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
}

export const edit_product = async (req,res,next) =>{
    try {
        const product = await Product.findByIdAndUpdate(res.params.id,{...req.body
        },{new:true})
        res.json(product)
    } catch (err) {
        res.json(err)
    }
}

export const sale = async (req,res,next) =>{
   try{
        const transaction = await Transaction.insertMany(req.body)
        let body = req.body
        const tq = transaction.map(t=>(t.quantity))
        const tName = transaction.map(t=>(t.productName))
        const product = transaction.map(t => {
            const tr = t
            let tq = t.quantity
            const tName = t.productName
            const p = Product.updateMany({productName:tName},{
                $inc:{pieces: - tq},$push:{transactions: tr}
            })
            .then(r => res.json())
            .catch(err => console.log(err))
        })
        res.json({transaction,product})
    }catch(err){
       next(err)
    }
}


export const transactions = async (req,res,next) =>{
    try{
        const transc = await Transaction.find()
        res.json(transc)
    }catch(err){
        res.json(err)
    }
}
export const transaction = async (req,res,next) =>{
    try{
        const transc = await Transaction.findById(req.params.id)
        res.json(transc)
    }catch(err){
        res.json(err)
    }
}

export const payment = async (req,res,next) =>{
    try {
        const payment = await Transaction.aggregate([
            {$group:{
                "_id": "$payment",
                "count": {"$sum": 1}
            }}
        ])
        res.json(payment)
    } catch (err) {
      next(err)  
    }
}
// stats
export const totalShopAmount = async (req,res,next) => {
    try {
        const totalAmount = await Product.aggregate([
            {"$project": {amount: {$sum:"$amount"}}}
        ])
        res.json(totalAmount)
    } catch (err) {
        res.json(err)
    }
}

export const todayStats = async (req,res,next) =>{
    try {
        const date = new Date()
        const yesterday = new Date(date.setDate(date.getDate() -1))
    
        const today = new Date(date.setDate(date.getDate()))
        
        const todayProducts = await Transaction.find({createdAt:{$gt: yesterday}})

        const total =  await Transaction.aggregate([
            {'$match':{createdAt:{'$gt': yesterday}}},
            {"$project": {
                productName:'$productName',
                amount:'$amount',
        }},
        {$group:{
            _id: '$productName',
            total: {$sum:'$amount'}
        }},
        {$sort: {total:-1}}
        ]) 
        res.json({total,todayProducts})
    } catch (err) {
        next(err)
    }
}

// todo: make the yesterday stats.
// having the problem of returning the docs for yesterday and today
// I just want it to be returning only for today's transactions
export const yesterdayStats = async (req,res,next) =>{
    const date = new Date()
    const yesterday = new Date(date.setDate(date.getDate() -2))
    const today = new Date()

    try {
        const yesterdayProducts = await Transaction.find({createdAt:{$gt:yesterday,$lt:today}})

        // const total =  await Transaction.aggregate([
        //     {'$match':{createdAt:{'$gt': yesterday}}},
        //     {"$project": {
        //         productName:'$productName',
        //         amount:'$amount',
        // }},
        // {$group:{
        //     _id: '$productName',
        //     total: {$sum:'$amount'}
        // }},
        // {$sort: {total:-1}}
        // ]) 
        // res.json({today,yesterday,date})
        res.json({date,yesterday,today,yesterdayProducts})
    } catch (err) {
        res.json(err)
    }
}

export const lastWeek = async (req,res,next) =>{
    try {
        const date = new Date()
        const lastWeek = new Date(date.setDate(date.getDate() -7))
        const stats = await Transaction.aggregate([
            {'$match':{createdAt:{'$lte': lastWeek}}},
            {"$project": {
                month: {$month: '$createdAt'},
                amount:'$amount'
        }},
        {"$group":{
            _id: '$month',
            amount:{$sum:"$amount"}
        }}
        ]) 
        res.json({stats,lastWeek})
    } catch (err) {
        next(err)
    }
}

export const monthlyStats = async (req,res,next) =>{
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1))
    try{
        const stats = await Transaction.aggregate([
            {$match: {createdAt:{$gt:lastYear}}},
            {$project: {month:{$month:'$createdAt'}, amount:"$amount"}},
            {$group: {
                _id: "$month",
                totalSale: {$sum: '$amount'}
            }
        }
        ])  
        res.json({stats})
    }catch(err){
        res.json(err)
    }
}

export const dailyStats = async (req,res,next) =>{
    const date = new Date()
    const day = date.getDate()
    const thisMonth = new Date(date.setDate(date.getDate() - day))
    try{
        const stats = await Transaction.aggregate([
            {$match: {createdAt:{$gt:date}}},
            {$project: {date: {$dayOfMonth:'$createdAt'}, amount:'$amount', productName:'$productName'}},
            {$group:{
                _id: '$date',
                totalSale: {$sum:"$amount"}
            }},
            {$sort: {_id:-1}}
        ])
        res.json({stats})
    }catch(err){
        res.json(err)
    }
}

export const transc = async (req,res,next)=>{
    try {
        const t = await Product.aggregate([
            {$project : {transanctions:1}}
        ])
        res.json(t)
    } catch (err) {
        
    }
}


//! borrow controller 

export const borrow = async (req,res,next) =>{
    try{
        const borrow = await Borrow.insertMany(req.body)
        const body = req.body
            const p = borrow.map(p =>{
            const borrowedProduct = p
            const quantity = p.quantity
            const product = p.product
            const products = Product.updateMany({productName:product},
                {$inc:{pieces: -quantity}, $push:{borrowed:borrowedProduct}})
                .then(r => res.json())
                .catch(err => res.json(err))
            })

        res.json({borrow,p})
    }catch(err){
        res.json(err)
    }
}

export const get_borrows = async (req,res,next) =>{
    try{
        const borrows = await Borrow.find().sort({createdAt: -1})
        res.json(borrows)
    }catch(err){
        res.json(err)
    }
}

export const borrowStats = async (req,res,next) =>{
    const date = new Date()
    const day = date.getDate()
    const thisMonth = new Date(date.setDate(date.getDate() - day))
    try{
        const stats = await Borrow.aggregate([
            {$match: {createdAt:{$gt:date}}},
            {$project: {date: {$dayOfMonth:'$createdAt'}, amount:'$amount', product:'$product',collector:'$collectorName', amount:'$amount',dateCollected:'$createdAt'}},
            {$group:{
                _id: '$date',
                total: {$sum:"$amount"},
                products:{
                    $push:{
                        collector:'$collector',
                        product:'$product',
                        amount:'$amount',
                        collectedOn:'$dateCollected',
                    }
                },
            }},
            {$sort: {_id:-1}}
        ])
        res.json({stats})
    }catch(err){
        res.json(err)
    }
}