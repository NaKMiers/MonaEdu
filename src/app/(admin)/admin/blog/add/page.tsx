'use client'

import Divider from '@/components/Divider'
import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import TextEditor from '@/components/Tiptap'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { addBlogApi, getRoleUsersApi } from '@/requests'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaFile, FaUserEdit } from 'react-icons/fa'
import { FaPlay, FaX } from 'react-icons/fa6'
import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddBlogPage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)

  // states
  const [isBootedChecked, setIsBootedChecked] = useState<boolean>(false)
  const [roleUsers, setRoleUsers] = useState<IUser[]>([])

  const [tagValue, setTagValue] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])

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

  // get roleUsers, admins, editors
  useEffect(() => {
    const getRoleUsers = async () => {
      try {
        // send request to server to get role-users
        const { roleUsers } = await getRoleUsersApi('?role=admin|editor|collaborator') // cache: no-store

        // set roleUsers to state
        setRoleUsers(roleUsers)
        setValue('owner', roleUsers.find((user: IUser) => user.role === 'admin')._id)
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
      <AdminHeader
        title="Add Blog"
        backLink="/admin/blog/all"
      />

      <Divider size={4} />

      <div className="rounded-lg bg-slate-200 p-21 shadow-lg">
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
            errors={errors}
            required
            type="select"
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
        </div>

        {/* Summary */}
        <Input
          id="summary"
          label="Summary"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="textarea"
          rows={3}
          icon={MdNumbers}
          className="mb-5"
          onFocus={() => clearErrors('summary')}
        />

        {/* Content */}
        <p className="mb-2 text-xl font-semibold text-dark">Content</p>
        <TextEditor
          onChange={(content: string) => setValue('content', content)}
          className="w-ful mb-5 text-dark"
        />

        {/* Tags */}
        <div className="mb-5">
          <p className="mb-1 text-xl font-semibold text-dark">Tags</p>

          <div className="flex h-8 items-center justify-between gap-1.5">
            <input
              className="h-full w-full rounded-md px-4 font-body text-sm tracking-wider text-dark outline-none"
              type="text"
              value={tagValue}
              onChange={e => setTagValue(e.target.value)}
              onKeyDown={(e: any) => e.key === 'Enter' && handleAddTag(e.target.value.trim())}
            />
            <button
              className="trans-200 h-full rounded-md bg-secondary px-2 text-sm font-semibold hover:bg-primary hover:text-light"
              onClick={() => handleAddTag(tagValue.trim())}
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex max-h-[196px] flex-wrap items-center gap-2 overflow-y-auto rounded-lg bg-white p-2">
              {tags.map(tag => (
                <div
                  key={tag}
                  className="trans-200 cursor-pointer select-none rounded-md border border-slate-500 px-2 py-1 text-sm text-slate-500 hover:bg-slate-500 hover:text-light"
                  onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
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

        {/* Thumbnails */}
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
                id="thumbnails"
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
                htmlFor={'thumbnails'}
                className="trans-300 absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-pointer rounded-md bg-white px-2 text-sm text-dark peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Thumbnails
              </label>
            </div>
          </div>
        </div>

        {!!thumbnailUrls.length && (
          <div className="mb-5 flex flex-wrap gap-3 rounded-lg bg-white p-3">
            {thumbnailUrls.map(url => (
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
        )}

        <Divider size={4} />

        <div className="flex justify-center">
          <LoadingButton
            className="trans-200 w-full max-w-[500px] rounded-lg bg-secondary px-4 py-3 font-semibold text-light hover:bg-primary"
            onClick={handleSubmit(onSubmit)}
            text="Add"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default AddBlogPage
