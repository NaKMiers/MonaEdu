import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenSearchBar } from '@/libs/reducers/modalReducer'
import { getCoursesApi, searchCoursesApi } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaSearch } from 'react-icons/fa'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'
import { PiLightningFill } from 'react-icons/pi'
import { RiDonutChartFill } from 'react-icons/ri'
import { TiDelete } from 'react-icons/ti'

function SearchBar() {
  // hook
  const dispatch = useAppDispatch()
  const open = useAppSelector(state => state.modal.openSearchBar)

  // search
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [initResults, setInitResults] = useState<any[] | null>([])
  const [searchResults, setSearchResults] = useState<any[] | null>(null)
  const searchTimeout = useRef<any>(null)
  const [openResults, setOpenResults] = useState<boolean>(false)

  // handle search
  const handleSearch = useCallback(async () => {
    // start loading
    setSearchLoading(true)

    try {
      // send request to search courses
      const { courses } = await searchCoursesApi(searchValue)

      // set search results
      setSearchResults(courses)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setSearchLoading(false)
    }
  }, [searchValue])

  // auto search after 0.5s when search value changes
  useEffect(() => {
    if (searchValue) {
      clearTimeout(searchTimeout.current)
      searchTimeout.current = setTimeout(() => {
        handleSearch()
      }, 500)
    } else {
      setSearchResults(initResults)
    }
  }, [initResults, searchValue, handleSearch])

  // get some courses as initial results
  useEffect(() => {
    const getSuggestedCourses = async () => {
      try {
        // send request to get suggested courses
        const { courses } = await getCoursesApi('?limit=3&sort=joined|-1', { next: { revalidate: 300 } })

        // set search results
        setSearchResults(courses)
        setInitResults(courses)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    getSuggestedCourses()
  }, [])

  return (
    <div
      className={`${
        open
          ? 'opacity-100 bg-dark-100 lg:bg-transparent'
          : 'translate-y-full md:-translate-y-full opacity-0'
      } absolute z-20 h-[72px] px-4 md:px-8 rounded-b-[40px] top-0 lg:static left-0 right-0 lg:opacity-100 lg:translate-y-0 flex items-center lg:max-w-[400px] xl:max-w-[500px] w-full trans-300`}
    >
      {/* Hide Button */}
      <button
        className={`lg:hidden absolute top-0 md:top-auto md:bottom-0 left-1/2 -translate-x-1/2 ${
          open ? '-translate-y-1/2 md:translate-y-1/2' : ''
        } z-30 rounded-full px-1.5 py-1.5 max-w-8 bg-white shadow-lg trans-200`}
        onClick={() => dispatch(setOpenSearchBar(false))}
      >
        <IoChevronUp size={18} className='wiggle text-dark hidden md:block' />
        <IoChevronDown size={18} className='wiggle text-dark md:hidden' />
      </button>

      {/* Search */}
      <div
        className={`w-full border border-dark rounded-[24px] relative h-[38px] overflow-hidden flex items-center justify-center text-dark`}
      >
        <button
          className={`${
            searchValue.trim() ? 'max-w-[60px]' : 'max-w-0'
          } trans-500 overflow-hidden group h-full w-[60px] flex justify-center items-center bg-white ${
            searchLoading ? 'pointer-events-none' : ''
          }`}
          onClick={() => setSearchValue('')}
        >
          <TiDelete size={20} className='wiggle text-orange-600' />
        </button>

        <input
          type='text'
          placeholder='Search...'
          className={`${
            searchValue.trim() ? '' : 'pl-[20px]'
          } trans-500 appearance-none w-full h-full font-body tracking-wider pb-0.5 outline-none rounded-0 bg-white`}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onFocus={() => {
            setOpenResults(true)
            dispatch(setOpenSearchBar(true))
          }}
          onBlur={() => {
            setOpenResults(false)
          }}
        />

        <Link
          href={`/search?search=${searchValue}`}
          onClick={e => !searchValue && e.preventDefault()}
          className={`group h-full w-[60px] flex justify-center items-center bg-white ${
            searchLoading ? 'pointer-events-none' : ''
          }`}
        >
          {searchLoading ? (
            <RiDonutChartFill size={20} className='animate-spin text-slate-300' />
          ) : (
            <FaSearch size={16} className='wiggle' />
          )}
        </Link>
      </div>

      {/* Search Results */}
      <ul
        className={`${
          searchResults && openResults ? 'max-h-[500px] p-2 shadow-medium' : 'max-h-0 p-0'
        } absolute z-20 bottom-full md:bottom-auto md:top-full left-0 w-full rounded-lg bg-neutral-800 text-light gap-2 overflow-y-auto transition-all duration-300`}
      >
        {searchResults?.length ? (
          searchResults.map(course => (
            <Link
              href={`/${course.slug}`}
              key={course._id}
              className='flex gap-4 py-2 items-start rounded-lg p-2 hover:bg-sky-200 trans-200'
            >
              <div className='relative aspect-video flex-shrink-0'>
                {course.stock <= 0 && (
                  <div className='absolute top-0 left-0 right-0 flex justify-center items-start aspect-video bg-white rounded-lg bg-opacity-50'>
                    <Image
                      className='animate-wiggle -mt-1'
                      src='/images/sold-out.jpg'
                      width={28}
                      height={28}
                      alt='sold-out'
                    />
                  </div>
                )}
                <Image
                  className='rounded-md'
                  src={course.images[0]}
                  width={70}
                  height={70}
                  alt='course'
                />

                {course.flashSale && (
                  <PiLightningFill
                    className='absolute -top-1.5 left-1 text-yellow-400 animate-bounce'
                    size={16}
                  />
                )}
              </div>

              <p className='w-full text-ellipsis line-clamp-2 font-body text-sm tracking-wide leading-5 -mt-0.5'>
                {course.title}
              </p>
            </Link>
          ))
        ) : (
          <p className='text-sm text-center'>0 kết quả tìm thấy</p>
        )}
      </ul>
    </div>
  )
}

export default memo(SearchBar)
