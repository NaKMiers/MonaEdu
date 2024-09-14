'use client'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import BottomGradient from '@/components/gradients/BottomGradient'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { forgotPasswordApi } from '@/requests'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

const time = 60

function ForgotPasswordPage() {
  // hooks
  const dispatch = useAppDispatch()

  // states
  const [isSent, setIsSent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const [countDown, setCountDown] = useState<number>(time)

  useEffect(() => {
    if (isSent) {
      setIsCounting(true)
      const interval = setInterval(() => {
        if (countDown === 0) {
          // reset
          clearInterval(interval)
          setIsCounting(false)
          setIsSent(false)
          setCountDown(time)
          return
        }
        setCountDown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isSent, countDown])

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
    },
  })

  // MARK: Forgot Password Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      setIsLoading(true)

      try {
        // send request to server
        const { message } = await forgotPasswordApi(data)

        // show success message
        toast.success(message)

        // set is sent
        setIsSent(true)
      } catch (err: any) {
        // show error message
        console.log(err)
        const { message } = err
        setError('email', { type: 'manual', message })
        toast.error(message)
      } finally {
        // reset loading state
        setIsLoading(false)
      }
    },
    [setError]
  )

  // keyboard event
  useEffect(() => {
    // set page title
    document.title = 'Quên mật khẩu - Mona Edu'
    dispatch(setPageLoading(false))

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit(onSubmit)()
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleSubmit, onSubmit, dispatch])

  return (
    <div className='relative flex items-center justify-center px-2 lg:block bg-neutral-800 h-screen w-full lg:px-[46px] lg:py-[52px] overflow-hidden'>
      {/* <BeamsBackground /> */}

      <div className='hidden lg:block absolute top-0 left-0 w-[60%]'>
        <Image
          className='w-full h-full object-contain object-left-top opacity-50'
          src='/backgrounds/vector-5.png'
          width={1000}
          height={1000}
          alt='Mona-Edu-Shape-5'
        />
      </div>

      <div className='hidden lg:block absolute bottom-0 left-0 w-[60%]'>
        <Image
          className='w-full h-full object-contain object-left-bottom opacity-50'
          src='/backgrounds/vector-6.png'
          width={1000}
          height={1000}
          alt='Mona-Edu-Shape-6'
        />
      </div>

      <div className='hidden lg:block absolute z-20 left-[3vw] top-[20%] max-w-[34vw]'>
        <div className='hidden lg:block w-[25vw]'>
          <Image
            className='w-full h-full object-contain object-top'
            src='/backgrounds/focus_image.png'
            width={625}
            height={680}
            alt='Mona-Edu-Vector-5'
          />
        </div>

        <p className='text-orange-400 drop-shadow-lg left-[46px] font-semibold text-3xl top-[20%]'>
          MONAEDU
        </p>
        <p className='text-white drop-shadow-lg font-semibold text-3xl mt-5'>
          Hành trang trên con đường thành công.
        </p>
      </div>

      {/* MARK: Body */}
      <div className='lg:absolute z-50 top-1/2 lg:right-[50px] lg:-translate-y-1/2 px-[32px] pt-6 max-w-[550px] w-full bg-white rounded-[28px] overflow-y-auto no-scrollbar'>
        <div className='flex justify-center items-center gap-2.5 mt-2'>
          <Link href='/' className='w-[32px] rounded-md overflow-hidden shadow-lg'>
            <Image
              className='w-full h-full object-contain object-left'
              src='/images/logo.png'
              width={80}
              height={80}
              alt='Mona-Edu'
            />
          </Link>
          <span className='font-bold text-3xl text-orange-500'>Mona Edu</span>
        </div>

        <Divider size={4} />

        <h1 className='font-semibold text-3xl text-center'>Quên mật khẩu</h1>

        <Divider size={4} />

        <p className='mb-1.5 font-body tracking-wider text-sm italic text-slate-700'>
          *Hãy nhập email của bạn để tiến hành khôi phục lại mật khẩu
        </p>

        {isSent && isCounting ? (
          <div className='flex items-center gap-3 mb-3 '>
            <div className='flex items-center gap-2 border border-dark py-2 px-3 rounded-lg bg-white'>
              {countDown ? <FaCircleNotch size={20} className='text-dark animate-spin' /> : ''}
              <span className='text-dark text-nowrap'>{countDown > 0 ? countDown : 'Hết giờ'}</span>
            </div>

            <p className='text-[14px] italic text-slate-500 leading-5'>
              Bạn sẽ nhận được mã trong vài phút, xin vui lòng chờ!
            </p>
          </div>
        ) : (
          <Input
            id='email'
            label='Email'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='email'
            labelBg='bg-white'
            onFocus={() => clearErrors('email')}
          />
        )}

        <div className='flex justify-end'>
          <Link
            href='/auth/login'
            className='block text-right text-sm underline underline-offset-2 mt-2'
          >
            Quay lại đăng nhập
          </Link>
        </div>

        <Divider size={4} />

        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSent && isCounting}
            className={`h-[46px] flex items-center justify-center px-4 py-1 text-sm font-semibold bg-neutral-950 rounded-3xl text-light trans-300 shadow-lg hover:shadow-lg hover:shadow-primary ${
              isLoading || isCounting ? 'bg-slate-200 pointer-events-none' : ''
            }`}
          >
            {isLoading || isCounting ? (
              <FaCircleNotch size={18} className='text-slate-400 trans-200 animate-spin' />
            ) : (
              'Gửi mã'
            )}
          </button>
        </div>

        <Divider size={10} />

        <p className='font-semibold text-center'>
          Bạn chưa có tài khoản?{' '}
          <Link href='/auth/register' className='underline underline-offset-2'>
            Đăng ký ngay
          </Link>
        </p>

        <Divider size={6} />

        <div className='relative w-full border h-px border-neutral-800 my-2'>
          <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg px-3 py-1 font-semibold'>
            Hoặc
          </span>
        </div>

        <Divider size={3} />

        <div className='flex flex-wrap md:flex-nowrap justify-center gap-x-6 gap-y-4'>
          <button
            className='relative group/btn flex items-center gap-2 group rounded-2xl border bg-neutral-800 text-light border-dark px-2.5 py-3'
            onClick={() => {
              dispatch(setPageLoading(true))
              signIn('github')
            }}
          >
            <div className='aspect-square rounded-full flex-shrink-0'>
              <Image
                className='w-full h-full object-cover bg-white rounded-full'
                src='/icons/github-logo.png'
                width={30}
                height={30}
                alt='github'
              />
            </div>
            <span className='font-semibold text-sm'>Đăng nhập với GitHub</span>
            <BottomGradient />
          </button>

          <button
            className='relative group/btn flex items-center gap-2 group rounded-2xl border bg-neutral-800 text-light border-dark px-2.5 py-3'
            onClick={() => {
              dispatch(setPageLoading(true))
              signIn('google')
            }}
          >
            <div className='aspect-square rounded-full flex-shrink-0'>
              <Image
                className='w-full h-full object-cover'
                src='/icons/google-logo.png'
                width={30}
                height={30}
                alt='github'
              />
            </div>
            <span className='font-semibold text-sm'>Đăng nhập với Google</span>
            <BottomGradient />
          </button>
        </div>

        <Divider size={8} />
      </div>
    </div>
  )
}
export default ForgotPasswordPage
