'use client'

import Divider from '@/components/Divider'
import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import TextEditor from '@/components/Tiptap'
import AdminHeader from '@/components/admin/AdminHeader'
import CategoryItem from '@/components/admin/CategoryItem'
import { languages } from '@/constants/languages'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import { addCourseApi, getForceAllCategoriesApi, getForceAllTagsApi } from '@/requests'
import Image from 'next/image'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BsSourceforge } from 'react-icons/bs'
import { FaFile, FaMoneyBillAlt, FaUser } from 'react-icons/fa'
import { FaPlay, FaX } from 'react-icons/fa6'
import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddCoursePage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)

  // states
  const [tags, setTags] = useState<ITag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isActiveChecked, setIsActiveChecked] = useState<boolean>(true)
  const [isBootedChecked, setIsBootedChecked] = useState<boolean>(false)

  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    clearErrors,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      price: '',
      oldPrice: '',
      citing: '',
      author: '',
      textHook: '',
      description: '',
      active: true,
      booted: false,
      languages: ['Vietnamese'],
    },
  })

  // get tags and categories
  useEffect(() => {
    const getTags = async () => {
      try {
        // send request to server to get all tags
        const { tags } = await getForceAllTagsApi() // cache: no-store
        setTags(tags)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    const getCategories = async () => {
      try {
        // send request to server to get all categories
        const { categories } = await getForceAllCategoriesApi() // cache: no-store
        setCategories(categories)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getTags()
    getCategories()
  }, [])

  // revoke blob url when component unmount
  useEffect(() => {
    // page title
    document.title = 'Add Course - Mona Edu'

    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [imageUrls])

  // handle add files when user select files
  const handleAddFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let newFiles = Array.from(e.target.files)

      // validate files's type and size
      newFiles = newFiles.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image file`)
          return false
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Only accept images under 5MB`)
          return false
        }
        return true
      })

      setFiles(prev => [...prev, ...newFiles])

      const urls = newFiles.map(file => URL.createObjectURL(file))
      setImageUrls(prev => [...prev, ...urls])

      e.target.value = ''
      e.target.files = null
    }
  }, [])

  // handle remove image
  const handleRemoveImage = useCallback(
    (url: string) => {
      const index = imageUrls.indexOf(url)

      // remove file from files
      const newFiles = files.filter((_, i) => i !== index)
      setFiles(newFiles)

      setImageUrls(prev => prev.filter(u => u !== url))
      URL.revokeObjectURL(url)
    },
    [files, imageUrls]
  )

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // price >= 0
      if (data.price < 0) {
        setError('price', { type: 'manual', message: 'Price must be >= 0' })

        isValid = false
      }

      if (data.oldPrice && data.oldPrice < 0) {
        setError('oldPrice', { type: 'manual', message: 'Old price must be >= 0' })
        isValid = false
      }

      if (!selectedTags.length) {
        toast.error('Please select at least 1 tag')
        isValid = false
      }

      if (!selectedCategory) {
        toast.error('Please select category')
        isValid = false
      }

      if (!files.length) {
        toast.error('Please select at least 1 image')
        isValid = false
      }

      return isValid
    },
    [setError, selectedCategory, selectedTags, files]
  )

  // send data to server to create new course
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (!handleValidate(data)) return

    // return
    dispatch(setLoading(true))

    try {
      const formData = new FormData()

      formData.append('title', data.title)
      formData.append('price', data.price)
      formData.append('oldPrice', data.oldPrice)
      formData.append('citing', data.citing)
      formData.append('author', data.author)
      formData.append('description', data.description)
      formData.append('active', data.active)
      formData.append('booted', data.booted)
      formData.append('textHook', data.textHook)
      formData.append('languages', JSON.stringify(data.languages))
      formData.append('tags', JSON.stringify(selectedTags))
      formData.append('category', selectedCategory)
      files.forEach(file => formData.append('images', file))

      // send request to server to create new course
      const { message } = await addCourseApi(formData)

      // show success message
      toast.success(message)

      // reset form
      setFiles([])
      imageUrls.forEach(url => URL.revokeObjectURL(url))
      setImageUrls([])
      setSelectedTags([])
      setSelectedCategory('')
      reset()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="mx-auto max-w-1200">
      <AdminHeader
        title="Add Course"
        backLink="/admin/course/all"
      />

      <Divider size={4} />

      <div className="rounded-lg bg-slate-200 p-21 shadow-lg">
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Title */}
          <Input
            id="title"
            label="Title"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="text"
            icon={RiCharacterRecognitionLine}
            onFocus={() => clearErrors('title')}
          />

          {/* Author */}
          <Input
            id="author"
            label="Author"
            disabled={isLoading}
            register={register}
            required
            errors={errors}
            type="text"
            rows={10}
            icon={FaUser}
            onFocus={() => clearErrors('author')}
          />

          {/* Citing */}
          <Input
            id="citing"
            label="Citing"
            disabled={isLoading}
            register={register}
            required
            errors={errors}
            type="text"
            rows={10}
            icon={BsSourceforge}
            onFocus={() => clearErrors('citing')}
          />
        </div>

        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Price */}
          <Input
            id="price"
            label="Price"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="number"
            icon={FaMoneyBillAlt}
            onFocus={() => clearErrors('price')}
          />

          {/* Old Price */}
          <Input
            id="oldPrice"
            label="Old Price"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="number"
            icon={FaMoneyBillAlt}
            onFocus={() => clearErrors('oldPrice')}
          />
        </div>

        {/* Text Hook */}
        <Input
          id="textHook"
          label="Hook"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="textarea"
          rows={3}
          icon={MdNumbers}
          className="mb-5"
          onFocus={() => clearErrors('textHook')}
        />

        {/* Description */}
        <p className="mb-1 text-xl font-semibold text-dark">Description</p>
        <TextEditor
          onChange={(content: string) => setValue('description', content)}
          className="mb-5 w-full rounded-lg border border-dark bg-slate-200 p-21 text-dark shadow-lg"
        />

        {/* Languages */}
        <Input
          id="languages"
          label="Languages"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="select"
          options={languages}
          multiple
          icon={MdNumbers}
          className="mb-5 text-light"
          onFocus={() => clearErrors('languages')}
        />

        {/* Active */}
        <div className="mb-4 flex">
          <div className="flex items-center rounded-lg bg-white px-3">
            <FaPlay
              size={16}
              className="text-secondary"
            />
          </div>
          <label
            className={`trans-200 cursor-pointer select-none rounded-lg border border-green-500 px-4 py-2 ${
              isActiveChecked ? 'bg-green-500 text-light' : 'bg-white text-green-500'
            }`}
            htmlFor="active"
            onClick={() => setIsActiveChecked(!isActiveChecked)}
          >
            Active
          </label>
          <input
            type="checkbox"
            id="active"
            hidden
            {...register('active', { required: false })}
          />
        </div>

        {/* Boot */}
        <div className="mb-4 flex">
          <div className="flex items-center rounded-lg bg-white px-3">
            <FaPlay
              size={16}
              className="text-secondary"
            />
          </div>
          <label
            className={`trans-200 cursor-pointer select-none rounded-lg border border-green-500 px-4 py-2 ${
              isBootedChecked ? 'bg-green-500 text-light' : 'bg-white text-green-500'
            }`}
            htmlFor="booted"
            onClick={() => setIsBootedChecked(!isBootedChecked)}
          >
            Boot
          </label>
          <input
            type="checkbox"
            id="booted"
            hidden
            {...register('booted', { required: false })}
          />
        </div>

        {/* Tags */}
        <div className="mb-5">
          <p className="mb-1 text-xl font-semibold text-dark">Select Tags</p>

          <div className="flex max-h-[196px] flex-wrap items-center gap-2 overflow-y-auto rounded-lg bg-white p-2">
            {tags.map(tag => (
              <Fragment key={tag._id}>
                <input
                  onChange={e =>
                    setSelectedTags(prev =>
                      e.target.checked ? [...prev, tag._id] : prev.filter(t => t !== tag._id)
                    )
                  }
                  hidden
                  type="checkbox"
                  id={tag._id}
                />
                <label
                  className={`trans-200 cursor-pointer select-none rounded-lg border border-green-500 px-3 py-1 text-sm text-green-500 ${
                    selectedTags.some(t => t === tag._id) ? 'bg-green-500 text-light' : ''
                  }`}
                  htmlFor={tag._id}
                >
                  {tag.title}
                </label>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-5">
          <p className="mb-1 text-xl font-semibold text-dark">Select Categories</p>

          <div className="flex flex-col gap-2">
            {categories.map(category => (
              <CategoryItem
                data={category}
                setCategories={setCategories}
                selectMode
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                key={category._id}
              />
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="mb-5">
          <div className="flex">
            <span className="inline-flex items-center rounded-bl-lg rounded-tl-lg border-[2px] border-slate-200 bg-slate-100 px-3 text-sm text-gray-900">
              <FaFile
                size={19}
                className="text-secondary"
              />
            </span>
            <div className="relative w-full border-[2px] border-l-0 border-slate-200 bg-white">
              <input
                id="images"
                className="peer block w-full bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-dark focus:outline-none focus:ring-0"
                placeholder=" "
                disabled={isLoading}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddFiles}
              />

              {/* label */}
              <label
                htmlFor={'images'}
                className="trans-300 absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-pointer rounded-md bg-white px-2 text-sm text-dark peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Images
              </label>
            </div>
          </div>
        </div>

        {!!imageUrls.length && (
          <>
            <div className="mb-5 flex flex-wrap gap-3 rounded-lg bg-white p-3">
              {imageUrls.map(url => (
                <div
                  className="relative aspect-video max-w-[250px]"
                  key={url}
                >
                  <Image
                    className="h-full w-full rounded-lg object-cover"
                    src={url}
                    height={250}
                    width={250}
                    alt="thumbnail"
                  />

                  <button
                    onClick={() => handleRemoveImage(url)}
                    className="group absolute right-2 top-2 rounded-lg bg-slate-300 p-2 hover:bg-dark-100"
                  >
                    <FaX
                      size={16}
                      className="trans-200 text-dark group-hover:text-light"
                    />
                  </button>
                </div>
              ))}
            </div>
            <p className="-mt-4 text-center italic text-slate-400">The last image must be portrait</p>
          </>
        )}

        <LoadingButton
          className="trans-200 rounded-lg bg-secondary px-4 py-2 font-semibold text-light hover:bg-primary"
          onClick={handleSubmit(onSubmit)}
          text="Add"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddCoursePage
