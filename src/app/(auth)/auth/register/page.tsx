'use client'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import BottomGradient from '@/components/gradients/BottomGradient'
import { commonEmailMistakes } from '@/constants/mistakes'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { registerApi } from '@/requests'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

function RegisterPage() {
  // hooks
  const dispatch = useAppDispatch()
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
    shouldFocusError: false,
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    },
  })

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // username must be at least 5 characters
      if (data.username.length < 5) {
        setError('username', {
          type: 'manual',
          message: 'Username phải có ít nhất 5 ký tự',
        })
        isValid = false
      }

      // email must be valid
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/.test(data.email)) {
        setError('email', {
          type: 'manual',
          message: 'Email không hợp lệ',
        })
        isValid = false
      } else {
        if (commonEmailMistakes.some(mistake => data.email.toLowerCase().includes(mistake))) {
          setError('email', { message: 'Email không hợp lệ' })
          isValid = false
        }
      }

      // password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(data.password)) {
        setError('password', {
          type: 'manual',
          message:
            'Mật khẩu phải có ít nhất 6 kí tự và bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Register Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setIsLoading(true)

      try {
        // register logic here
        const { user, message } = await registerApi(data)

        // sign in user
        const callback = await signIn('credentials', {
          usernameOrEmail: user.username,
          password: data.password,
          redirect: false,
        })

        if (callback?.error) {
          toast.error(callback.error)
        } else {
          // show success message
          toast.success(message)

          // redirect to home page
          router.push('/')
        }
      } catch (err: any) {
        // show error message
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    },
    [handleValidate, router]
  )

  // keyboard event
  useEffect(() => {
    // set page title
    document.title = 'Đăng ký - Mona Edu'
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
    <div className="relative min-h-screen w-full overflow-hidden">
      <Link
        href="/"
        className="absolute left-21 top-21 z-30 hidden w-[44px] rounded-md md:block"
      >
        <Image
          src="/images/logo.png"
          width={70}
          height={70}
          alt="Mona-Edu"
        />
      </Link>

      <div className="absolute left-0 top-[0%] hidden w-[32vw] md:block">
        <Image
          className="h-full w-full object-contain object-left"
          src="/backgrounds/vector-1.png"
          width={600}
          height={600}
          alt="Mona-Edu-Shape-1"
        />
      </div>

      <div className="absolute bottom-[0%] left-[10%] hidden w-[35vw] md:block">
        <Image
          className="h-full w-full object-contain object-bottom"
          src="/backgrounds/vector-2.png"
          width={600}
          height={600}
          alt="Mona-Edu-Shape-2"
        />
      </div>

      <div className="absolute left-[0%] top-[0%] hidden w-[54vw] md:block">
        <Image
          className="h-full w-full object-contain object-top"
          src="/backgrounds/vector-3.png"
          width={625}
          height={680}
          alt="Mona-Edu-Shape-3"
        />
      </div>

      <div className="absolute bottom-[0%] left-[0%] hidden w-[54vw] md:block">
        <Image
          className="h-full w-full object-contain object-left"
          src="/backgrounds/vector-4.png"
          width={600}
          height={600}
          alt="Mona-Edu-Shape-3"
        />
      </div>

      <div className="absolute left-0 top-[15.5%] z-20 hidden max-w-[33%] pl-[40px] text-[28px] leading-10 md:block">
        <p className="left-[46px] mb-2 text-3xl font-bold text-orange-400 drop-shadow-sm">MONAEDU</p>
        <p>Hãy cùng nhau xây dựng kiến thức mọi lúc, mọi nơi nhé.</p>
      </div>

      <div className="absolute bottom-[10%] left-[3vw] z-20 hidden w-[38vw] md:block lg:w-[30vw]">
        <Image
          className="h-full w-full object-contain object-top"
          src="/backgrounds/focus_image.png"
          width={625}
          height={680}
          alt="Mona-Edu-Vector-5"
        />
      </div>

      {/* MARK: Body */}
      <div className="md:border-gray-white absolute bottom-0 right-0 top-0 z-10 flex h-screen w-full items-start justify-center overflow-y-auto bg-neutral-900 px-[10%] pb-12 pt-16 md:w-2/3 md:rounded-l-[40px] md:border-l-2 md:shadow-lg">
        {/* <BeamsBackground /> */}

        <div className="relative z-10 flex w-full flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-[40px] overflow-hidden rounded-md shadow-lg md:hidden">
              <Image
                className="h-full w-full object-contain object-left"
                src="/images/logo.png"
                width={80}
                height={80}
                alt="Mona-Edu"
              />
            </div>
            <h1 className="text-3xl font-semibold text-light">Tạo tài khoản</h1>
          </div>

          <div className="flex flex-wrap justify-between gap-6">
            <Input
              id="firstName"
              label="Tên"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="text"
              className="w-full min-w-[40%] rounded-2xl bg-white sm:w-auto"
              onFocus={() => clearErrors('firstName')}
            />

            <Input
              id="lastName"
              label="Họ"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="text"
              className="w-full min-w-[40%] rounded-2xl bg-white sm:w-auto"
              onFocus={() => clearErrors('lastName')}
            />
          </div>

          <Input
            id="username"
            label="Tên đăng nhập"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="text"
            className="w-full min-w-[40%] rounded-2xl bg-white sm:w-auto"
            onFocus={() => clearErrors('username')}
          />

          <Input
            id="email"
            label="Email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="text"
            className="w-full min-w-[40%] rounded-2xl bg-white sm:w-auto"
            onFocus={() => clearErrors('email')}
          />

          <Input
            id="password"
            label="Mật khẩu"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
            className="w-full min-w-[40%] rounded-2xl bg-white sm:w-auto"
            onFocus={() => clearErrors('password')}
          />

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`trans-300 flex h-[46px] items-center justify-center rounded-3xl border-2 border-light bg-neutral-950 px-4 py-1 text-sm font-semibold text-light shadow-lg hover:shadow-lg hover:shadow-primary ${
                isLoading ? 'pointer-events-none bg-slate-200' : ''
              }`}
            >
              {isLoading ? (
                <FaCircleNotch
                  size={18}
                  className="trans-200 animate-spin text-slate-400"
                />
              ) : (
                'Tạo tài khoản'
              )}
            </button>
          </div>

          <Divider size={2} />

          <p className="text-center font-semibold text-light">
            Đã có tài khoản?{' '}
            <Link
              href="/auth/login"
              className="underline underline-offset-2"
            >
              Đăng nhập ngay
            </Link>
          </p>

          <div className="relative my-2 h-px w-full border border-light">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-3 py-1 font-semibold">
              Hoặc
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:flex-nowrap">
            <button
              className="group/btn group relative flex items-center gap-2 rounded-2xl border border-dark bg-neutral-800 px-2.5 py-3 text-light"
              onClick={() => {
                dispatch(setPageLoading(true))
                signIn('github')
              }}
            >
              <div className="wiggle aspect-square flex-shrink-0 rounded-full">
                <Image
                  className="h-full w-full rounded-full bg-white object-cover"
                  src="/icons/github-logo.png"
                  width={30}
                  height={30}
                  alt="github"
                />
              </div>
              <span className="text-sm font-semibold">Đăng ký với GitHub</span>
              <BottomGradient />
            </button>

            <button
              className="group/btn group relative flex items-center gap-2 rounded-2xl border border-dark bg-neutral-800 px-2.5 py-3 text-light"
              onClick={() => {
                dispatch(setPageLoading(true))
                signIn('google')
              }}
            >
              <div className="wiggle aspect-square flex-shrink-0 rounded-full">
                <Image
                  className="h-full w-full object-cover"
                  src="/icons/google-logo.png"
                  width={30}
                  height={30}
                  alt="github"
                />
              </div>
              <span className="text-sm font-semibold">Đăng ký với Google</span>
              <BottomGradient />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RegisterPage
