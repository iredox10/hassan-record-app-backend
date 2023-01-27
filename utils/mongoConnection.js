import mongoose from 'mongoose'

const mongoConnection = async () => {
    try{
       const mongo = await mongoose.connect(
         process.env.MONGO_URL_LOCAL
       )
       console.log('connect to mongo db')
    }catch(err){
        console.log(err)
    }
}

export default mongoConnection