import { Dispatch, memo, SetStateAction, useEffect, useRef } from 'react'
import { MdOutlineReportOff } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import Divider from '../Divider'

interface ReportDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  contents: string[]
  selectedContent: string
  setSelectedContent: Dispatch<SetStateAction<string>>
  acceptLabel?: string
  cancelLabel?: string
  onAccept: () => void
  isLoading?: boolean
  color?: string
  className?: string
}

function ReportDialog({
  open,
  setOpen,
  title,
  contents,
  selectedContent,
  setSelectedContent,
  acceptLabel,
  cancelLabel,
  onAccept,
  isLoading = false,
  color = 'orange',
  className = '',
}: ReportDialogProps) {
  // ref
  const modalRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)

  // show/hide modal
  useEffect(() => {
    if (open) {
      // show modal
      modalRef.current?.classList.remove('hidden')
      modalRef.current?.classList.add('flex')

      setTimeout(() => {
        // fade in modal
        modalRef.current?.classList.remove('opacity-0')

        // float in modal body
        modalBodyRef.current?.classList.remove('opacity-0')
        modalBodyRef.current?.classList.remove('translate-y-8')
      }, 1)
    } else {
      // fade out modal
      modalRef.current?.classList.add('opacity-0')

      // float out modal body
      modalBodyRef.current?.classList.add('opacity-0')
      modalBodyRef.current?.classList.add('translate-y-8')

      setTimeout(() => {
        // hide modal
        modalRef.current?.classList.add('hidden')
        modalRef.current?.classList.remove('flex')
      }, 350)
    }
  }, [open])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open) {
        // ESC
        if (e.key === 'Escape') {
          setOpen(false)
        }

        // Enter
        if (e.key === 'Enter') {
          onAccept()
          setOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen, onAccept, open])

  return (
    <div
      className="trans-300 fixed left-0 top-0 z-40 hidden h-screen w-screen items-center justify-center bg-black bg-opacity-10 p-21 text-dark opacity-0"
      ref={modalRef}
      onClick={() => setOpen(false)}
    >
      <div
        className={`trans-300 max-h-[500px] w-full max-w-[500px] translate-y-8 rounded-medium bg-white p-21 opacity-0 shadow-medium-light ${className}`}
        ref={modalBodyRef}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold tracking-wide">{title}</h2>

        <Divider
          size={4}
          border
        />

        {/* Select Content */}
        <div className={`flex`}>
          <span
            className={`inline-flex items-center rounded-bl-lg rounded-tl-lg border-[2px] border-slate-200 bg-slate-100 px-3 text-sm text-gray-900`}
          >
            <MdOutlineReportOff
              size={19}
              className="text-secondary"
            />
          </span>
          <div
            className={`relative w-full rounded-br-lg rounded-tr-lg border-[2px] border-l-0 border-slate-200 bg-white`}
          >
            <select
              id="chapterId"
              className="peer block w-full bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-dark focus:outline-none focus:ring-0"
              disabled={isLoading}
              required
              value={selectedContent}
              onChange={e => setSelectedContent(e.target.value)}
            >
              <option value="">Chọn nội dung</option>

              {contents.map((content, index) => (
                <option
                  value={content}
                  key={index}
                >
                  {content}
                </option>
              ))}
            </select>

            {/* label */}
            <label
              htmlFor="type"
              className={`trans-300 absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-pointer rounded-md bg-white px-2 text-sm text-dark peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4`}
            >
              Nội dung
            </label>
          </div>
        </div>

        <Divider
          size={4}
          border
        />

        <div className="flex select-none items-center justify-end gap-3">
          <button
            className={`trans-200 rounded-lg border border-slate-300 px-3 py-2 shadow-lg hover:bg-slate-300 hover:text-light ${
              isLoading ? 'pointer-events-none' : ''
            }`}
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            {cancelLabel || 'Hủy'}
          </button>
          <button
            className={`rounded-lg border px-3 py-2 shadow-lg text-${color}-500 trans-200 hover:border-secondary hover:bg-secondary hover:text-light ${
              isLoading ? 'pointer-events-none border-slate-300' : `border-${color}-500`
            }`}
            onClick={() => {
              onAccept()
              setOpen(false)
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <RiDonutChartFill
                size={24}
                className="animate-spin text-slate-300"
              />
            ) : (
              acceptLabel || 'Gửi'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(ReportDialog)
