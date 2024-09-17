import { connectDatabase } from '@/config/database'
import { IUser } from '@/models/UserModel'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'
import { formatPrice } from '@/utils/number'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Voucher, User
import '@/models/UserModel'
import '@/models/VoucherModel'

// [POST]: /voucher/:code/apply
export async function POST(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Apply Voucher -')

  try {
    // connect to database
    await connectDatabase()

    // get userId to check if user used this voucher
    const token = await getToken({ req })
    const userEmail = token?.email

    // get data to check voucher
    const { email, total } = await req.json()

    // get voucher from database to apply
    const voucher: IVoucher | null = await VoucherModel.findOne({
      code,
      active: true,
    })
      .populate('owner')
      .lean()

    // if voucher does not exist
    if (!voucher) {
      return NextResponse.json({ message: 'Không tìm thấy mã khuyến mãi' }, { status: 404 })
    }

    // prevent user use their own voucher
    if ((voucher.owner as IUser).email === email || (voucher.owner as IUser).email === userEmail) {
      return NextResponse.json(
        { message: 'Bạn không thể dùng mã khuyến mãi của bản thân' },
        { status: 401 }
      )
    }

    // voucher has been used by you
    if (voucher.usedUsers.includes(email || userEmail)) {
      return NextResponse.json(
        {
          message: 'Bạn đã dùng mã khuyến mãi này rồi, vui lòng thử một mã khác!',
        },
        { status: 401 }
      )
    }

    // voucher has expired => voucher never be expired if expire = null
    if (voucher.expire && new Date() > new Date(voucher.expire)) {
      return NextResponse.json({ message: 'Mã khuyến mãi của bạn đã hết hạn' }, { status: 401 })
    }

    // voucher has over used => * voucher can be used infinite times if timesLeft = null
    if ((voucher.timesLeft || 0) <= 0) {
      return NextResponse.json({ message: 'Mã khuyến mãi của bạn đã hết lượt dùng' }, { status: 401 })
    }

    // not enought total to apply
    if (total < voucher.minTotal) {
      return NextResponse.json(
        {
          message: `Chỉ áp dụng đối với đơn hàng tối thiểu ${formatPrice(voucher.minTotal)}`,
        },
        { status: 401 }
      )
    }

    let message = ''
    switch (voucher.type) {
      case 'fixed-reduce': {
        message = `Bạn được giảm ${formatPrice(Math.abs(+voucher.value))} từ tổng giá trị đơn hàng`
        break
      }
      case 'fixed': {
        message = `Đơn hàng của bạn sẽ có giá là ${formatPrice(+voucher.value)}`
        break
      }
      case 'percentage': {
        message = `Bạn được giảm ${voucher.value}, tối đa ${Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(voucher.maxReduce)}`
        break
      }
    }

    // return voucher
    return NextResponse.json({ voucher, message }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
