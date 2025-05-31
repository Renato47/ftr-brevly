import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import { desc } from 'drizzle-orm'

import { db, pg } from '../db'
import { schema } from '../db/schemas'
import { uploadFileToStorage } from '../storage/upload-file-to-storage'

export async function exportLinks(): Promise<{ reportUrl: string }> {
  const { sql } = db
    .select({
      id: schema.links.id,
      originalUrl: schema.links.originalUrl,
      shortenedUrl: schema.links.shortenedUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .orderBy(desc(schema.links.createdAt))
    .toSQL()

  const cursor = pg.unsafe(sql).cursor(2)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'original_url', header: 'Original URL' },
      { key: 'shortened_url', header: 'Short URL' },
      { key: 'access_count', header: 'Access Count' },
      { key: 'created_at', header: 'Created at' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeLine = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }

        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-links.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeLine])

  return { reportUrl: url }
}
