import { CloudFrontClient } from '@aws-sdk/client-cloudfront'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
import crypto from 'crypto'
import sharp from 'sharp'

// create upload instance of multer
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_BUCKET_REGION!,
})

const cloudfront = new CloudFrontClient({
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY!,
  },
})

const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

async function getFileUrl(url: string) {
  const signedUrl = getSignedUrl({
    url,
    dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
  })

  return signedUrl
}

async function uploadFile(
  file: any,
  ratio: string = '16:9',
  type: 'image' | 'video' | 'doc' | 'raw' | 'auto' | undefined = 'image'
) {
  let size: any = { width: 1920, height: 1080, fit: 'cover' }
  if (ratio === '1:1') {
    size.width = 480
    size.height = 480
  } else if (ratio === '9:16') {
    size.width = 1080
    size.height = 1920
  } else if (ratio === '4:3') {
    size.width = 480
    size.height = 640
  } else if (ratio === '3:4') {
    size.width = 640
    size.height = 480
  }

  try {
    let buffer: any = Buffer.from(await file.arrayBuffer())

    // resize image
    if (file.type.startsWith('image') && type === 'image') {
      buffer = await sharp(buffer).resize(size).toBuffer()
    }

    // create encrypted file name
    const filename = randomFileName()

    // pathname
    let pathname = ''
    if (type === 'video') {
      pathname = `videos/${filename}`
    } else if (type === 'image') {
      pathname = `images/${filename}`
    } else if (type === 'doc') {
      pathname = `docs/${filename}`
    } else {
      pathname = `general/${filename}`
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: pathname,
      Body: buffer,
      ContentType: file.type,
    }

    const command = new PutObjectCommand(params)
    s3.send(command)

    return `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${pathname}`
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function deleteFile(url: string) {
  try {
    if (url.startsWith('http')) {
      url = url.split(`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/`)[1]
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: url,
    }

    // delete file from s3 bucket
    const command = new DeleteObjectCommand(params)
    await s3.send(command)

    // invalidate cloudfront cache
    const invalidationParams = {
      DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID!,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: [`/${url}`],
        },
      },
    }
  } catch (error) {
    console.error(error)
  }
}

export { deleteFile, getFileUrl, uploadFile }
