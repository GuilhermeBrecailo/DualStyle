import type { FastifyPluginAsync } from 'fastify'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { StorageService } from '../../../application/services/Storage/StorageService'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024

const uploadRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/admin/upload', async (request, reply) => {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({ error: 'Nenhum arquivo enviado' })
    }

    if (!ALLOWED_MIME_TYPES.includes(data.mimetype)) {
      return reply.status(400).send({ error: `Tipo de arquivo não permitido: ${data.mimetype}` })
    }

    const chunks: Buffer[] = []
    for await (const chunk of data.file) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    if (buffer.byteLength > MAX_SIZE_BYTES) {
      return reply.status(400).send({ error: 'Arquivo excede o limite de 5 MB' })
    }

    const ext = extname(data.filename) || `.${data.mimetype.split('/')[1]}`
    const filename = `${randomUUID()}${ext}`

    const storage = new StorageService()
    const url = await storage.upload(buffer, filename, data.mimetype)

    return reply.status(200).send({ url })
  })
}

export default uploadRoute
