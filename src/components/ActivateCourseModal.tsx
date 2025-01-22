'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenActivateCourse } from '@/libs/reducers/modalReducer'
import { activateCoursesByActivationCodeApi } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import { MdOutlineRedeem } from 'react-icons/md'
import Input from './Input'

function ActivateCourseModal() {
  // store
  const dispatch = useAppDispatch()
  const open = useAppSelector(state => state.modal.openActivateCourse)

  // states
  const [code, setCode] = useState<string[]>(Array(12).fill(''))
  const [loading, setLoading] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      activateCourseCode: '',
    },
  })

  // refs
  const inputRefs = useRef<HTMLInputElement[]>([])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1 || /[^a-zA-Z0-9]/.test(value)) return
    const newCode = [...code]
    newCode[index] = value.toUpperCase()
    setCode(newCode)
    setValue('activateCourseCode', newCode.join(''))

    // Focus next input if value is entered
    if (value && index < 11) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !code[index]) {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    const pasteData = event.clipboardData.getData('text').split('-').join('').slice(0, 12)
    const newCode = pasteData.split('')
    setCode(prev => prev.map((_, i) => newCode[i] || ''))
    setValue('activateCourseCode', pasteData.toUpperCase())
    // Focus the last filled input
    inputRefs.current[Math.min(pasteData.length, 12) - 1]?.focus()
  }

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // code length must be 12
      if (data.activateCourseCode.split('-').join('').length !== 12) {
        toast.error('Mã kích hoạt không hợp lệ')
        setError('activateCourseCode', { message: 'Mã kích hoạt không hợp lệ' })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Activate courses by activation code
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setLoading(true)

      try {
        const { message } = await activateCoursesByActivationCodeApi(data.activateCourseCode.trim())

        // show success message
        toast.success(message)

        // reset
        setCode(Array(12).fill(''))
        setValue('activateCourseCode', '')

        // close modal
        dispatch(setOpenActivateCourse(false))
      } catch (err: any) {
        // show error message
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    },
    [dispatch, handleValidate, setValue]
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 top-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 px-21/2"
          onClick={() => dispatch(setOpenActivateCourse(false))}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-full max-w-[600px] rounded-medium border-l-2 border-r-2 border-primary bg-neutral-900 px-8 py-10 text-light shadow-medium"
            onClick={e => e.stopPropagation()}
          >
            <h1 className="text-center text-xl font-semibold">Kích hoạt khóa học</h1>

            <div
              className="mt-5 hidden items-center justify-center gap-2 sm:flex"
              onPaste={handlePaste}
            >
              {code.map((value, index) => (
                <Fragment key={index}>
                  <div className="flex items-center justify-center">
                    <input
                      ref={el => {
                        inputRefs.current[index] = el!
                      }}
                      value={value}
                      onChange={e => handleInputChange(index, e.target.value)}
                      onKeyDown={e => handleKeyDown(index, e)}
                      type="text"
                      maxLength={1}
                      className="h-12 w-8 rounded-md border-2 border-gray-300 text-center font-semibold text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {/* Add a dash after the 4th and 8th inputs */}
                  {(index === 3 || index === 7) && (
                    <span className="flex items-center justify-center text-xl font-semibold">-</span>
                  )}
                </Fragment>
              ))}
            </div>

            <Input
              id="activateCourseCode"
              label="Mã kích hoạt"
              icon={MdOutlineRedeem}
              disabled={false}
              register={register}
              errors={errors}
              required
              onChange={(e: any) => setValue('activateCourseCode', e.target.value.toUpperCase())}
              type="text"
              labelBg="bg-white"
              maxLength={14}
              className="mt-6 min-w-[40%] font-semibold tracking-widest md:hidden"
              onFocus={() => clearErrors('activateCourseCode')}
            />

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className={`trans-300 flex h-[46px] items-center justify-center rounded-3xl border-2 border-light bg-neutral-950 px-4 py-1 text-sm font-semibold text-light shadow-lg hover:shadow-lg hover:shadow-primary ${
                  loading ? 'pointer-events-none bg-slate-200' : ''
                }`}
              >
                {loading ? (
                  <FaCircleNotch
                    size={18}
                    className="trans-200 animate-spin text-slate-400"
                  />
                ) : (
                  'Kích hoạt'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(ActivateCourseModal)
