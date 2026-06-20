import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export class StorageService {
  private client: S3Client
  private bucket: string
  private publicUrl: string

  constructor() {
    this.bucket = process.env.MINIO_BUCKET ?? 'products'
    this.publicUrl = process.env.MINIO_PUBLIC_URL ?? 'http://localhost:9000/products'

    this.client = new S3Client({
      endpoint: `http://${process.env.MINIO_ENDPOINT ?? 'localhost'}:${process.env.MINIO_PORT ?? '9000'}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'dualstyle',
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'dualstyle123',
      },
      forcePathStyle: true,
    })
  }

  async upload(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
    if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
      throw new Error(`Tipo de arquivo não permitido: ${mimetype}`)
    }
    if (buffer.byteLength > MAX_SIZE_BYTES) {
      throw new Error('Arquivo excede o limite de 5 MB')
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: buffer,
        ContentType: mimetype,
      }),
    )

    return `${this.publicUrl}/${filename}`
  }
}
