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

  // MARK: Forgot Password Submission
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
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-800 px-2 lg:block lg:px-[46px] lg:py-[52px]">
      {/* <BeamsBackground /> */}

      <div className="absolute left-0 top-0 hidden w-[60%] lg:block">
        <Image
          className="h-full w-full object-contain object-left-top opacity-50"
          src="/backgrounds/vector-5.png"
          width={1000}
          height={1000}
          alt="Mona-Edu-Shape-5"
        />
      </div>

      <div className="absolute bottom-0 left-0 hidden w-[60%] lg:block">
        <Image
          className="h-full w-full object-contain object-left-bottom opacity-50"
          src="/backgrounds/vector-6.png"
          width={1000}
          height={1000}
          alt="Mona-Edu-Shape-6"
        />
      </div>

      <div className="absolute left-[3vw] top-[20%] z-20 hidden max-w-[34vw] lg:block">
        <div className="hidden w-[25vw] lg:block">
          <Image
            className="h-full w-full object-contain object-top"
            src="/backgrounds/focus_image.png"
            width={625}
            height={680}
            alt="Mona-Edu-Vector-5"
          />
        </div>

        <p className="left-[46px] top-[20%] text-3xl font-semibold text-orange-400 drop-shadow-lg">
          MONAEDU
        </p>
        <p className="mt-5 text-3xl font-semibold text-light drop-shadow-lg">
          Hành trang trên con đường thành công.
        </p>
      </div>

      {/* MARK: Body */}
      <div className="no-scrollbar top-1/2 z-50 w-full max-w-[550px] overflow-y-auto rounded-[28px] bg-white px-[32px] pt-6 lg:absolute lg:right-[50px] lg:-translate-y-1/2">
        <div className="mt-2 flex items-center justify-center gap-2.5">
          <Link
            href="/"
            className="w-[32px] overflow-hidden rounded-md shadow-lg"
          >
            <Image
              className="h-full w-full object-contain object-left"
              src="/images/logo.png"
              width={80}
              height={80}
              alt="Mona-Edu"
            />
          </Link>
          <span className="text-3xl font-bold text-orange-500">Mona Edu</span>
        </div>

        <Divider size={4} />

        <h1 className="text-center text-3xl font-semibold">Quên mật khẩu</h1>

        <Divider size={4} />

        <p className="mb-1.5 font-body text-sm italic tracking-wider text-slate-700">
          *Hãy nhập email của bạn để tiến hành khôi phục lại mật khẩu
        </p>

        {isSent && isCounting ? (
          <div className="mb-3 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-dark bg-white px-3 py-2">
              {countDown ? (
                <FaCircleNotch
                  size={20}
                  className="animate-spin text-dark"
                />
              ) : (
                ''
              )}
              <span className="text-nowrap text-dark">{countDown > 0 ? countDown : 'Hết giờ'}</span>
            </div>

            <p className="text-[14px] italic leading-5 text-slate-500">
              Bạn sẽ nhận được mã trong vài phút, xin vui lòng chờ!
            </p>
          </div>
        ) : (
          <Input
            id="email"
            label="Email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="email"
            labelBg="bg-white"
            onFocus={() => clearErrors('email')}
          />
        )}

        <div className="flex justify-end">
          <Link
            href="/auth/login"
            className="mt-2 block text-right text-sm underline underline-offset-2"
          >
            Quay lại đăng nhập
          </Link>
        </div>

        <Divider size={4} />

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSent && isCounting}
            className={`trans-300 flex h-[46px] items-center justify-center rounded-3xl bg-neutral-950 px-4 py-1 text-sm font-semibold text-light shadow-lg hover:shadow-lg hover:shadow-primary ${
              isLoading || isCounting ? 'pointer-events-none bg-slate-200' : ''
            }`}
          >
            {isLoading || isCounting ? (
              <FaCircleNotch
                size={18}
                className="trans-200 animate-spin text-slate-400"
              />
            ) : (
              'Gửi mã'
            )}
          </button>
        </div>

        <Divider size={10} />

        <p className="text-center font-semibold">
          Bạn chưa có tài khoản?{' '}
          <Link
            href="/auth/register"
            className="underline underline-offset-2"
          >
            Đăng ký ngay
          </Link>
        </p>

        <Divider size={6} />

        <div className="relative my-2 h-px w-full border border-neutral-800">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-3 py-1 font-semibold">
            Hoặc
          </span>
        </div>

        <Divider size={3} />

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:flex-nowrap">
          <button
            className="group/btn group relative flex items-center gap-2 rounded-2xl border border-dark bg-neutral-800 px-2.5 py-3 text-light"
            onClick={() => {
              dispatch(setPageLoading(true))
              signIn('github')
            }}
          >
            <div className="aspect-square flex-shrink-0 rounded-full">
              <Image
                className="h-full w-full rounded-full bg-white object-cover"
                src="/icons/github-logo.png"
                width={30}
                height={30}
                alt="github"
              />
            </div>
            <span className="text-sm font-semibold">Đăng nhập với GitHub</span>
            <BottomGradient />
          </button>

          <button
            className="group/btn group relative flex items-center gap-2 rounded-2xl border border-dark bg-neutral-800 px-2.5 py-3 text-light"
            onClick={() => {
              dispatch(setPageLoading(true))
              signIn('google')
            }}
          >
            <div className="aspect-square flex-shrink-0 rounded-full">
              <Image
                className="h-full w-full object-cover"
                src="/icons/google-logo.png"
                width={30}
                height={30}
                alt="github"
              />
            </div>
            <span className="text-sm font-semibold">Đăng nhập với Google</span>
            <BottomGradient />
          </button>
        </div>

        <Divider size={8} />
      </div>
    </div>
  )
}
export default ForgotPasswordPage
