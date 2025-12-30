import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'screenshots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('file_path').notNullable()
      table.integer('user_id').notNullable().unique()
      table.integer('company_id').notNullable().unique()
      table.dateTime('capture_time').notNullable()
      table.integer('date').notNullable()
      table.integer('hour').notNullable()
      table.integer('minuteBucket').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
