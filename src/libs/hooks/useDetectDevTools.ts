'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import { useAppDispatch } from '../hooks'
import { setPageLoading } from '../reducers/modalReducer'

function UseDetectDevTools() {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user

  const checkActive = useCallback(() => {
    // de-active for development, review, test environments
    if (process.env.NODE_ENV !== 'production') return false
    // de-active for admin
    if (curUser?.role === 'admin') return false
    // de-active for mobile devices
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return false

    return true
  }, [curUser?.role])

  // disabled dev tool by reloading the page
  useEffect(() => {
    if (!checkActive()) {
      return
    }

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
  }, [dispatch, checkActive])

  // disabled keyboard shortcuts (Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + Shift + C, Ctrl + Shift + M, Ctrl + U, F12)
  useEffect(() => {
    if (!checkActive()) {
      return
    }

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
  }, [checkActive])

  // disable context menu on specific paths
  useEffect(() => {
    if (!checkActive()) {
      return
    }

    const disableContextMenu = (e: MouseEvent) => {
      if (window.location.pathname.startsWith('/learning')) {
        e.preventDefault()
      }
    }

    window.addEventListener('contextmenu', disableContextMenu)

    return () => {
      window.removeEventListener('contextmenu', disableContextMenu)
    }
  }, [checkActive])

  return null
}

export default UseDetectDevTools
