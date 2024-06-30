import { getAllCategoriesApi } from '@/requests'
import { Link } from '@react-email/components'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
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
      data: [],
    },
  ])

  // get categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        // send request to get categories
        const { categories } = await getAllCategoriesApi()
        console.log('categories: ', categories)
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
      console.log('index: ', index, list)

      if (index + 1 === list.length) {
        const newList = list.slice(0, index)
        setList(newList)
      }
    },
    [list]
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          className={`hidden md:flex absolute z-50 top-[60px] left-[196px] font-body tracking-wider bg-white bg-opacity-95 text-dark rounded-lg shadow-lg ${className}`}
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
            <ul className='flex flex-col' onMouseLeave={() => handleMouseLeave(tabIndex)} key={tabIndex}>
              {tab.data.map((item: any, itemIndex: number) => (
                <li className='p-0.5' onMouseOver={() => handleMouseOver(item)} key={itemIndex}>
                  <Link
                    href={`/categories/${item.slug}`}
                    className={`w-full h-9 flex items-center justify-between gap-3 px-2.5 hover:bg-secondary group trans-300 hover:rounded-xl hover:shadow-md ${
                      list[tabIndex + 1] && list[tabIndex + 1].ref === item._id
                        ? 'bg-secondary rounded-xl shadow-md'
                        : ''
                    }`}
                  >
                    <span
                      className={`text-dark group-hover:text-light ${
                        list[tabIndex + 1] && list[tabIndex + 1].ref === item._id ? 'text-white' : ''
                      }`}
                    >
                      {item.title}
                    </span>
                    {!!item.subs?.data.length && (
                      <FaChevronRight
                        size={12}
                        className={`wiggle text-dark group-hover:text-light  ${
                          list[tabIndex + 1] && list[tabIndex + 1].ref === item._id ? 'text-white' : ''
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

export default CategoryTabs
