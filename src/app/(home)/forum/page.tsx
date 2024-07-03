import AddQuestionForm from '@/components/AddQuestionForm'
import BeamsBackground from '@/components/backgrounds/BeamsBackground'
import BoxesBackground from '@/components/backgrounds/BoxesBackground'
import Divider from '@/components/Divider'
import Pagination from '@/components/layouts/Pagination'
import QuestionItem from '@/components/QuestionItem'
import { IQuestion } from '@/models/QuestionModel'
import { getForumPageApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'

async function ForumPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let questions: IQuestion[] = []
  let amount: number = 0
  let itemsPerPage: number = 8

  try {
    // get query
    const query = handleQuery(searchParams)

    const res = await getForumPageApi(query)

    questions = res.questions
    amount = res.amount
  } catch (err: any) {
    console.error(err)
  }

  return (
    <div>
      {/* Head */}
      <div className='bg-white'>
        <div className='max-w-1200 h-80 mx-auto px-21 md:-mt-[72px] md:pt-[72px] pt-21'>
          {/* Banner */}
          <div className='h-96 px-21 relative w-full overflow-hidden bg-neutral-800 flex flex-col items-center justify-center rounded-xl border-b-2 border-primary shadow-md'>
            <div className='absolute inset-0 w-full h-full bg-dark-0 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none' />

            <BeamsBackground />
            <h1 className='md:text-4xl text-center text-xl text-light relative z-20'>Hỏi và trả lời</h1>
            <p className='text-center mt-2 text-slate-200 relative z-20'>
              Hãy chia sẻ kiến thức và kinh nghiệm rộng lớn của bạn với cộng đồng.
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className='bg-neutral-800 pt-32 md:pt-44 -mb-48 pb-48'>
        <div className='max-w-1200 mx-auto px-21'>
          <AddQuestionForm />

          <Divider size={12} />

          {/* Question List */}
          <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-21'>
            {questions.map(question => (
              <QuestionItem question={question} key={question._id} />
            ))}
          </ul>

          <Divider size={12} />

          {/* Pagination */}
          <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemsPerPage} />

          <Divider size={25} />
        </div>
      </div>
    </div>
  )
}

export default ForumPage
