'use client';

import { addQuestionApi } from '@/requests/questionRequest';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingButton from './LoadingButton';

function AddQuestionForm() {
  // hooks
  const { data: session } = useSession();
  const curUser: any = session?.user;
  const router = useRouter();

  // states
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // handle add question
  const handleAddQuestion = useCallback(async () => {
    // check user
    if (!curUser) {
      toast.error('Hãy đăng nhập để đặt câu hỏi!');
      return;
    }

    // check value
    if (!value.trim()) {
      toast.error('Hãy nhập câu hỏi của bạn!');
      return;
    }

    // start loading
    setLoading(true);

    try {
      await addQuestionApi({ content: value });

      // reset
      setValue('');

      // reload page
      router.refresh();
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      // stop loading
      setLoading(false);
    }
  }, [router, curUser, value]);

  return (
    <div className='flex gap-3'>
      <Link
        href={`/user/${curUser?.username || curUser?.email}`}
        className='flex-shrink-0 w-[40px] h-[40px] rounded-full overflow-hidden shadow-lg border-2 border-white'
      >
        <Image
          src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
          width={40}
          height={40}
          alt='avatar'
        />
      </Link>

      <textarea
        className='w-full px-3 py-1 rounded-lg shadow-lg outline-none text-slate-700 font-body tracking-wider placeholder:font-body placeholder:tracking-wider'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={1}
        placeholder={`Bạn đang nghĩ gì ${curUser?.firstName ? `, ${curUser.firstName}` : ''}?`}
      />

      <LoadingButton
        className='flex items-center justify-center rounded-lg bg-secondary h-[40px] px-4 font-semibold text-md shadow-lg text-white hover:text-dark hover:bg-white border-2 border-light trans-200'
        isLoading={loading}
        text='Submit'
        onClick={handleAddQuestion}
      />
    </div>
  );
}

export default AddQuestionForm;
