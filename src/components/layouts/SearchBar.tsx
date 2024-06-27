import { searchCoursesApi } from '@/requests'
import { Link } from '@react-email/components'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaSearch } from 'react-icons/fa'
import { PiLightningFill } from 'react-icons/pi'
import { RiDonutChartFill } from 'react-icons/ri'

function SearchBar() {
  // search
  const [openSearch, setOpenSearch] = useState<boolean>(true)
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
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
      setSearchResults(null)
    }
  }, [searchValue, handleSearch])

  return (
    <div className={`flex items-center max-w-[500px] w-full trans-300`}>
      <div
        className={`${
          !searchResults ? 'overflow-hidden' : ''
        } w-full border border-dark rounded-[24px] relative mr-2.5 h-[36px] flex items-center justify-center text-dark`}
      >
        <input
          type='text'
          placeholder='Search...'
          className='appearance-none w-full h-full font-body tracking-wider px-4 py-2 outline-none rounded-0 rounded-l-[24px] bg-white'
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onFocus={() => {
            setOpenResults(true)
            setOpenSearch(true)
          }}
          onBlur={() => {
            setOpenResults(false)
            setOpenSearch(false)
          }}
        />
        <Link
          href={`/search?search=${searchValue}`}
          onClick={e => !searchValue && e.preventDefault()}
          className={`group h-full w-[40px] flex justify-center items-center rounded-r-[24px] bg-white ${
            searchLoading ? 'pointer-events-none' : ''
          }`}
        >
          {searchLoading ? (
            <RiDonutChartFill size={20} className='animate-spin text-slate-300' />
          ) : (
            <FaSearch size={16} className='wiggle' />
          )}
        </Link>

        {/* Search Results */}
        <ul
          className={`${
            searchResults && openResults ? 'max-h-[500px] p-2' : 'max-h-0 p-0'
          } absolute z-20 bottom-12 lg:bottom-auto lg:top-12 left-0 w-full rounded-lg shadow-medium bg-slate-200 bg-opacity-75 gap-2 overflow-y-auto transition-all duration-300`}
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

                <p className='w-full text-ellipsis line-clamp-2 text-dark font-body text-sm tracking-wide leading-5 -mt-0.5'>
                  {course.title}
                </p>
              </Link>
            ))
          ) : (
            <p className='text-sm text-center'>0 kết quả tìm thấy</p>
          )}
        </ul>
      </div>
    </div>
  )
}

export default SearchBar
