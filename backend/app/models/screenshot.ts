import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from './company.js'

export default class Screenshot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare file_path: string

  @column()
  declare user_id: number

  @column()
  declare company_id: number

  @column()
  declare capture_time: DateTime

  @column()
  declare date: Date

  @column()
  declare hour: number

  @column()
  declare minuteBucket: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare users: BelongsTo<typeof User>

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>
}
