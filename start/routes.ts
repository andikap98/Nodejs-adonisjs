/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { Group } from '@japa/runner'
import AuthController from 'App/Controllers/Http/AuthController'
import BooksController from 'App/Controllers/Http/BooksController'
import BorrowsController from 'App/Controllers/Http/BorrowsController'
import CategoriesController from 'App/Controllers/Http/CategoriesController'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.resource('kategori', 'CategoriesController')
    .apiOnly()
    .middleware({
      store: ['admin'],
      update: ['admin'],
      destroy: ['admin'],
      index: [],
      show: [],
    })
  
  Route.resource('/buku', 'BooksController').apiOnly().middleware({
    store: ['admin'],
    update: ['admin'],
    destroy: ['admin'],
    index: [],
    show: [],
  })
  Route.get('/peminjaman', 'BorrowsController.index')
  Route.get('/peminjaman/:id', 'BorrowsController.show')
  Route.get('/buku/:id/peminjaman/', 'BorrowsController.store')
  Route.post('/profile', 'AuthController.profile').middleware('auth')
}).prefix('/api/v1')


// auth
Route.group(()=>{
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.get('/me', 'AuthController.me').middleware('auth')
  Route.post('/otp-confirmation','AuthController.otpConfirmation')
}).prefix('/api/v1/auth')