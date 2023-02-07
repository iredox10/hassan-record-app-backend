import mongoose from 'mongoose'

const mongoConnection = async () => {
    try{
      const mongo = await mongoose.connect(
        'mongodb://mongo:p3icFvirDTRJ2SyjezwF@containers-us-west-89.railway.app:6078'
        // process.env.MONGO_URL_LOCAL
      )
       console.log('connect to mongo db')
    }catch(err){
        console.log(err)
    }
}

export default mongoConnection