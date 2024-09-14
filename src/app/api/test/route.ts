import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

// PAY2S_API_ENDPOINT

// Function to create HMAC_SHA256 signature
const createSignature = (data: string, secret: string) => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

// Function to create the data string sorted alphabetically
const createDataString = (params: Record<string, any>) => {
  const sortedKeys = Object.keys(params)
  console.log('sortedKeys', sortedKeys)
  const a = sortedKeys.map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
  console.log(a)
  return a
}

export async function GET(req: NextRequest) {
  const requestData: any = {
    partnerCode: process.env.PAY2S_PARTNER_CODE!,
    partnerName: 'Test',
    requestType: 'PAY2S',
    ipnUrl: 'https://monaedu.com/api/ipn',
    redirectUrl: 'https://monaedu.com/api/test',
    orderId: 'MM1540456472575',
    amount: 150000,
    orderInfo: 'SDK team.',
    bankAccounts: [
      {
        account_number: '737478888',
        bank_id: 'ACB',
      },
    ],
    requestId: '1540456472575',
  }
  const dataString = createDataString({
    accessKey: process.env.PAY2S_ACCESS_KEY!,
    amount: requestData.amount,
    accountNumber: requestData.bankAccounts[0].account_number, // Assuming you want to use the first account number
    ipnUrl: requestData.ipnUrl,
    orderId: requestData.orderId,
    orderInfo: requestData.orderInfo,
    partnerCode: requestData.partnerCode,
    redirectUrl: requestData.redirectUrl,
    requestId: requestData.requestId,
    requestType: requestData.requestType,
  })

  requestData.signature = createSignature(dataString, process.env.PAY2S_SECRET_KEY!)

  // accessKey=$accessKey
  // &amount=$amount
  // &accountNumber=$accountNumber
  // &ipnUrl=$ipnUrl
  // &orderId=$orderId
  // &orderInfo=$orderInfo
  // &partnerCode=$partnerCode
  // &redirectUrl=$redirectUrl
  // &requestId=$requestId
  // &requestType=$requestType

  // post request to pay2s
  const res = await fetch(process.env.PAY2S_API_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(requestData),
  })

  const data = await res.json()

  return NextResponse.json({ data, requestData })
}

export async function POST(req: NextRequest) {
  console.log('- TEST PAY2S GATEWAY -')

  try {
    const data = await req.json()

    console.log('data', data)
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
