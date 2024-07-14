'use client';

import Divider from '@/components/Divider';
import Input from '@/components/Input';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminMeta from '@/components/admin/AdminMeta';
import LessonItem from '@/components/admin/LessonItem';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import Pagination from '@/components/layouts/Pagination';
import { useAppDispatch } from '@/libs/hooks';
import { setPageLoading } from '@/libs/reducers/modalReducer';
import { IChapter } from '@/models/ChapterModel';
import { ILesson } from '@/models/LessonModel';
import { activateLessonsApi, deleteLessonsApi, getAllChapterLessonsApi } from '@/requests';
import { handleQuery } from '@/utils/handleQuery';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaSearch, FaSort } from 'react-icons/fa';

function AllLessonsPage({
  params: { chapterId },
  searchParams,
}: {
  params: { chapterId: string };
  searchParams?: { [key: string]: string[] | string };
}) {
  // store
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

  // states
  const [chapter, setChapter] = useState<IChapter | null>(null);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);

  // loading & opening
  const [loadingLessons, setLoadingLessons] = useState<string[]>([]);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);

  // values
  const itemPerPage = 9;

  // form
  const defaultValues = useMemo<FieldValues>(() => {
    return {
      search: '',
      sort: 'updatedAt|-1',
      active: 'true',
      expire: '',
      renew: '',
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
    reset,
  } = useForm<FieldValues>({
    defaultValues,
  });

  // MARK: Get Data
  // get all lessons at first time
  useEffect(() => {
    // get all lessons
    const getAllLessons = async () => {
      const query = handleQuery(searchParams);

      // start page loading
      dispatch(setPageLoading(true));

      try {
        // sent request to server
        const { lessons, amount } = await getAllChapterLessonsApi(chapterId, query);
        setChapter(lessons[0]?.chapterId);

        // update lessons from state
        setLessons(lessons);
        setAmount(amount);

        setValue('search', searchParams?.search || getValues('search'));
        setValue('sort', searchParams?.sort || getValues('sort'));
        setValue('active', searchParams?.active || getValues('active').toString());
        setValue('expire', searchParams?.expire || getValues('expire'));
        setValue('renew', searchParams?.renew || getValues('renew'));
      } catch (err: any) {
        console.log(err);
        toast.error(err.message);
      } finally {
        // stop page loading
        dispatch(setPageLoading(false));
      }
    };
    getAllLessons();
  }, [dispatch, getValues, searchParams, setValue, chapterId]);

  // MARK: Handlers
  // activate lesson
  const handleActivateLessons = useCallback(async (ids: string[], value: boolean) => {
    try {
      // send request to server
      const { updatedLessons, message } = await activateLessonsApi(ids, value);

      // update lessons from state
      setLessons((prev) =>
        prev.map((lesson) =>
          updatedLessons.map((lesson: ILesson) => lesson._id).includes(lesson._id)
            ? { ...lesson, active: value }
            : lesson
        )
      );

      // show success message
      toast.success(message);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  }, []);

  // delete lesson
  const handleDeleteLessons = useCallback(
    async (ids: string[]) => {
      setLoadingLessons(ids);

      try {
        // send request to server
        const { deletedLessons, message } = await deleteLessonsApi(ids);

        // remove deleted tags from state
        setLessons((prev) =>
          prev.filter(
            (lesson) => !deletedLessons.map((lesson: ILesson) => lesson._id).includes(lesson._id)
          )
        );

        // show success message
        toast.success(message);

        // refresh page
        router.refresh();
      } catch (err: any) {
        console.log(err);
        toast.error(err.message);
      } finally {
        setLoadingLessons([]);
        setSelectedLessons([]);
      }
    },
    [router]
  );

  // handle optimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    (data) => {
      // reset page
      if (searchParams?.page) {
        delete searchParams.page;
      }

      // loop through data to prevent filter default
      for (let key in data) {
        if (data[key] === defaultValues[key]) {
          if (!searchParams?.[key]) {
            delete data[key];
          } else {
            data[key] = '';
          }
        }
      }

      return {
        ...searchParams,
        ...data,
      };
    },
    [searchParams, defaultValues]
  );

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      const params: any = handleOptimizeFilter(data);

      // handle query
      const query = handleQuery(params);

      // push to new url
      router.push(pathname + query);
    },
    [handleOptimizeFilter, router, pathname]
  );

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset();
    router.push(pathname);
  }, [reset, router, pathname]);

  // keyboard event
  useEffect(() => {
    // page title
    document.title = 'All Lessons - Mona Edu';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setSelectedLessons((prev) =>
          prev.length === lessons.length ? [] : lessons.map((lesson) => lesson._id)
        );
      }

      // Alt + Delete (Delete)
      if (e.altKey && e.key === 'Delete') {
        e.preventDefault();
        setIsOpenConfirmModal(true);
      }
    };

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown);

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lessons, selectedLessons, handleDeleteLessons, handleFilter, handleSubmit, handleResetFilter]);

  return (
    <div className='w-full'>
      {/* MARK: Top & Pagination */}
      <AdminHeader title='All Lessons' addLink={`/admin/lesson/${chapterId}/add`} />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* MARK: Filter */}
      <AdminMeta handleFilter={handleSubmit(handleFilter)} handleResetFilter={handleResetFilter}>
        {/* Search */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <Input
            className='md:max-w-[450px]'
            id='search'
            label='Search'
            disabled={false}
            register={register}
            errors={errors}
            type='text'
            icon={FaSearch}
            onFocus={() => clearErrors('info')}
          />
        </div>

        {/* MARK: Select Filter */}
        <div className='flex justify-end items-center flex-wrap gap-3 col-span-12 md:col-span-8'>
          {/* Sort */}
          <Input
            id='sort'
            label='Sort'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('info')}
            options={[
              {
                value: 'createdAt|-1',
                label: 'Newest',
              },
              {
                value: 'createdAt|1',
                label: 'Oldest',
              },
              {
                value: 'updatedAt|-1',
                label: 'Latest',
                selected: true,
              },
              {
                value: 'updatedAt|1',
                label: 'Earliest',
              },
            ]}
          />

          {/* Active */}
          <Input
            id='active'
            label='Active'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('info')}
            options={[
              {
                value: 'all',
                label: 'All',
              },
              {
                value: true,
                label: 'On',
                selected: true,
              },
              {
                value: false,
                label: 'Off',
              },
            ]}
          />
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-wrap justify-end items-center gap-2 col-span-12'>
          {/* Select All Button */}
          <button
            className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-white trans-200'
            title='Alt + A'
            onClick={() =>
              setSelectedLessons(selectedLessons.length > 0 ? [] : lessons.map((lesson) => lesson._id))
            }
          >
            {selectedLessons.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Activate Many Button */}
          {selectedLessons.some((id) => !lessons.find((lesson) => lesson._id === id)?.active) && (
            <button
              className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-white trans-200'
              onClick={() => handleActivateLessons(selectedLessons, true)}
            >
              Activate
            </button>
          )}

          {/* Deactivate Many Button */}
          {selectedLessons.some((id) => lessons.find((lesson) => lesson._id === id)?.active) && (
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white trans-200'
              onClick={() => handleActivateLessons(selectedLessons, false)}
            >
              Deactivate
            </button>
          )}

          {/* Delete Many Button */}
          {!!selectedLessons.length && (
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white trans-200'
              title='Alt + Delete'
              onClick={() => setIsOpenConfirmModal(true)}
            >
              Delete
            </button>
          )}
        </div>
      </AdminMeta>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Lessons'
        content='Are you sure that you want to delete these lessons?'
        onAccept={() => handleDeleteLessons(selectedLessons)}
        isLoading={loadingLessons.length > 0}
      />

      <Divider size={8} />

      {/* Chapter */}
      <p className='font-semibold text-center text-3xl'>Chapter: {chapter?.title}</p>

      {/* MARK: Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} lesson{amount > 1 && 's'}
      </div>

      {/* MARK: MAIN LIST */}
      <div className='grid gap-21 grid-cols-1 md:grid-cols-2'>
        {lessons.map((lesson) => (
          <LessonItem
            data={lesson}
            loadingLessons={loadingLessons}
            // selected
            selectedLessons={selectedLessons}
            setSelectedLessons={setSelectedLessons}
            // functions
            handleActivateLessons={handleActivateLessons}
            handleDeleteLessons={handleDeleteLessons}
            key={lesson._id}
          />
        ))}
      </div>
    </div>
  );
}

export default AllLessonsPage;
