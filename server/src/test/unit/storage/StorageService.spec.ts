import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import { StorageService } from '../../../application/services/Storage/StorageService'

const s3Mock = mockClient(S3Client)

describe('StorageService', () => {
  beforeEach(() => {
    s3Mock.reset()
    process.env.MINIO_BUCKET = 'products'
    process.env.MINIO_PUBLIC_URL = 'http://localhost:9000/products'
    process.env.MINIO_ENDPOINT = 'localhost'
    process.env.MINIO_PORT = '9000'
    process.env.MINIO_ACCESS_KEY = 'dualstyle'
    process.env.MINIO_SECRET_KEY = 'dualstyle123'
  })

  it('faz upload e retorna URL pública', async () => {
    s3Mock.on(PutObjectCommand).resolves({})

    const service = new StorageService()
    const buffer = Buffer.from('fake-image')
    const url = await service.upload(buffer, 'test.jpg', 'image/jpeg')

    expect(url).toBe('http://localhost:9000/products/test.jpg')
    expect(s3Mock.calls()).toHaveLength(1)
  })

  it('rejeita tipo de arquivo não permitido', async () => {
    const service = new StorageService()
    const buffer = Buffer.from('fake')

    await expect(service.upload(buffer, 'test.pdf', 'application/pdf')).rejects.toThrow(
      'Tipo de arquivo não permitido',
    )
  })

  it('rejeita arquivo maior que 5 MB', async () => {
    const service = new StorageService()
    const buffer = Buffer.alloc(6 * 1024 * 1024)

    await expect(service.upload(buffer, 'big.jpg', 'image/jpeg')).rejects.toThrow(
      'excede o limite',
    )
  })

  it('propaga erro do S3 quando o upload falha', async () => {
    s3Mock.on(PutObjectCommand).rejects(new Error('Connection refused'))

    const service = new StorageService()
    const buffer = Buffer.from('fake-image')

    await expect(service.upload(buffer, 'test.jpg', 'image/jpeg')).rejects.toThrow(
      'Connection refused',
    )
  })
})
