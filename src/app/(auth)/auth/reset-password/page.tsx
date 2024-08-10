'use client'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import BottomGradient from '@/components/gradients/BottomGradient'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { resetPassword } from '@/requests'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

function ResetPasswordPage() {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()
  const queryParams = useSearchParams()

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      newPassword: '',
      reNewPassword: '',
    },
  })

  useEffect(() => {
    // MARK: Check if token is not provided
    if (!queryParams.get('token')) {
      toast.error('Không có token')
      router.push('/auth/login')
    }
  }, [queryParams, router])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(data.newPassword)) {
        setError('newPassword', {
          type: 'manual',
          message:
            'Mật khẩu mới phải có ít nhất 6 kí tự và bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số',
        })
        isValid = false
      }

      // check if new password and re-new password are match
      if (data.newPassword !== data.reNewPassword) {
        setError('reNewPassword', { type: 'manual', message: 'Mật khẩu không khớp' }) // add this line
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Reset Password Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setIsLoading(true)

      try {
        // get email and token from query
        const token = queryParams.get('token')

        // send request to server
        const { message } = await resetPassword(token!, data.newPassword)

        // show success message
        toast.success(message)

        // redirect to login page
        router.push('/auth/login')
      } catch (err: any) {
        // show error message
        toast.error(err.message)
        console.log(err)
      } finally {
        // reset loading state
        setIsLoading(false)
      }
    },
    [handleValidate, router, queryParams]
  )

  // keyboard event
  useEffect(() => {
    // set page title
    document.title = 'Khôi phục mật khẩu - Mona Edu'
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
      {/* <BackgroundBeams /> */}

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

        <h1 className='font-semibold text-3xl text-center'>Khôi phục mật khẩu</h1>

        <Divider size={4} />
        <Input
          id='newPassword'
          label='Mật khẩu mới'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          className='min-w-[40%]'
          onFocus={() => clearErrors('newPassword')}
        />

        <Input
          id='reNewPassword'
          label='Nhập lại mật khẩu'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          className='min-w-[40%] mt-6'
          onFocus={() => clearErrors('password')}
        />

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
            disabled={isLoading}
            className={`h-[46px] flex items-center justify-center px-4 py-1 text-sm font-semibold bg-neutral-950 rounded-3xl text-light trans-300 shadow-lg hover:shadow-lg hover:shadow-primary ${
              isLoading ? 'bg-slate-200 pointer-events-none' : ''
            }`}
          >
            {isLoading ? (
              <FaCircleNotch size={18} className='text-slate-400 trans-200 animate-spin' />
            ) : (
              'Đặt lại'
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
          <button className='relative group/btn flex items-center gap-2 group rounded-2xl border bg-neutral-800 text-light border-dark px-2.5 py-3'>
            <div className='aspect-square rounded-full flex-shrink-0'>
              <Image
                className='w-full h-full object-cover bg-white rounded-full'
                src='/icons/github-logo.png'
                width={30}
                height={30}
                alt='github'
              />
            </div>
            <span
              className='font-semibold text-sm'
              onClick={() => {
                dispatch(setPageLoading(true))
                signIn('github')
              }}
            >
              Đăng ký với GitHub
            </span>
            <BottomGradient />
          </button>

          <button className='relative group/btn flex items-center gap-2 group rounded-2xl border bg-neutral-800 text-light border-dark px-2.5 py-3'>
            <div className='aspect-square rounded-full flex-shrink-0'>
              <Image
                className='w-full h-full object-cover'
                src='/icons/google-logo.png'
                width={30}
                height={30}
                alt='github'
              />
            </div>
            <span
              className='font-semibold text-sm'
              onClick={() => {
                dispatch(setPageLoading(true))
                signIn('google')
              }}
            >
              Đăng ký với Google
            </span>
            <BottomGradient />
          </button>
        </div>

        <Divider size={8} />
      </div>
    </div>
  )
}
export default ResetPasswordPage
