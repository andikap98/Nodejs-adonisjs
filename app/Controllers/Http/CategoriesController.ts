import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'

export default class CategoriesController {
  public async index({response}: HttpContextContract) {
    const CategoryAll = await Category.all()

    return response.ok({
      message : "Semua Data Kategori",
      data : CategoryAll
    })
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {

    const CategoryValidator = schema.create({
      name: schema.string()
    })

  /**
   * Validate request body against the schema
   */
    const CretaNewCategory = await request.validate({ schema: CategoryValidator })
    await Category.create(CretaNewCategory)

    return response.created({
      message: "berhasil memasukan data"
    })
  }

  public async show({response, params}: HttpContextContract) {
    const findCategory = await Category.findOrFail(params.id)

    return response.ok({
      message : `Berikut Kategori yang Anda cari`,
      data: findCategory
    })
  }

  public async edit({}: HttpContextContract) {
    
  }

  public async update({request, response, params}: HttpContextContract) {
    const CategoryValidator = schema.create({
      name: schema.string()
    })

  /**
   * Validate request body against the schema
   */
    const UpdateDataCategories = await request.validate({ schema: CategoryValidator })
    try{
        await Category
          .query()
          .where('id', params.id)
          .update(UpdateDataCategories)

      return response.created({
        message: "berhasil merubah data"
      })
    }catch (error) {
      return response.status(404).send({
         message: 'Category not found'
      })
    }

  }

  public async destroy({response, params}: HttpContextContract) {
    const deleteCategory =  await Category.findOrFail(params.id)
    await deleteCategory.delete()

    return response.ok({
      message : "Berhasil Menghapus"
    })
  }
}
