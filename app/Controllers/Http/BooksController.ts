import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Book from 'App/Models/Book'



export default class BooksController {
  public async index({response}: HttpContextContract) {

    const BooksAll = await Book.all()

    if(BooksAll.length === 0){
        return response.ok({
        message : "Buku Sedang Kosong",
      })
    }else{
      return response.ok({
      message : "Semua Data Buku",
      data: BooksAll
      })
    }
    
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response, params}: HttpContextContract) {
    
    const BooksValidator = schema.create({
      judul: schema.string(),
      ringkasan: schema.string(),
      tahun_terbit: schema.string(),
      halaman: schema.number(),
      category_id: schema.number([
        rules.exists({ table: 'categories', column: 'id'}),
      ])
    })

    try {
      const CreateBooks = await request.validate({
        schema: BooksValidator,
      });

      const newBook = new Book();
      newBook.fill(CreateBooks);

      await newBook.save();
      return response.status(201).json({
        message: 'Book created successfully',
        data: newBook,
      });

      // Process CreateBooks if validation passes
      // ...
    }catch (error) {
      response.badRequest(error.messages);
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
