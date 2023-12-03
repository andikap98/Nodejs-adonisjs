import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'borrows'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('buku_id').unsigned().references('id').inTable('books').onDelete('CASCADE')
      table.date('tanggal_peminjaman')
      table.date('tanggal_pengembalian')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
