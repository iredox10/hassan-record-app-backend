import express from 'express'
import mongoConnection from './utils/mongoConnection.js'
import routes from './routes/routes.js'
import userRoutes from './routes/userRoute.js'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors('*'))

// mongodb connection
mongoConnection()

// custom middlewares
app.use(routes)
app.use(userRoutes)

app.use((req,res,err) =>{
    res.json(err)
})

app.listen(process.env.PORT || 4000)


