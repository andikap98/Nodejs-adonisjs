import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddColumnToUsersIsVerify extends BaseSchema {
  protected tableName = 'users' // Ubah nama tabel sesuai yang ingin ditambahkan kolomnya

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.boolean('isVerify').defaultTo(false) // Menambahkan kolom boolean dengan nilai default false
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('isVerify') // Menghapus kolom jika melakukan rollback migrasi
    })
  }
}
