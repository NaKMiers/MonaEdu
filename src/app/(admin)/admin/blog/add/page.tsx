'use client'

import Divider from '@/components/Divider'
import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import TextEditor from '@/components/Tiptap'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { addBlogApi } from '@/requests'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaFile, FaUser } from 'react-icons/fa'
import { FaPlay, FaX } from 'react-icons/fa6'
import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddBlogPage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)

  // states
  const [tags, setTags] = useState<string[]>([])
  const [isBootedChecked, setIsBootedChecked] = useState<boolean>(false)

  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([])
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
      content: '',
      author: '',
      summary: '',
      relatedBlogs: [],
      booted: false,
    },
  })

  // revoke blob url when component unmount
  useEffect(() => {
    // page title
    document.title = 'Add Blog - Mona Edu'

    return () => {
      thumbnailUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [thumbnailUrls])

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
      setThumbnailUrls(prev => [...prev, ...urls])

      e.target.value = ''
      e.target.files = null
    }
  }, [])

  // handle remove image
  const handleRemoveImage = useCallback(
    (url: string) => {
      const index = thumbnailUrls.indexOf(url)

      // remove file from files
      const newFiles = files.filter((_, i) => i !== index)
      setFiles(newFiles)

      setThumbnailUrls(prev => prev.filter(u => u !== url))
      URL.revokeObjectURL(url)
    },
    [files, thumbnailUrls]
  )

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      if (!files.length) {
        toast.error('Please select at least 1 image')
        isValid = false
      }

      return isValid
    },
    [files]
  )

  // send data to server to create new blog
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (!handleValidate(data)) return

    // return
    dispatch(setLoading(true))

    try {
      const formData = new FormData()

      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append('author', data.author)
      formData.append('summary', data.summary)
      formData.append('tags', JSON.stringify(tags))
      formData.append('relatedBlogs', JSON.stringify(data.relatedBlogs))
      formData.append('booted', data.booted)
      files.forEach(file => formData.append('thumbnails', file))

      // send request to server to create new blog
      const { message } = await addBlogApi(formData)

      // show success message
      toast.success(message)

      // reset form
      setFiles([])
      thumbnailUrls.forEach(url => URL.revokeObjectURL(url))
      setThumbnailUrls([])
      reset()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='max-w-1200 mx-auto'>
      <AdminHeader title='Add Blog' backLink='/admin/blog/all' />

      <Divider size={4} />

      <div className='bg-slate-200 rounded-lg p-21 shadow-lg'>
        <div className='mb-5 grid grid-cols-1 sm:grid-cols-2 gap-5'>
          {/* Title */}
          <Input
            id='title'
            label='Title'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='text'
            icon={RiCharacterRecognitionLine}
            onFocus={() => clearErrors('title')}
          />

          {/* Author */}
          <Input
            id='author'
            label='Author'
            disabled={isLoading}
            register={register}
            required
            errors={errors}
            type='text'
            rows={10}
            icon={FaUser}
            onFocus={() => clearErrors('author')}
          />
        </div>

        {/* Summary */}
        <Input
          id='summary'
          label='Summary'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='textarea'
          rows={3}
          icon={MdNumbers}
          className='mb-5'
          onFocus={() => clearErrors('summary')}
        />

        {/* Content */}
        <p className='text-dark font-semibold text-xl mb-1'>Content</p>
        <TextEditor
          onChange={(content: string) => setValue('content', content)}
          className='w-full p-21 rounded-lg shadow-lg border border-dark bg-slate-200 text-dark mb-5'
        />

        {/* Boot */}
        <div className='flex mb-4'>
          <div className='bg-white rounded-lg px-3 flex items-center'>
            <FaPlay size={16} className='text-secondary' />
          </div>
          <label
            className={`select-none cursor-pointer border border-green-500 px-4 py-2 rounded-lg trans-200  ${
              isBootedChecked ? 'bg-green-500 text-white' : 'bg-white text-green-500'
            }`}
            htmlFor='booted'
            onClick={() => setIsBootedChecked(!isBootedChecked)}
          >
            Boot
          </label>
          <input type='checkbox' id='booted' hidden {...register('booted', { required: false })} />
        </div>

        {/* Thumbnails */}
        <div className='mb-5'>
          <div className='flex'>
            <span className='inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 border-slate-200 bg-slate-100'>
              <FaFile size={19} className='text-secondary' />
            </span>
            <div className='relative w-full border-[2px] border-l-0 bg-white border-slate-200'>
              <input
                id='thumbnails'
                className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
                placeholder=' '
                disabled={isLoading}
                type='file'
                accept='image/*'
                multiple
                onChange={handleAddFiles}
              />

              {/* label */}
              <label
                htmlFor={'thumbnails'}
                className='absolute rounded-md text-sm trans-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer text-dark'
              >
                Thumbnails
              </label>
            </div>
          </div>
        </div>

        {!!thumbnailUrls.length && (
          <div className='flex flex-wrap gap-3 rounded-lg bg-white p-3 mb-5'>
            {thumbnailUrls.map(url => (
              <div className='relative aspect-video max-w-[250px]' key={url}>
                <Image
                  className='rounded-lg w-full h-full object-cover'
                  src={url}
                  height={250}
                  width={250}
                  alt='thumbnail'
                />

                <button
                  onClick={() => handleRemoveImage(url)}
                  className='absolute top-2 bg-slate-300 p-2 right-2 group hover:bg-dark-100 rounded-lg'
                >
                  <FaX size={16} className='text-dark group-hover:text-white trans-200' />
                </button>
              </div>
            ))}
          </div>
        )}

        <LoadingButton
          className='px-4 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-semibold trans-200'
          onClick={handleSubmit(onSubmit)}
          text='Add'
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddBlogPage
