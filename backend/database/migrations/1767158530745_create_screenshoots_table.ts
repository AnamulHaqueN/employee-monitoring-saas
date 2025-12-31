import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'screenshots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.text('file_path').notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.integer('company_id').unsigned().notNullable()
      table.timestamp('capture_time').notNullable()
      table.date('date').notNullable()
      table.integer('hour').notNullable()
      table.integer('minute_bucket').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('company_id').references('id').inTable('companies').onDelete('CASCADE')

      // Critical indexes for performance with 1M+ records
      table.index(['user_id', 'date', 'hour', 'minute_bucket'], 'idx_user_date_time')
      table.index(['company_id', 'user_id', 'date'], 'idx_company_user_date')
      table.index(['company_id', 'date'], 'idx_company_date')
      table.index('capture_time')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
