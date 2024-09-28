'use client'

import Divider from '@/components/Divider'
import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import TextEditor from '@/components/Tiptap'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { getBlogByIdApi, getRoleUsersApi, updateBlogApi } from '@/requests'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaFile, FaUserEdit } from 'react-icons/fa'
import { FaPlay, FaX } from 'react-icons/fa6'
import { HiStatusOnline } from 'react-icons/hi'
import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function EditBlogPage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  // states
  const [roleUsers, setRoleUsers] = useState<IUser[]>([])
  const [isBootedChecked, setIsBootedChecked] = useState<boolean>(false)

  const [tagValue, setTagValue] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])

  const [originalThumbnails, setOriginalThumbnails] = useState<string[]>([])
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
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
      status: '',
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

  // MARK: Get Data
  // get blog by id
  useEffect(() => {
    const getBlog = async () => {
      try {
        // send request to server to get blog
        const { blog } = await getBlogByIdApi(id) // cache: no-store

        // set value to form
        setValue('title', blog.title)
        setValue('content', blog.content)
        setValue('author', blog.author)
        setValue('summary', blog.summary)
        setValue('relatedBlogs', blog.relatedBlogs)
        setValue('booted', blog.booted)
        setValue('status', blog.status)

        setTags(blog.tags)
        setIsBootedChecked(blog.booted)
        setOriginalThumbnails(blog.thumbnails)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getBlog()
  }, [id, setValue])

  // get roleUsers, admins, editors
  useEffect(() => {
    const getRoleUsers = async () => {
      try {
        // send request to server to get role-users
        const { roleUsers } = await getRoleUsersApi('?role=admin|editor|collaborator') // cache: no-store

        // set roleUsers to state
        setRoleUsers(roleUsers)
        setValue('author', roleUsers.find((user: IUser) => user.role === 'admin')._id)
      } catch (err: any) {
        console.log(err)
      }
    }
    getRoleUsers()
  }, [setValue])

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

      if (!files.length && !originalThumbnails.length) {
        toast.error('Please select at least 1 image')
        isValid = false
      }

      return isValid
    },
    [files.length, originalThumbnails.length]
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
      formData.append('status', data.status)
      formData.append('originalThumbnails', JSON.stringify(originalThumbnails))
      files.forEach(file => formData.append('thumbnails', file))

      // send request to server to update blog
      const { message } = await updateBlogApi(id, formData)

      // show success message
      toast.success(message)

      // redirect to back
      router.back()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  // handle add tag
  const handleAddTag = useCallback(
    (value: string) => {
      if (!tags.some(tag => tag.trim() === value) && value.trim()) {
        setTags(prev => [...prev, value])
        setTagValue('')
      }
    },
    [tags]
  )

  return (
    <div>
      <AdminHeader title='Add Blog' backLink='/admin/blog/all' />

      <Divider size={4} />

      <div className='bg-slate-200 rounded-lg p-21 shadow-lg'>
        <div className='mb-5 grid grid-cols-1 sm:grid-cols-3 gap-5'>
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
            errors={errors}
            required
            type='select'
            onFocus={() => clearErrors('author')}
            options={roleUsers.map(user => ({
              value: user._id,
              label: `${user.firstName} ${user.lastName} - (${
                user.role.charAt(0).toUpperCase() + user.role.slice(1)
              })`,
              selected: user.role === 'admin',
            }))}
            icon={FaUserEdit}
          />

          {/* Status */}
          <Input
            id='status'
            label='Status'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='select'
            onFocus={() => clearErrors('status')}
            options={[
              {
                value: 'published',
                label: 'Published',
              },
              {
                value: 'draft',
                label: 'Draft',
                selected: true,
              },
              {
                value: 'archived',
                label: 'Archived',
              },
            ]}
            icon={HiStatusOnline}
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
        <p className='text-dark font-semibold text-xl mb-2'>Content</p>
        {getValues('content') && (
          <TextEditor
            content={getValues('content')}
            onChange={(content: string) => setValue('content', content)}
            className='w-ful text-dark mb-5'
          />
        )}

        {/* Tags */}
        <div className='mb-5'>
          <p className='text-dark font-semibold text-xl mb-1'>Tags</p>

          <div className='flex items-center justify-between gap-1.5 h-8'>
            <input
              className='w-full h-full px-4 font-body tracking-wider outline-none rounded-md text-dark text-sm'
              type='text'
              value={tagValue}
              onChange={e => setTagValue(e.target.value)}
              onKeyDown={(e: any) => e.key === 'Enter' && handleAddTag(e.target.value.trim())}
            />
            <button
              className='rounded-md bg-secondary px-2 h-full text-sm font-semibold hover:bg-primary hover:text-light trans-200'
              onClick={() => handleAddTag(tagValue.trim())}
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className='p-2 rounded-lg flex flex-wrap items-center bg-white gap-2 max-h-[196px] overflow-y-auto mt-2'>
              {tags.map(tag => (
                <div
                  key={tag}
                  className='cursor-pointer select-none text-sm rounded-md border border-slate-500 text-slate-500 hover:text-light hover:bg-slate-500 py-1 px-2 trans-200'
                  onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Boot */}
        <div className='flex mb-4'>
          <div className='bg-white rounded-lg px-3 flex items-center'>
            <FaPlay size={16} className='text-secondary' />
          </div>
          <label
            className={`select-none cursor-pointer border border-green-500 px-4 py-2 rounded-lg trans-200  ${
              isBootedChecked ? 'bg-green-500 text-light' : 'bg-white text-green-500'
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

        {/* MARK: Image Urls */}
        {(!!thumbnailUrls.length || !!originalThumbnails.length) && (
          <div className='flex flex-wrap gap-3 rounded-lg bg-white p-3 mb-5'>
            {originalThumbnails.map(url => (
              <div className='relative' key={url}>
                <Image className='rounded-lg' src={url} height={250} width={250} alt='thumbnail' />

                <button
                  onClick={() => setOriginalThumbnails(prev => prev.filter(i => i !== url))}
                  className='absolute top-2 bg-slate-300 p-2 right-2 group hover:bg-dark-100 rounded-lg'
                >
                  <FaX size={16} className='text-dark group-hover:text-light trans-200' />
                </button>
              </div>
            ))}
            {thumbnailUrls.map(url => (
              <div className='relative' key={url}>
                <Image className='rounded-lg' src={url} height={250} width={250} alt='thumbnail' />

                <button
                  onClick={() => handleRemoveImage(url)}
                  className='absolute top-2 bg-slate-300 p-2 right-2 group hover:bg-dark-100 rounded-lg'
                >
                  <FaX size={16} className='text-dark group-hover:text-light trans-200' />
                </button>
              </div>
            ))}
          </div>
        )}

        <Divider size={4} />

        <div className='flex justify-center'>
          <LoadingButton
            className='w-full max-w-[500px] px-4 py-3 bg-secondary hover:bg-primary text-light rounded-lg font-semibold trans-200'
            onClick={handleSubmit(onSubmit)}
            text='Save'
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default EditBlogPage
