'use client';

import Divider from '@/components/Divider';
import QuestionItem from '@/components/QuestionItem';
import Pagination from '@/components/layouts/Pagination';
import { useAppDispatch } from '@/libs/hooks';
import { setPageLoading } from '@/libs/reducers/modalReducer';
import { IQuestion } from '@/models/QuestionModel';
import { getMyQuestionsApi } from '@/requests';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function MyQuestionsPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // hooks
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const curUser: any = session?.user;

  // states
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [amount, setAmount] = useState<number>(0);

  // get my questions
  useEffect(() => {
    const getQuestions = async () => {
      // start page loading
      dispatch(setPageLoading(true));

      try {
        // send request to get my questions
        const { questions, amount } = await getMyQuestionsApi();

        // set states
        setQuestions(questions);
        setAmount(amount);
      } catch (err: any) {
        console.log(err);
        toast.error(err.message);
      } finally {
        // stop page loading
        dispatch(setPageLoading(false));
      }
    };

    if (curUser?._id) {
      getQuestions();
    }
  }, [dispatch, curUser?._id]);

  return (
    <div className='max-w-1200 mx-auto px-21'>
      <Divider size={12} />

      {/* Heading */}
      <h1 className='text-4xl font-semibold px-21 text-white'>Các câu hỏi của tôi</h1>

      <Divider size={8} />

      {/* MAIN List */}
      {!!questions.length ? (
        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-21'>
          {questions.map((question) => (
            <QuestionItem question={question} key={question._id} />
          ))}
        </ul>
      ) : (
        <div className='font-body tracking-wider text-center text-light'>
          <p className='italic'>
            Bạn chưa đặt câu hỏi nào, hãy thử đặt câu hỏi để nhận được câu trả lời từ cộng đồng.
          </p>
          <Link
            href='/forum'
            className='text-sky-500 underline underline-offset-2 hover:text-sky-700 trans-200'
          >
            Hỏi đáp ngay.
          </Link>
        </div>
      )}

      <Divider size={8} />

      {/* Pagination */}
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={16} />

      <Divider size={20} />
    </div>
  );
}

export default MyQuestionsPage;
