import { PrismaClient } from '@prisma/client'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT ?? 'localhost'
const MINIO_PORT = process.env.MINIO_PORT ?? '9000'
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY ?? 'dualstyle'
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY ?? 'dualstyle123'
const MINIO_BUCKET = process.env.MINIO_BUCKET ?? 'products'
const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL ?? `http://localhost:9000/${MINIO_BUCKET}`

const s3 = new S3Client({
  endpoint: `http://${MINIO_ENDPOINT}:${MINIO_PORT}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
})

async function uploadImage(localPath: string, filename: string): Promise<string> {
  const buffer = fs.readFileSync(localPath)
  await s3.send(
    new PutObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: filename,
      Body: buffer,
      ContentType: 'image/jpeg',
    }),
  )
  return `${MINIO_PUBLIC_URL}/${filename}`
}

const ASSETS_DIR = path.join(__dirname, '../../assets/product-references')

const products = [
  {
    file: 'WhatsApp Image 2026-06-19 at 12.40.25.jpeg',
    slug: 'dark-art-bege.jpeg',
    title: 'Camiseta Dark Art - Bege',
    description: 'Camiseta oversized streetwear com estampa dark art exclusiva. Corte amplo e confortável.',
    price: 119.9,
    sizes: ['P', 'M', 'G', 'GG'],
    featured: true,
    display_order: 1,
  },
  {
    file: 'WhatsApp Image 2026-06-19 at 12.40.26.jpeg',
    slug: 'dark-art-branca.jpeg',
    title: 'Camiseta Dark Art - Branca',
    description: 'Camiseta oversized streetwear com estampa dark art exclusiva. Corte amplo e confortável.',
    price: 119.9,
    sizes: ['P', 'M', 'G', 'GG'],
    featured: true,
    display_order: 2,
  },
  {
    file: 'WhatsApp Image 2026-06-19 at 12.40.26 (1).jpeg',
    slug: 'dark-art-preta.jpeg',
    title: 'Camiseta Dark Art - Preta',
    description: 'Camiseta oversized streetwear com estampa dark art exclusiva. Corte amplo e confortável.',
    price: 119.9,
    sizes: ['P', 'M', 'G', 'GG'],
    featured: false,
    display_order: 3,
  },
  {
    file: 'WhatsApp Image 2026-06-19 at 12.40.26 (2).jpeg',
    slug: 'futebol-lamine-yamal.jpeg',
    title: 'Camiseta Lamine Yamal',
    description: 'Coleção Futebol — estampa exclusiva Lamine Yamal. Edição limitada.',
    price: 129.9,
    sizes: ['P', 'M', 'G', 'GG'],
    featured: true,
    display_order: 4,
  },
  {
    file: 'WhatsApp Image 2026-06-19 at 12.40.26 (3).jpeg',
    slug: 'futebol-ronaldo-fenomeno.jpeg',
    title: 'Camiseta Ronaldo Fenômeno',
    description: 'Coleção Futebol — homenagem ao The Fenomeno. Estampa premium.',
    price: 129.9,
    sizes: ['P', 'M', 'G', 'GG'],
    featured: false,
    display_order: 5,
  },
  {
    file: 'WhatsApp Image 2026-06-19 at 12.40.27.jpeg',
    slug: 'futebol-adidas-flash.jpeg',
    title: 'Camiseta Futebol Adidas',
    description: 'Coleção Futebol — estampa exclusiva com fotografia artística de jogo. Flash Sale.',
    price: 99.9,
    sizes: ['P', 'M', 'G', 'GG'],
    featured: false,
    display_order: 6,
  },
  {
    file: 'WhatsApp Image 2026-06-19 at 12.40.28.jpeg',
    slug: 'futebol-kenan-yildiz.jpeg',
    title: 'Camiseta Kenan Yildiz — Star Boy',
    description: 'Coleção Futebol — edição Star Boy, Kenan Yildiz. Estilo único para fãs.',
    price: 129.9,
    sizes: ['P', 'M', 'G', 'GG'],
    featured: false,
    display_order: 7,
  },
  {
    file: 'WhatsApp Image 2026-06-19 at 12.40.28 (1).jpeg',
    slug: 'futebol-lamine-yamal-starboy.jpeg',
    title: 'Camiseta Lamine Yamal — Starboy',
    description: 'Nova Coleção Oversized Futebol — Lamine Yamal Starboy. Edição limitada.',
    price: 139.9,
    sizes: ['P', 'M', 'G', 'GG'],
    featured: true,
    display_order: 8,
  },
  {
    file: 'WhatsApp Image 2026-06-19 at 12.40.29.jpeg',
    slug: 'futebol-brazil.jpeg',
    title: 'Camiseta Brazil Oversized',
    description: 'Nova Coleção Oversized Futebol — Brasil, arte icônica com os ídolos da seleção.',
    price: 139.9,
    sizes: ['P', 'M', 'G', 'GG'],
    featured: true,
    display_order: 9,
  },
]

async function main() {
  console.log('Iniciando seed...')
  await prisma.product.deleteMany()
  console.log('Produtos anteriores removidos.')

  for (const p of products) {
    const localPath = path.join(ASSETS_DIR, p.file)
    console.log(`Fazendo upload de ${p.slug}...`)
    const imageUrl = await uploadImage(localPath, p.slug)

    await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        image_url: imageUrl,
        shopee_link: 'https://shopee.com.br/duostyle',
        price: p.price,
        sizes: p.sizes,
        featured: p.featured,
        active: true,
        display_order: p.display_order,
      },
    })
    console.log(`  ✓ ${p.title} — ${imageUrl}`)
  }

  console.log(`\nSeed concluído! ${products.length} produtos inseridos.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
