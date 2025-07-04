import { getAllCategoriesApi } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaChevronRight } from 'react-icons/fa'

interface CategoryTabsProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  className?: string
}

function CategoryTabs({ open, setOpen, className = '' }: CategoryTabsProps) {
  // states
  const [categories, setCategories] = useState<any[]>([])
  const [list, setList] = useState<any[]>([
    {
      ref: 'Category Tabs',
      data: categories,
    },
  ])

  // refs
  const timeoutRef = useRef<any>(null)
  const tabsRef = useRef<HTMLUListElement>(null)

  // get categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        // send request to get categories
        const { categories } = await getAllCategoriesApi('', { next: { revalidate: 3600 } })
        setCategories(categories)
        setList([
          {
            ref: 'Category Tabs',
            data: categories,
          },
        ])
      } catch (err: any) {
        console.log(err)
        toast.error(err.response.data.message)
      }
    }
    getCategories()
  }, [])

  const findDeep = useCallback(
    (item: any) => list.findIndex(tab => tab.data.map((i: any) => i.title).includes(item.title)),
    [list]
  )

  const handleMouseOver = useCallback(
    (item: any) => {
      if (!item.subs) return

      const deep = findDeep(item)
      const subs = item.subs
      let newList = [...list]
      newList = newList.slice(0, deep + 1)
      newList[deep + 1] = subs
      setList(newList)
    },
    [findDeep, list]
  )

  const handleMouseLeave = useCallback(
    (index: number) => {
      if (index + 1 === list.length) {
        const newList = list.slice(0, index)
        setList(newList)
      }
    },
    [list]
  )

  // auto close tabs if not hover in specific time
  useEffect(() => {
    // if (!tabsRef.current || !timeoutRef.current || !open) return

    let timeout: any = timeoutRef.current
    let tabs: any = tabsRef.current

    if (!tabs || !open) return

    tabs.addEventListener('mouseenter', () => {
      clearTimeout(timeout)
    })

    timeout = setTimeout(() => {
      setList([
        {
          ref: 'Category Tabs',
          data: categories,
        },
      ])
      setOpen(false)
    }, 750)
  }, [setOpen, open, categories])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute left-[196px] top-[60px] z-50 hidden rounded-lg bg-white bg-opacity-95 font-body tracking-wider text-dark shadow-lg md:flex ${className}`}
          onMouseLeave={() => {
            setList([
              {
                title: 'Category Tabs',
                data: categories,
              },
            ])
            setOpen(false)
          }}
        >
          {list.map((tab, tabIndex) => (
            <ul
              className="flex flex-col p-0.5"
              onMouseLeave={() => handleMouseLeave(tabIndex)}
              key={tabIndex}
              ref={tabsRef}
            >
              {tab?.data?.map((item: any, itemIndex: number) => (
                <li
                  className="p-0.5"
                  onMouseOver={() => handleMouseOver(item)}
                  key={itemIndex}
                >
                  <Link
                    href={`/categories/${item.slug}`}
                    className={`trans-300 group flex h-9 w-full items-center justify-between gap-3 px-2.5 hover:rounded-xl hover:bg-secondary hover:shadow-md ${
                      list[tabIndex + 1] && list[tabIndex + 1].ref === item._id
                        ? 'rounded-xl bg-secondary shadow-md'
                        : ''
                    }`}
                  >
                    <span
                      className={`text-dark group-hover:text-light ${
                        list[tabIndex + 1] && list[tabIndex + 1].ref === item._id ? 'text-light' : ''
                      }`}
                    >
                      {item.title}
                    </span>
                    {!!item.subs?.data?.length && (
                      <FaChevronRight
                        size={12}
                        className={`wiggle text-dark group-hover:text-light ${
                          list[tabIndex + 1] && list[tabIndex + 1].ref === item._id ? 'text-light' : ''
                        }`}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(CategoryTabs)
