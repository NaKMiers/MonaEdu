'use client'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import BeamsBackground from '@/components/backgrounds/BeamsBackground'
import BottomGradient from '@/components/gradients/BottomGradient'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

function LoginPage() {
  document.title = 'Đăng nhập - MonaEdu'

  // hooks
  const router = useRouter()

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
      usernameOrEmail: '',
      password: '',
    },
  })

  // MARK: Login Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // start loading
      setIsLoading(true)

      try {
        // send request to server
        const res = await signIn('credentials', { ...data, redirect: false })

        if (res?.ok) {
          // show success message
          toast.success('Login successful!')

          // redirect to home page
          router.push('/')
        }

        if (res?.error) {
          // show error message
          toast.error(res.error)
          setError('usernameOrEmail', { type: 'manual' })
          setError('password', { type: 'manual' })
        }
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop loading state
        setIsLoading(false)
      }
    },
    [setError, router]
  )

  // keyboard event
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit(onSubmit)()
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleSubmit, onSubmit])

  return (
    <div className='relative flex items-center justify-center lg:block bg-neutral-800 px-2 h-screen w-full lg:px-[46px] lg:py-[52px] overflow-hidden'>
      {/* <BeamsBackground /> */}

      <div className='hidden lg:block absolute top-0 left-0 w-[60%]'>
        <Image
          className='w-full h-full object-contain object-left-top opacity-50'
          src='/backgrounds/vector-5.png'
          width={1000}
          height={1000}
          alt='shape-5'
        />
      </div>

      <div className='hidden lg:block absolute bottom-0 left-0 w-[60%]'>
        <Image
          className='w-full h-full object-contain object-left-bottom opacity-50'
          src='/images/vector-6.png'
          width={1000}
          height={1000}
          alt='shape-6'
        />
      </div>

      <div className='hidden lg:block absolute z-20 left-[3vw] top-[20%] max-w-[34vw]'>
        <div className='hidden lg:block w-[25vw]'>
          <Image
            className='w-full h-full object-contain object-top'
            src='/backgrounds/focus_image.png'
            width={625}
            height={680}
            alt='vector-5'
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
      <div className='lg:absolute z-10 top-1/2 lg:right-[50px] lg:-translate-y-1/2 px-[32px] pt-6 max-w-[550px] w-full bg-white rounded-[28px] overflow-y-auto no-scrollbar'>
        <div className='flex justify-center items-center gap-2.5 mt-2'>
          <div className='w-[32px] rounded-md overflow-hidden shadow-lg'>
            <Image
              className='w-full h-full object-contain object-left'
              src='/images/logo.png'
              width={80}
              height={80}
              alt='logo'
            />
          </div>
          <span className='font-bold text-3xl text-orange-500'>MonaEdu</span>
        </div>

        <Divider size={4} />

        <h1 className='font-semibold text-3xl text-center'>Đăng nhập</h1>

        <Divider size={4} />

        <Input
          id='usernameOrEmail'
          label='Tên đăng nhập / Email'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => clearErrors('usernameOrEmail')}
        />

        <Input
          id='password'
          label='Mật khẩu'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          labelBg='bg-white'
          className='min-w-[40%] mt-6'
          onFocus={() => clearErrors('password')}
        />

        <div className='flex justify-end'>
          <Link
            href='/auth/forgot-password'
            className='block text-right text-sm underline underline-offset-2 mt-2'
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Divider size={4} />

        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${
              isLoading ? 'bg-slate-200 pointer-events-none' : ''
            }`}
          >
            <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
            <span className='inline-flex font-semibold h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 text-white trans-300 px-4 py-1 text-sm backdrop-blur-3xl'>
              {isLoading ? (
                <FaCircleNotch size={18} className='text-slate-400 trans-200 animate-spin' />
              ) : (
                'Đăng nhập'
              )}
            </span>
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
            <span className='font-semibold text-sm' onClick={() => signIn('github')}>
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
            <span className='font-semibold text-sm' onClick={() => signIn('google')}>
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
export default LoginPage
