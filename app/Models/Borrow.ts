import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Borrow extends BaseModel {
  public static table = 'borrows'
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public buku_id: number

  @column()
  public tanggal_peminjaman: Date

  @column()
  public tanggal_pengembalian: Date
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
