import express, { Router } from 'express'
import * as controller from '../controllers/controllers.js'
const route = express.Router()

route.get('/',controller.home)

route.post('/add-product', controller.add_product)

route.get('/view-products', controller.view_products)

route.get('/view-product/:id', controller.view_product)

route.patch('/edit-product/:id', controller.edit_product)

route.delete('/delete-product/:id', controller.delete_product)

route.post('/sale', controller.sale)

route.get('/transactions', controller.transactions)

route.get('/payment-method', controller.payment)

route.get('/today-stats', controller.todayStats)

route.get('/lastweek-stats', controller.lastWeek)

route.get('/total', controller.totalShopAmount)

route.get('/transc',controller.transc)

route.get('/monthly-stats', controller.monthlyStats)

route.get('/daily-stats', controller.dailyStats)

route.get('/yesterday-stats', controller.yesterdayStats)

route.post('/borrow', controller.borrow)

route.get('/view-borrowed', controller.get_borrows)

route.get('/borrowed-stats', controller.borrowStats)
export default route