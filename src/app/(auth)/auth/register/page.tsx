'use client';
import Divider from '@/components/Divider';
import Input from '@/components/Input';
import BeamsBackground from '@/components/backgrounds/BeamsBackground';
import BottomGradient from '@/components/gradients/BottomGradient';
import { commonEmailMistakes } from '@/constants/mistakes';
import { registerApi } from '@/requests';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaCircleNotch } from 'react-icons/fa';

function RegisterPage() {
  // hooks
  const router = useRouter();

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  });

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    (data) => {
      let isValid = true;

      // username must be at least 5 characters
      if (data.username.length < 5) {
        setError('username', {
          type: 'manual',
          message: 'Username phải có ít nhất 5 ký tự',
        });
        isValid = false;
      }

      // email must be valid
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        setError('email', {
          type: 'manual',
          message: 'Email không hợp lệ',
        });
        isValid = false;
      } else {
        const { email } = data;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

        if (!emailRegex.test(email)) {
          setError('email', { message: 'Email không hợp lệ' });
          isValid = false;
        } else {
          if (commonEmailMistakes.some((mistake) => email.toLowerCase().includes(mistake))) {
            setError('email', { message: 'Email không hợp lệ' });
            isValid = false;
          }
        }
      }

      // password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(data.password)) {
        setError('password', {
          type: 'manual',
          message:
            'Mật khẩu phải có ít nhất 6 kí tự và bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số',
        });
        isValid = false;
      }

      return isValid;
    },
    [setError]
  );

  // MARK: Register Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      // validate form
      if (!handleValidate(data)) return;

      // start loading
      setIsLoading(true);

      try {
        // register logic here
        const { user, message } = await registerApi(data);

        // sign in user
        const callback = await signIn('credentials', {
          usernameOrEmail: user.username,
          password: data.password,
          redirect: false,
        });

        if (callback?.error) {
          toast.error(callback.error);
        } else {
          // show success message
          toast.success(message);

          // redirect to home page
          router.push('/');
        }
      } catch (err: any) {
        // show error message
        console.log(err);
        toast.error(err.message);
      } finally {
        // stop loading
        setIsLoading(false);
      }
    },
    [handleValidate, router]
  );

  // keyboard event
  useEffect(() => {
    // set page title
    document.title = 'Đăng ký - Mona Edu';

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit(onSubmit)();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleSubmit, onSubmit]);

  return (
    <div className='relative min-h-screen w-full overflow-hidden'>
      <Link href='/' className='hidden md:block w-[44px] absolute z-30 top-21 left-21 rounded-md'>
        <Image src='/images/logo.png' width={70} height={70} alt='logo' />
      </Link>

      <div className='hidden md:block absolute top-[0%] left-0 w-[32vw]'>
        <Image
          className='w-full h-full object-contain object-left'
          src='/backgrounds/vector-1.png'
          width={600}
          height={600}
          alt='shape-1'
        />
      </div>

      <div className='hidden md:block absolute bottom-[0%] left-[10%] w-[35vw]'>
        <Image
          className='w-full h-full object-contain object-bottom'
          src='/backgrounds/vector-2.png'
          width={600}
          height={600}
          alt='shape-2'
        />
      </div>

      <div className='hidden md:block absolute top-[0%] left-[0%] w-[54vw]'>
        <Image
          className='w-full h-full object-contain object-top'
          src='/backgrounds/vector-3.png'
          width={625}
          height={680}
          alt='shape-3'
        />
      </div>

      <div className='hidden md:block absolute bottom-[0%] left-[0%] w-[54vw]'>
        <Image
          className='w-full h-full object-contain object-left'
          src='/backgrounds/vector-4.png'
          width={600}
          height={600}
          alt='shape-3'
        />
      </div>

      <div className='hidden md:block absolute z-20 top-[15.5%] left-0 pl-[40px] leading-10 text-[28px] max-w-[33%]'>
        <p className='text-orange-400 drop-shadow-sm left-[46px] font-bold text-3xl mb-2'>MONAEDU</p>
        <p>Hãy cùng nhau xây dựng kiến thức mọi lúc, mọi nơi nhé.</p>
      </div>

      <div className='hidden md:block absolute z-20 left-[3vw] bottom-[10%] w-[38vw] lg:w-[30vw]'>
        <Image
          className='w-full h-full object-contain object-top'
          src='/backgrounds/focus_image.png'
          width={625}
          height={680}
          alt='vector-5'
        />
      </div>

      {/* MARK: Body */}
      <div className='flex items-start justify-center px-[10%] pt-16 pb-12 absolute z-10 top-0 right-0 bottom-0 h-screen w-full md:w-2/3 bg-neutral-900 md:rounded-l-[40px] md:shadow-lg md:border-l-2 md:border-gray-white overflow-y-auto'>
        {/* <BeamsBackground /> */}

        <div className='relative z-10 flex flex-col gap-6 w-full'>
          <div className='flex items-center gap-3'>
            <div className='md:hidden w-[40px] rounded-md overflow-hidden shadow-lg'>
              <Image
                className='w-full h-full object-contain object-left'
                src='/images/logo.png'
                width={80}
                height={80}
                alt='logo'
              />
            </div>
            <h1 className='font-semibold text-3xl text-light'>Tạo tài khoản</h1>
          </div>

          <div className='flex flex-wrap justify-between gap-6'>
            <Input
              id='firstName'
              label='Tên'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              className='min-w-[40%] w-full sm:w-auto bg-white rounded-2xl'
              onFocus={() => clearErrors('firstName')}
            />

            <Input
              id='lastName'
              label='Họ'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              className='min-w-[40%] w-full sm:w-auto bg-white rounded-2xl'
              onFocus={() => clearErrors('lastName')}
            />
          </div>

          <Input
            id='username'
            label='Tên đăng nhập'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='text'
            className='min-w-[40%] w-full sm:w-auto bg-white rounded-2xl'
            onFocus={() => clearErrors('username')}
          />

          <Input
            id='email'
            label='Email'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='text'
            className='min-w-[40%] w-full sm:w-auto bg-white rounded-2xl'
            onFocus={() => clearErrors('email')}
          />

          <Input
            id='password'
            label='Mật khẩu'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='password'
            className='min-w-[40%] w-full sm:w-auto bg-white rounded-2xl'
            onFocus={() => clearErrors('password')}
          />

          <div className='flex items-center justify-center gap-3'>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50  ${
                isLoading ? 'bg-slate-200 pointer-events-none' : ''
              }`}
            >
              <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
              <span className='inline-flex font-semibold h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 trans-300 px-3 py-1 text-sm text-white backdrop-blur-3xl'>
                {isLoading ? (
                  <FaCircleNotch size={18} className='text-slate-400 trans-200 animate-spin' />
                ) : (
                  'Tạo tài khoản'
                )}
              </span>
            </button>
          </div>

          <Divider size={2} />

          <p className='font-semibold text-center text-light'>
            Đã có tài khoản?{' '}
            <Link href='/auth/login' className='underline underline-offset-2'>
              Login
            </Link>
          </p>

          <div className='relative w-full border h-px border-white my-2'>
            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg px-3 py-1 font-semibold'>
              Hoặc
            </span>
          </div>

          <div className='flex flex-wrap md:flex-nowrap justify-center gap-x-6 gap-y-4'>
            <button className='relative group/btn flex items-center gap-2 group rounded-2xl border bg-neutral-800 text-light border-dark px-2.5 py-3'>
              <div className='aspect-square rounded-full wiggle flex-shrink-0'>
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
              <div className='aspect-square rounded-full wiggle flex-shrink-0'>
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
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;
