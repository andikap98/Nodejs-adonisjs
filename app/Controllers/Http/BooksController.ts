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

  public async store({request, response}: HttpContextContract) {
    
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

  public async show({response, params}: HttpContextContract) {
    const findBook= await Book.findOrFail(params.id)

    return response.ok({
      message: "Berikut Buku yang anda cari",
      data: findBook
    })
  }

  public async edit({}: HttpContextContract) {}

  public async update({request, response, params}: HttpContextContract) {

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
      
      const UpdateNewBook = await request.validate({
        schema: BooksValidator
      })

      await Book
        .query()
        .where('id', params.id)
        .update(UpdateNewBook)
      
      return response.created({
        message: "Berhasil Merubah Data"
      })

    } catch (error) {
      return response.status(404).send({
        message: 'Books not found'
      })
    }
  }

  public async destroy({response, params}: HttpContextContract) {

    const deleteBook = await Book.findOrFail(params.id)
    await deleteBook.delete()

    return response.ok({
      message: "Behasil Menghapus Data"
    })
  }
}
