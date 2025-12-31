import cloudinary from '#config/cloudinary'
import Screenshot from '#models/screenshot'
import { uploadScreenshotValidator } from '#validators/screenshot'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ScreenshotsController {
  /**
   * Upload screenshot (Employee only)
   */
  async upload({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role !== 'employee') {
      return response.forbidden({ message: 'Only employees can upload screenshots' })
    }

    if (!user.isActive) {
      return response.forbidden({ message: 'Your account is inactive' })
    }

    const { screenshot, captureTime } = await request.validateUsing(uploadScreenshotValidator)

    try {
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(screenshot.tmpPath!, {
        folder: `screenshots/${user.companyId}/${user.id}`,
        resource_type: 'image',
        format: screenshot.extname,
        quality: 'auto',
        public_id: `${Date.now()}_${screenshot.clientName}`,
      })

      // Extract date, hour, and minute bucket from capture time
      const captureDateTime = DateTime.fromJSDate(captureTime)
      const date = captureDateTime.toISODate()!
      const hour = captureDateTime.hour
      const minute = captureDateTime.minute
      const minuteBucket = Math.floor(minute / 5) * 5 // Group by 5-minute intervals

      // Save screenshot record
      const screenshotRecord = await Screenshot.create({
        filePath: uploadResult.secure_url,
        userId: user.id,
        companyId: user.companyId,
        captureTime: captureDateTime,
        hour,
        minuteBucket,
      })

      return response.created({
        message: 'Screenshot uploaded successfully',
        data: {
          id: screenshotRecord.id,
          filePath: screenshotRecord.filePath,
          captureTime: screenshotRecord.captureTime,
          date: screenshotRecord.date,
          hour: screenshotRecord.hour,
          minuteBucket: screenshotRecord.minuteBucket,
        },
      })
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      return response.internalServerError({
        message: 'Failed to upload screenshot',
        error: error.message,
      })
    }
  }
}
