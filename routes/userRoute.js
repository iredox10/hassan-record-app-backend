import express from "express";
const route = express.Router()
import * as userController from '../controllers/userController.js'


route.post('/add-user', userController.add_user)

route.post('/login', userController.login)

route.patch('/update-user', userController.update_user)

route.delete('/delete-user/:id', userController.delete_user)

route.get('/get-users', userController.users)

export default route