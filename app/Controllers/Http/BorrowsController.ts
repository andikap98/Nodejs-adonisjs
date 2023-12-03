import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Borrow from 'App/Models/Borrow'

export default class BorrowsController {
  public async index({response}: HttpContextContract) {
    const BorrowsAll = await Borrow.all()

    if(BorrowsAll.length === 0){
        return response.ok({
        message : " Tidak Ada Peminjaman",
      })
    }else{
      return response.ok({
      message : "Semua Data Peminjaman",
      data: BorrowsAll
      })
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({auth request, response, params}: HttpContextContract) {
    const { id } = params; // Ambil id buku dari URL parameter
    const { tanggal_peminjaman, tanggal_pengembalian } = request.post();

    // Menyimpan data peminjaman baru ke dalam tabel
    await Borrow.create({
      user_id: auth.user.id, // Misalnya, menggunakan ID dari pengguna yang terautentikasi
      buku_id: id,
      tanggal_peminjaman,
      tanggal_pengembalian,
  });

  return 'Peminjaman buku berhasil ditambahkan.';


    return response.status(200).json({ message: 'Peminjaman berhasil dibuat' })
  }

  public async show({response, params}: HttpContextContract) {
    const findBorrow= await Borrow.findOrFail(params.id)

    return response.ok({
      message: "Berikut Peminjaman yang anda cari",
      data: findBorrow
    })
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
