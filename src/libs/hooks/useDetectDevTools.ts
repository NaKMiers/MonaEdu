import { useEffect } from 'react'
import { useAppDispatch } from '../hooks'
import { setPageLoading } from '../reducers/modalReducer'

const useDetectDevTools = () => {
  const dispatch = useAppDispatch()

  // disabled dev tool by reloading the page
  useEffect(() => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return
    // }

    const threshold = 160
    let devtools = { open: false }

    const detectDevTools = (isOpen: boolean) => {
      if (isOpen) {
        dispatch(setPageLoading(true))
        window.location.reload()
      }
    }

    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      const orientationThreshold =
        (window.orientation && window.innerHeight > window.innerWidth) ||
        (window.orientation && window.innerHeight < window.innerWidth)

      devtools.open = !!(widthThreshold || heightThreshold || orientationThreshold)
      detectDevTools(devtools.open)
    }

    const intervalId = setInterval(checkDevTools, 500)

    return () => {
      clearInterval(intervalId)
    }
  }, [dispatch])

  // disabled keyboard shortcuts (Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + Shift + C, Ctrl + Shift + M, Ctrl + U, F12)
  useEffect(() => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return
    // }

    const disableShortcuts = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'M') ||
        (e.ctrlKey && e.key === 'u') ||
        e.key === 'F12'
      ) {
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', disableShortcuts)

    return () => {
      window.removeEventListener('keydown', disableShortcuts)
    }
  }, [dispatch])
}

export default useDetectDevTools
