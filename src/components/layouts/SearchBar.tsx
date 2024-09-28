import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenSearchBar } from '@/libs/reducers/modalReducer'
import { getCoursesApi, searchCoursesApi } from '@/requests'
import Link from 'next/link'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaSearch } from 'react-icons/fa'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'
import { RiDonutChartFill } from 'react-icons/ri'
import { TiDelete } from 'react-icons/ti'
import SearchResultItem from './SearchResultItem'

function SearchBar() {
  // hook
  const dispatch = useAppDispatch()
  const open = useAppSelector(state => state.modal.openSearchBar)

  // search state
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [initResults, setInitResults] = useState<any[] | null>([])
  const [searchResults, setSearchResults] = useState<any[] | null>(null)
  const searchTimeout = useRef<any>(null)
  const [openResults, setOpenResults] = useState<boolean>(false)

  // refs
  const searchResultsRef = useRef<HTMLUListElement>(null)

  // handle search
  const handleSearch = useCallback(async () => {
    // search value not empty
    if (!searchValue) {
      return
    }

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

  // handle open transition
  useEffect(() => {
    const ref = searchResultsRef.current
    if (!ref) return

    if (searchResults && openResults) {
      ref.classList.remove('hidden')
      setTimeout(() => {
        ref?.classList.remove('opacity-0')
        ref?.classList.add('opacity-100')
      }, 0)
    } else {
      ref.classList.remove('opacity-100')
      ref?.classList.add('opacity-0')
      setTimeout(() => {
        if (!ref) return
        ref.classList.add('hidden')
      }, 300)
    }
  }, [searchResults, openResults])

  return (
    <div
      className={`${
        open
          ? 'bg-dark-100 opacity-100 lg:bg-transparent'
          : 'translate-y-full opacity-0 md:-translate-y-full'
      } trans-300 absolute left-0 right-0 top-0 z-20 flex h-[72px] w-full items-center rounded-b-[40px] px-4 md:px-8 lg:static lg:max-w-[400px] lg:translate-y-0 lg:opacity-100 xl:max-w-[500px]`}
    >
      {/* Hide Button */}
      <button
        className={`absolute left-1/2 top-0 -translate-x-1/2 md:bottom-0 md:top-auto lg:hidden ${
          open ? '-translate-y-1/2 md:translate-y-1/2' : ''
        } trans-200 z-30 max-w-8 rounded-full bg-white px-1.5 py-1.5 shadow-lg`}
        onClick={() => dispatch(setOpenSearchBar(false))}
      >
        <IoChevronUp
          size={18}
          className="wiggle hidden text-dark md:block"
        />
        <IoChevronDown
          size={18}
          className="wiggle text-dark md:hidden"
        />
      </button>

      {/* Search */}
      <div
        className={`relative flex h-[38px] w-full items-center justify-center overflow-hidden rounded-[24px] border border-dark text-dark`}
      >
        <button
          className={`${
            searchValue.trim() ? 'max-w-[60px]' : 'max-w-0'
          } trans-500 group flex h-full w-[60px] items-center justify-center overflow-hidden bg-white ${
            searchLoading ? 'pointer-events-none' : ''
          }`}
          onClick={() => setSearchValue('')}
        >
          <TiDelete
            size={20}
            className="wiggle text-orange-600"
          />
        </button>

        <input
          type="text"
          placeholder="Bạn muốn học gì?..."
          className={`${
            searchValue.trim() ? '' : 'pl-[20px]'
          } trans-500 rounded-0 h-full w-full appearance-none bg-white pb-0.5 font-body tracking-wider outline-none`}
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
          className={`group flex h-full w-[60px] items-center justify-center bg-white ${
            searchLoading ? 'pointer-events-none' : ''
          }`}
        >
          {searchLoading ? (
            <RiDonutChartFill
              size={20}
              className="animate-spin text-slate-300"
            />
          ) : (
            <FaSearch
              size={16}
              className="wiggle"
            />
          )}
        </Link>
      </div>

      {/* Search Results */}
      <ul
        className={`${
          searchResults && openResults ? '' : ''
        } absolute bottom-full left-0 z-20 hidden max-h-[calc(100vh-100px)] w-full gap-2 overflow-y-auto rounded-lg bg-neutral-800 p-2 text-light opacity-0 shadow-medium transition-all duration-300 md:bottom-auto md:top-full`}
        ref={searchResultsRef}
      >
        {searchResults?.length ? (
          searchResults.map(course => (
            <SearchResultItem
              course={course}
              key={course._id}
            />
          ))
        ) : (
          <p className="text-center text-sm">0 kết quả tìm thấy</p>
        )}
      </ul>
    </div>
  )
}

export default memo(SearchBar)
