import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import FormData from 'form-data'
import { buildApp } from '../../../app'
import { loadTestEnv } from '../../helpers/loadTestEnv'

jest.mock('../../../infrastructure/repository/Product/ProductPrismaRepository')

const s3Mock = mockClient(S3Client)

const prismaMock = {} as any

describe('POST /api/v1/admin/upload', () => {
  let app: Awaited<ReturnType<typeof buildApp>>
  let token: string

  beforeAll(async () => {
    loadTestEnv()
    app = await buildApp({ prisma: prismaMock })

    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
    })
    token = JSON.parse(loginRes.body).access_token
  })

  afterAll(() => app.close())

  beforeEach(() => s3Mock.reset())

  it('retorna 401 sem token', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/admin/upload' })
    expect(res.statusCode).toBe(401)
  })

  it('retorna 400 sem arquivo', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/upload',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'multipart/form-data; boundary=----boundary' },
      payload: '------boundary--\r\n',
    })
    expect(res.statusCode).toBe(400)
  })

  it('retorna 400 para tipo inválido', async () => {
    const form = new FormData()
    form.append('file', Buffer.from('fake'), { filename: 'test.pdf', contentType: 'application/pdf' })

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/upload',
      headers: { ...form.getHeaders(), authorization: `Bearer ${token}` },
      payload: form.getBuffer(),
    })
    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/não permitido/)
  })

  it('retorna 200 com URL após upload bem-sucedido', async () => {
    s3Mock.on(PutObjectCommand).resolves({})

    const form = new FormData()
    form.append('file', Buffer.from('fake-image'), { filename: 'photo.jpg', contentType: 'image/jpeg' })

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/upload',
      headers: { ...form.getHeaders(), authorization: `Bearer ${token}` },
      payload: form.getBuffer(),
    })
    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(body.url).toMatch(/^http.*\.jpg$/)
  })
})
