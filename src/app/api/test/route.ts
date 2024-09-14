import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

// Function to create HMAC_SHA256 signature
const createSignature = (data: string, secret: string) => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

// Function to create the data string sorted alphabetically
const createDataString = (params: Record<string, any>) => {
  const sortedKeys = Object.keys(params).sort()
  return sortedKeys.map(key => `${key}=${params[key]}`).join('&')
}

export async function GET(req: NextRequest) {
  console.log('- TEST PAY2S GATEWAY -')

  const requestData: any = {
    partnerCode: process.env.PAY2S_PARNER_CODE,
    partnerName: 'Mona Edu',
    requestType: 'PAY2S',
    ipnUrl: 'https://pay2s.vn',
    redirectUrl: 'http://localhost:3000/api/test',
    orderId: `MONAEDU${new Date().getTime()}`,
    amount: 10000,
    orderInfo: 'Test Pay2s Gateway...',
    bankAccounts: [
      {
        account_number: '737478888',
        bank_id: 'ACB',
      },
      {
        account_number: '222629219',
        bank_id: 'ACB',
      },
    ],
    requestId: `1540456472575${new Date().getTime()}`,
  }

  // Create the data string sorted alphabetically
  const dataString = createDataString({
    accessKey: process.env.PAY2S_ACCESS_KEY, // Replace with your actual access key
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

  // Create the signature
  const signature = createSignature(dataString, process.env.PAY2S_SECRET_KEY!)

  // Add the signature to the request data
  requestData.signature = signature

  console.log('requestData', requestData)

  // try {

  //   // const res = await fetch('https://payment.pay2s.vn/v1/gateway/api/create', {
  //   //   method: 'POST',
  //   //   headers: {
  //   //     'Content-Type': 'application/json',
  //   //   },
  //   //   body: JSON.stringify(requestData),
  //   // })
  //   // console.log('res', res)
  // } catch (err: any) {
  //   console.log('err', err)
  // }

  // post request to pay2s
  const res = await fetch(process.env.PAY2S_API_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })

  const data = await res.json()

  return NextResponse.json({ data, message: 'GET' })
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
