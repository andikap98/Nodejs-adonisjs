import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckUserRole {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
      // Pastikan pengguna telah melakukan autentikasi
      if (!auth.user) {
        return response.unauthorized('Anda harus login untuk mengakses halaman ini')
      }
  
      // Periksa peran pengguna, misalnya 'user'
      if (auth.user.role !== 'user') {
        return response.forbidden('Anda tidak memiliki izin untuk mengakses halaman ini')
      }
  
      // Lanjutkan ke middleware atau pengendali berikutnya jika peran pengguna adalah 'user'
      await next()
    }
}
