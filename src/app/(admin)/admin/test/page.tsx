'use client'
import crypto from 'crypto'

// Function to create HMAC_SHA256 signature
const createSignature = (data: string, secret: string) => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

// Function to create the data string sorted alphabetically
const createDataString = (params: Record<string, any>) => {
  const sortedKeys = Object.keys(params).sort()
  return sortedKeys.map(key => `${key}=${params[key]}`).join('&')
}

function TestPage() {
  // const handleSend = async () => {
  //   try {
  //     const res = await fetch('/api/test')
  //     const data = await res.json()
  //     console.log('data', data)
  //   } catch (err: any) {
  //     console.log('err', err)
  //     toast.error(err.message)
  //   }
  // }

  const handleSend = async () => {
    const requestData: any = {
      partnerCode: 'PAY2S6G9EBS2ZHQHDS2A',
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
      accessKey: 'b4882a21cc0d698ee7905585208a7bbee5b9a6124c1ed88a175f920d4c180923', // Replace with your actual access key
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
    const signature = createSignature(
      dataString,
      '7c1c2750a88977b710bd92348e99d51bda5c38e9c398e972145b52f7366ffb5c'
    )

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

    try {
      const res = await fetch('https://payment.pay2s.vn/v1/gateway/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('res', res)
    } catch (err: any) {
      console.log('err', err)
    }
  }

  return (
    <div className='flex justify-center'>
      <button
        className='font-semibold px-3 py-2 rounded-lg shadow-lg uppercase border-2 border-light trans-200 hover:bg-yellow-200 hover:text-dark'
        onClick={handleSend}
      >
        post
      </button>
    </div>
  )
}

export default TestPage
