import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckAdminRole {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    if (!auth.user) {
      return response.unauthorized('Anda harus login untuk mengakses halaman ini')
    }

    // Periksa peran pengguna, misalnya 'admin'
    if (auth.user.role !== 'admin') {
      return response.forbidden('Anda tidak memiliki izin untuk mengakses halaman ini')
    }

    // Lanjutkan ke middleware atau pengendali berikutnya jika peran pengguna adalah 'admin'
    await next()
  }
}
