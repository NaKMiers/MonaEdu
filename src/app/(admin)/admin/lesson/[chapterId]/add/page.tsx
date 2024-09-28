'use client'

import Divider from '@/components/Divider'
import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import TextEditor from '@/components/Tiptap'
import AdminHeader from '@/components/admin/AdminHeader'
import CustomDocModal from '@/components/admin/CustomDocModal'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { IChapter } from '@/models/ChapterModel'
import { ICourse } from '@/models/CourseModel'
import { IDoc } from '@/models/LessonModel'
import { addLessonApi } from '@/requests'
import { getChapterApi } from '@/requests/chapterRequest'
import { formatFileSize } from '@/utils/number'
import { formatDurationToHMS } from '@/utils/time'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCheck, FaFile, FaPlusSquare } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { MdCategory, MdOutlinePublic } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'
import { SiFramer } from 'react-icons/si'

export type GroupCourses = {
  [key: string]: ICourse[]
}

function AddLessonPage({ params: { chapterId } }: { params: { chapterId: string } }) {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)

  // states
  const [chapter, setChapter] = useState<IChapter | null>(null)
  const [sourceType, setSourceType] = useState<'file' | 'embed'>('embed')
  const [fileUrl, setFileUrl] = useState<string>('')
  const [embedSrc, setEmbedSrc] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)

  const [docs, setDocs] = useState<File[]>([])
  const [customDocs, setCustomDocs] = useState<IDoc[]>([])
  const [openCustomDocModal, setOpenCustomDocModal] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      courseId: '',
      chapterId,
      title: '',
      description: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
      active: true,
      status: 'private',
    },
  })

  // get chapter to add lesson to
  useEffect(() => {
    const getChapter = async () => {
      try {
        const { chapter } = await getChapterApi(chapterId)
        setChapter(chapter)
        setValue('courseId', chapter.courseId._id)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    getChapter()
  }, [setValue, chapterId])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // hours must be >= 0 and <= 23
      if (data.hours < 0) {
        setError('hours', { type: 'manual', message: 'Hours must be from 0 - 23' })
        isValid = false
      }

      // minutes must be >= 0 and <= 59
      if (data.minutes < 0 || data.minutes > 59) {
        setError('minutes', { type: 'manual', message: 'Minutes must be from 0 - 59' })
        isValid = false
      }

      // seconds must be >= 0 and <= 59
      if (data.seconds < 0 || data.seconds > 59) {
        setError('seconds', { type: 'manual', message: 'Seconds must be from 0 - 59' })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Submit
  // send request to server to add lesson
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!handleValidate(data)) return

      if (!file && !fileUrl && !embedSrc && !docs.length && !customDocs.length) {
        return toast.error('Please embed an url OR upload a video OR add a document')
      }

      dispatch(setLoading(true))

      try {
        const formData = new FormData()
        formData.append('courseId', data.courseId)
        formData.append('chapterId', data.chapterId)
        formData.append('title', data.title)
        formData.append('textHook', data.textHook)
        formData.append('description', data.description)
        formData.append('duration', String(+data.hours * 3600 + +data.minutes * 60 + +data.seconds))
        formData.append('active', data.active)
        formData.append('status', data.status)
        if (sourceType === 'file' && file) {
          formData.append('file', file)
        } else if (sourceType === 'embed' && embedSrc) {
          formData.append('embedUrl', embedSrc)
        }
        docs.forEach(doc => formData.append('docs', doc))
        formData.append('customDocs', JSON.stringify(customDocs))

        // add new category here
        const { message } = await addLessonApi(chapterId, formData)

        // show success message
        toast.success(message)

        // clear form
        reset()
        setValue('courseId', data.courseId)
        setFile(null)
        setFileUrl('')
        setEmbedSrc('')
        setDocs([])
        setCustomDocs([])
        URL.revokeObjectURL(fileUrl)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        dispatch(setLoading(false))
      }
    },
    [
      handleValidate,
      reset,
      setValue,
      dispatch,
      chapterId,
      customDocs,
      docs,
      embedSrc,
      file,
      fileUrl,
      sourceType,
    ]
  )

  // handle add files when user select files
  const handleAddFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0]

        // validate file type and size
        if (!file.type.startsWith('video/')) {
          return toast.error('Please select a video')
        }
        if (file.size > 1024 * 1024 * 1024) {
          return toast.error('Please select an video less than 1Gb or select an url fileUrl instead')
        }

        setFile(file)

        if (fileUrl) {
          URL.revokeObjectURL(fileUrl)
        }
        const newFileUrl = URL.createObjectURL(file)
        setFileUrl(newFileUrl)

        // Create a video element to get duration
        const video = document.createElement('video')
        video.src = newFileUrl
        video.addEventListener('loadedmetadata', () => {
          const durationInSeconds = video.duration // duration in seconds
          const hours = Math.floor(durationInSeconds / 3600)
          const minutes = Math.floor((durationInSeconds % 3600) / 60)
          const seconds = Math.floor(durationInSeconds % 60)

          setValue('hours', hours)
          setValue('minutes', minutes)
          setValue('seconds', seconds)
        })

        e.target.value = ''
        e.target.files = null
      }
    },
    [setValue, fileUrl]
  )

  // handle remove image
  const handleRemoveSource = useCallback(
    (url: string) => {
      if (sourceType === 'file') {
        setFile(null)
        setFileUrl('')
      } else if (sourceType === 'embed') {
        setEmbedSrc('')
      }
      URL.revokeObjectURL(url)
    },
    [setFile, setFileUrl, sourceType]
  )

  const handlePaste = useCallback(
    async (e: any) => {
      const pasteData = e.clipboardData.getData('text/plain')

      let videoId = ''
      if (pasteData.includes('<iframe')) {
        const match = pasteData.match(/src="([^"]+)"/)

        if (match) {
          const fullSrc = match[1]
          const videoIdMatch = fullSrc.match(/\/embed\/([^?"]+)/)
          if (videoIdMatch) {
            videoId = videoIdMatch[1]

            const embedSrc = `https://www.youtube.com/embed/${videoId}`
            setTimeout(() => {
              setEmbedSrc(embedSrc)
            }, 0)
          }
        }
      } else if (pasteData.includes('https://www.youtube.com/embed/')) {
        const match = pasteData.match(/\/embed\/([^?\/]+)/)
        videoId = match ? match[1] : ''
      }

      if (!videoId) {
        return toast.error('Invalid url')
      }

      // get video duration
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      )
      const data = await response.json()
      if (data.items.length > 0) {
        const duration = data.items[0].contentDetails.duration
        const [hours, minutes, seconds] = formatDurationToHMS(duration)

        setValue('hours', hours)
        setValue('minutes', minutes)
        setValue('seconds', seconds)
      }
    },
    [setValue]
  )

  // handle add files when user select files
  const handleAddDocs = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let newFiles = Array.from(e.target.files)

      // validate files's type and size
      newFiles = newFiles.filter(file => {
        if (file.size > 1024 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Only accept images under 1Gb`)
          return false
        }
        return true
      })

      setDocs(prev => [...prev, ...newFiles])

      e.target.value = ''
      e.target.files = null
    }
  }, [])

  // handle remove image
  const handleRemoveDoc = useCallback(
    (doc: File) => {
      // remove file from files
      const newFiles = docs.filter(d => d !== doc)
      setDocs(newFiles)
    },
    [docs]
  )

  // set page title
  useEffect(() => {
    // page title
    document.title = 'Add Lesson - Mona Edu'

    return () => URL.revokeObjectURL(fileUrl)
  }, [fileUrl])

  return (
    <div className="mx-auto max-w-1200">
      {/* MARK: Admin Header */}
      <AdminHeader
        title="Add Lesson"
        backLink={`/admin/lesson/${chapter?._id}/all`}
      />

      <div className="mt-5 rounded-lg bg-slate-200 p-21 shadow-lg">
        {/* Course */}
        <h2 className="text-2xl font-semibold text-dark">
          Course: <span className="text-slate-500">{(chapter?.courseId as ICourse)?.title}</span>
        </h2>

        {/* Chapter */}
        <h2 className="text-xl font-semibold text-dark">
          Chapter: <span className="text-slate-500">{chapter?.title}</span>
        </h2>

        <Divider size={4} />

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
          className="mb-5"
          onFocus={() => clearErrors('title')}
        />

        {/* Description */}
        <p className="mb-1 text-xl font-semibold text-dark">Description</p>
        <TextEditor
          onChange={(content: string) => setValue('description', content)}
          className="mb-5 w-full rounded-lg border border-dark bg-slate-200 p-21 text-dark shadow-lg"
        />

        {/* MARK: Duration */}
        <p className="mb-1 text-xl font-semibold text-dark">Duration</p>
        <div className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-3">
          {/* Hours */}
          <Input
            id="hours"
            label="Hours"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="number"
            min={0}
            onFocus={() => clearErrors('hours')}
          />
          {/* Minutes */}
          <Input
            id="minutes"
            label="Minutes"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="number"
            min={0}
            max={59}
            onFocus={() => clearErrors('minutes')}
          />
          {/* Seconds */}
          <Input
            id="seconds"
            label="Seconds"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="number"
            min={0}
            max={59}
            onFocus={() => clearErrors('seconds')}
          />
        </div>

        <div className="mb-5">
          <div className={`flex`}>
            <span
              className={`inline-flex items-center rounded-bl-lg rounded-tl-lg border-[2px] border-slate-200 bg-slate-100 px-3 text-sm text-gray-900`}
            >
              <MdCategory
                size={19}
                className="text-secondary"
              />
            </span>
            <div
              className={`relative w-full rounded-br-lg rounded-tr-lg border-[2px] border-l-0 border-slate-200 bg-white`}
            >
              <select
                id="sourceType"
                className="peer block w-full bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-dark focus:outline-none focus:ring-0"
                disabled={isLoading}
                value={sourceType}
                onChange={(e: any) => setSourceType(e.target.value)}
              >
                <option value="embed">Embed</option>
                <option value="file">File</option>
              </select>

              {/* label */}
              <label
                htmlFor="sourceType"
                className={`trans-300 absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-pointer rounded-md bg-white px-2 text-sm text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 ${
                  errors.courseId ? 'text-rose-400' : 'text-dark'
                }`}
              >
                Source Type
              </label>
            </div>
          </div>
          {errors.type?.message && (
            <span className="text-sm text-rose-400">{errors.type?.message?.toString()}</span>
          )}
        </div>

        {/* Source */}
        <div className="mb-5">
          {sourceType === 'file' ? (
            <div className="flex">
              <span className="inline-flex items-center rounded-bl-lg rounded-tl-lg border-[2px] border-slate-200 bg-slate-100 px-3 text-sm text-gray-900">
                <FaFile
                  size={19}
                  className="text-secondary"
                />
              </span>
              <div className="relative w-full rounded-r-lg border-[2px] border-l-0 border-slate-200 bg-white">
                <input
                  id="fileUrl"
                  className="peer block w-full bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-dark focus:outline-none focus:ring-0"
                  placeholder=" "
                  disabled={isLoading}
                  type="file"
                  accept="video/*"
                  onChange={handleAddFile}
                />

                {/* label */}
                <label
                  htmlFor={'fileUrl'}
                  className="trans-300 absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-pointer rounded-md bg-white px-2 text-sm text-dark peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
                >
                  Source
                </label>
              </div>
            </div>
          ) : (
            <div className="flex">
              <span className="inline-flex items-center rounded-bl-lg rounded-tl-lg border-[2px] border-slate-200 bg-slate-100 px-3 text-sm text-gray-900">
                <SiFramer
                  size={19}
                  className="text-secondary"
                />
              </span>
              <div className="relative w-full rounded-r-lg border-[2px] border-l-0 border-slate-200 bg-white">
                <input
                  id="fileUrl"
                  className="peer block w-full bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-dark focus:outline-none focus:ring-0"
                  placeholder=" "
                  disabled={isLoading}
                  type="url"
                  value={embedSrc}
                  onPaste={handlePaste}
                  onChange={e => setEmbedSrc(e.target.value)}
                />

                {/* label */}
                <label
                  htmlFor={'fileUrl'}
                  className="trans-300 absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-pointer rounded-md bg-white px-2 text-sm text-dark peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
                >
                  Source
                </label>
              </div>
            </div>
          )}
        </div>

        {((fileUrl && sourceType === 'file') || (embedSrc && sourceType === 'embed')) && (
          <div className="relative mb-5 aspect-video rounded-lg bg-white p-21">
            {fileUrl && sourceType === 'file' && (
              <video
                className="h-full w-full rounded-lg object-contain"
                src={fileUrl}
                controls
              />
            )}
            {embedSrc && sourceType === 'embed' && (
              <iframe
                className="h-full w-full rounded-lg object-contain"
                width="1519"
                height="574"
                src={embedSrc}
                title="Is Civilization on the Brink of Collapse?"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}

            <button
              onClick={() => handleRemoveSource(fileUrl)}
              className="group absolute right-2 top-2 rounded-lg bg-slate-300 p-2 hover:bg-dark-100"
            >
              <FaX
                size={16}
                className="trans-200 text-dark group-hover:text-light"
              />
            </button>
          </div>
        )}

        {/* Active */}
        <div className="mb-5 flex">
          <div className="flex items-center rounded-lg bg-white px-3">
            <FaCheck
              size={16}
              className="text-secondary"
            />
          </div>
          <input
            className="peer"
            type="checkbox"
            id="active"
            hidden
            {...register('active', { required: false })}
          />
          <label
            className={`trans-200 cursor-pointer select-none rounded-lg border border-green-500 bg-white px-4 py-2 text-green-500 peer-checked:bg-green-500 peer-checked:text-light`}
            htmlFor="active"
          >
            Active
          </label>
        </div>

        {/* Status */}
        <Input
          id="status"
          label="Status"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="select"
          onFocus={() => clearErrors('status')}
          options={[
            { label: 'Public', value: 'public' },
            { label: 'Private', value: 'private' },
          ]}
          icon={MdOutlinePublic}
          className="mb-5"
        />

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
                id="docs"
                className="peer block w-full bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-dark focus:outline-none focus:ring-0"
                placeholder=" "
                disabled={isLoading}
                type="file"
                multiple
                onChange={handleAddDocs}
              />

              {/* label */}
              <label
                htmlFor={'docs'}
                className="trans-300 absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-pointer rounded-md bg-white px-2 text-sm text-dark peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Docs
              </label>

              {/* Add Custom Docs Button */}
              <button
                className="trans-200 group absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-sky-500 bg-dark-100 shadow-lg hover:bg-sky-500"
                onClick={() => setOpenCustomDocModal(prev => !prev)}
              >
                <FaPlusSquare
                  size={14}
                  className="wiggle"
                />
              </button>
            </div>
          </div>

          {/* Add Custom Docs Modal */}
          <CustomDocModal
            open={openCustomDocModal}
            setOpen={setOpenCustomDocModal}
            setCustomDocs={setCustomDocs}
          />
        </div>

        {(!!docs.length || !!customDocs.length) && (
          <div className="mb-5 flex flex-wrap gap-3 rounded-lg bg-white p-3">
            {docs.map((doc, index) => {
              return (
                <div
                  className="flex max-w-[250px] items-center gap-3 rounded-md px-2 py-1 shadow-md"
                  key={index}
                >
                  <FaFile
                    size={20}
                    className="flex-shrink-0 text-secondary"
                  />

                  <div className="flex w-full max-w-[160px] flex-col font-body tracking-wider">
                    <p className="line-clamp-2 overflow-hidden text-ellipsis text-sm text-dark">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-500">{formatFileSize(doc.size)}</p>
                  </div>

                  <button
                    onClick={() => handleRemoveDoc(doc)}
                    className="group flex-shrink-0 rounded-lg bg-slate-300 p-2 hover:bg-dark-100"
                  >
                    <FaX
                      size={16}
                      className="trans-200 text-dark group-hover:text-light"
                    />
                  </button>
                </div>
              )
            })}

            {customDocs.map((doc, index) => {
              return (
                <div
                  className="flex max-w-[250px] items-center gap-3 rounded-md px-2 py-1 shadow-md"
                  key={index}
                >
                  <FaFile
                    size={20}
                    className="flex-shrink-0 text-secondary"
                  />

                  <div className="flex w-full max-w-[160px] flex-col font-body tracking-wider">
                    <p className="line-clamp-2 overflow-hidden text-ellipsis text-sm text-dark">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-500">{formatFileSize(doc.size)}</p>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setCustomDocs(prev => prev.filter(d => d !== doc))
                    }}
                    className="group flex-shrink-0 rounded-lg bg-slate-300 p-2 hover:bg-dark-100"
                  >
                    <FaX
                      size={16}
                      className="trans-200 text-dark group-hover:text-light"
                    />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* MARK: Add Button */}
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

export default AddLessonPage
