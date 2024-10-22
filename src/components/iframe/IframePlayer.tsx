'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import {
  resetLearningLesson,
  setIsFullScreen,
  setLearningLesson,
  setUserProgress,
} from '@/libs/reducers/learningReducer'
import { ICourse } from '@/models/CourseModel'
import { ILesson } from '@/models/LessonModel'
import { IProgress } from '@/models/ProgressModel'
import { updateProgressApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'
import { RiFullscreenExitLine, RiFullscreenFill } from 'react-icons/ri'

interface IframePlayerProps {
  lesson: ILesson
  className?: string
}

function IframePlayer({ lesson, className = '' }: IframePlayerProps) {
  // hooks
  const dispatch = useAppDispatch()
  const videoId = lesson?.source.split('https://www.youtube.com/embed/')[1].split('?')[0]
  const { data: session } = useSession()
  const curUser: any = session?.user

  // stores
  const chapters = useAppSelector(state => state.learning.chapters)
  const nextLesson = useAppSelector(state => state.learning.nextLesson)
  const prevLesson = useAppSelector(state => state.learning.prevLesson)
  const isFullScreen = useAppSelector(state => state.learning.isFullScreen)

  // states
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [isEnded, setIsEnded] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(lesson.duration)

  // refs
  const playerRef = useRef<any>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerContainerRef = useRef<any>(null)
  const progressTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const topCoverRef = useRef<HTMLDivElement>(null)
  const logoCoverRef = useRef<HTMLAnchorElement>(null)
  const coversTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  let firstShow = useRef<boolean>(true)

  // MARK: update lesson progress
  const handleUpdateLessonProgress = useCallback(async () => {
    const wd: any = window
    if (!wd.player) return

    const curTime = wd.player.getCurrentTime()
    console.log('curTime:', curTime)

    const joinedCourse = curUser?.courses.find(
      (c: any) => c.course === (lesson?.courseId as ICourse)._id.toString()
    )

    console.table({
      isEnrolled: !!joinedCourse,
      duration,
      curTime,
    })

    if (!lesson?.progress || !joinedCourse || !duration) return

    try {
      const invalidProgress =
        Math.floor((curTime / duration) * 100 * 100) / 100 <= lesson.progress.progress

      if (!invalidProgress) {
        console.log('update progress - curTime:', curTime, duration, lesson.progress.progress)

        const { progress } = await updateProgressApi(
          (lesson.progress as IProgress)._id,
          (lesson.courseId as ICourse)._id,
          curTime > 0.8 * duration ? 'completed' : 'in-progress',
          curTime > 0.8 * duration ? 100 : Math.floor((curTime / duration) * 100 * 100) / 100
        )

        // update states
        dispatch(setLearningLesson({ ...lesson, progress }))

        // update course's progress
        if (progress.status === 'completed') {
          const allLessons = chapters.reduce(
            (acc: any, chapter: any) => [...acc, ...chapter.lessons],
            []
          )

          console.log('allLessons:', allLessons)

          const completedLessons = allLessons.filter(
            lesson => lesson?.progress && lesson.progress.status === 'completed'
          )

          console.log('completedLessons:', completedLessons)

          let percent = Math.round(((completedLessons.length + 1) / allLessons.length) * 100)
          if (percent > 100) percent = 100

          console.log('percent:', percent)

          dispatch(setUserProgress(percent))
        }
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      let interval = 120000 // default 2m/time
      if (duration <= 60) {
        // < 1min
        interval = 6000 // 6s/time -> 10 times
        console.log('6 sec/time', duration)
      } else if (duration <= 300) {
        // < 5min
        interval = 30000 // 30s/time -> 10 times
        console.log('30 sec/time', duration)
      } else if (duration <= 600) {
        // < 10min
        interval = 60000 // 1min/time -> 10 times
        console.log('1 min/time', duration)
      } else if (duration <= 1800) {
        // < 30min
        interval = 90000 // 1.5min/time -> 20 times
        console.log('1.5 min/time', duration)
      } else if (duration <= 3600) {
        // < 1h
        interval = 120000 // 2min/time -> 30 times
        console.log('2 min/time', duration)
      }

      // clear previous timeout
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current)
      }

      // set new timeout to keep auto update progress
      progressTimeoutRef.current = setTimeout(() => {
        if (progressTimeoutRef.current) {
          handleUpdateLessonProgress()
        }
      }, interval)
    }
  }, [dispatch, lesson, duration, curUser, chapters])

  // MARK: on player reade
  const onPlayerReady = useCallback(
    (e: any) => {
      const wd: any = window
      wd.player = e.target
      const player = e.target

      console.log(wd.player)

      // set duration
      const duration = player.getDuration()
      setDuration(duration)

      // set init current time from prev progress
      const initTime = lesson.progress?.progress ? (lesson.progress.progress / 100) * lesson.duration : 0
      player.seekTo(initTime, true)

      // set init volume
      const volume: number = +(localStorage.getItem('volume') || '100')
      player.setVolume(volume)

      // set init speed
      const speed: number = +(localStorage.getItem('speed') || '1')
      player.setPlaybackRate(speed)
    },
    [lesson]
  )

  // MARK: on state change
  const onStateChange = useCallback(
    (e: any) => {
      // Play
      if (e.data === 1) {
        setIsEnded(false)
        setIsPlaying(true)
        handleUpdateLessonProgress()
      }

      // Pause
      if (e.data === 2) {
        setIsEnded(false)
        setIsPlaying(false)
      }

      // End
      if (e.data === 0) {
        setIsEnded(true)
        handleUpdateLessonProgress()
      }
    },
    [handleUpdateLessonProgress]
  )

  // MARK: load youtube iframe api
  useEffect(() => {
    const wd: any = window

    const onYouTubeIframeAPIReady = () => {
      if (iframeRef.current) {
        playerRef.current = new wd.YT.Player(iframeRef.current, {
          videoId: videoId,
          height: '100%',
          width: '100%',
          playerVars: {
            autoplay: 0,
            mute: 0,
            controls: 1,
            origin: process.env.NEXT_PUBLIC_APP_URL,
            playsinline: 1,
            rel: 0,
            iv_load_policy: 3,
            enablejsapi: 1,
            widgetid: 1,
            fs: 0,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange,
          },
        })
      }
    }

    onYouTubeIframeAPIReady()
  }, [onPlayerReady, onStateChange, videoId])

  // MARK: reset player on unmount
  useEffect(() => {
    return () => {
      console.log('IframePlayer unmount')
      const wd: any = window

      if (wd.player) {
        const volume = wd.player.getVolume()
        localStorage.setItem('volume', JSON.stringify(volume))

        const speed = wd.player.getPlaybackRate()
        localStorage.setItem('speed', JSON.stringify(speed))

        delete wd.player
      }
      playerRef.current = null
      dispatch(resetLearningLesson())
      clearTimeout(progressTimeoutRef.current as NodeJS.Timeout)
      setIsPlaying(true)
      setIsEnded(false)
      setIsFullScreen(false)
    }
  }, [dispatch])

  // MARK: fullscreen
  useEffect(() => {
    const element = playerContainerRef.current

    console.log('isFullScreen:', isFullScreen)

    if (isFullScreen) {
      if (element) {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.mozRequestFullScreen) {
          // Firefox
          element.mozRequestFullScreen()
        } else if (element.webkitRequestFullscreen) {
          // Safari
          element.webkitRequestFullscreen()
        } else if (element.msRequestFullscreen) {
          // IE/Edge
          element.msRequestFullscreen()
        }
      }
    } else {
      const dcm: any = document
      if (dcm.exitFullscreen) {
        dcm.exitFullscreen()
      } else if (dcm.mozCancelFullScreen) {
        // Firefox
        dcm.mozCancelFullScreen()
      } else if (dcm.webkitExitFullscreen) {
        // Safari
        dcm.webkitExitFullscreen()
      } else if (dcm.msExitFullscreen) {
        // IE/Edge
        dcm.msExitFullscreen()
      }
    }
  }, [dispatch, isFullScreen])

  // MARK: show covers
  // mouse over
  const handleMouseMove = useCallback(() => {
    console.log('mouse over')

    const top = topCoverRef.current
    const logo = logoCoverRef.current
    if (!top || !logo) return

    top.style.opacity = '1'
    top.style.transition = 'all 0.05s'
    logo.style.opacity = '1'
    logo.style.transition = 'all 0.05s'

    if (coversTimeoutRef.current) {
      clearTimeout(coversTimeoutRef.current)
    }
    if (isPlaying) {
      coversTimeoutRef.current = setTimeout(() => {
        console.log('mouse leave')

        top.style.opacity = '0'
        top.style.transition = `all 0.1s ${firstShow.current ? '3.5s' : '0.1s'}`
        logo.style.opacity = '0'
        logo.style.transition = `all 0.1s ${firstShow.current ? '3.5s' : '0.1s'}`
        firstShow.current = false
      }, 3000)
    }
  }, [isPlaying])

  // mouse leave
  const handleMouseLeave = useCallback(() => {
    const top = topCoverRef.current
    const logo = logoCoverRef.current
    if (!top || !logo) return

    console.log('mouse leave isPlaying: ', isPlaying)
    if (isPlaying) {
      console.log('mouse leave')

      top.style.opacity = '0'
      top.style.transition = `all 0.1s ${firstShow.current ? '3.5s' : '0.1s'}`
      logo.style.opacity = '0'
      logo.style.transition = `all 0.1s ${firstShow.current ? '3.5s' : '0.1s'}`
      firstShow.current = false
    }
  }, [isPlaying])

  // MARK: Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement

      if (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      )
        return

      // F
      if (e.key === 'f') {
        e.preventDefault()
        dispatch(setIsFullScreen(!isFullScreen))
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch, isFullScreen])

  // MARK: Before Unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const wd: any = window
      const curTime = wd.player.getCurrentTime()
      if (curTime <= 0.8 * duration && curTime > 0) {
        e.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [duration])

  return (
    <div
      className={`relative h-full w-full ${className}`}
      onDoubleClick={() => dispatch(setIsFullScreen(!isFullScreen))}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={playerContainerRef}
    >
      {/* Top Cover */}
      <div
        className={`absolute left-0 top-0 flex h-[60px] w-full items-center gap-2 px-2.5 ${isEnded ? '!opacity-100' : ''}`}
        ref={topCoverRef}
      >
        <div className="aspect-square shrink-0 overflow-hidden rounded-md">
          <Image
            className="aspect-square rounded-md shadow-lg"
            src="/images/logo.png"
            width={44}
            height={44}
            alt="Mona-Edu"
          />
        </div>

        <div className="rounded-lg border-b-2 border-light bg-[#333] px-3 py-1 shadow-lg">
          <h1 className="line-clamp-1 text-ellipsis bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-lg font-semibold text-transparent drop-shadow-md">
            {lesson.title}
          </h1>
        </div>

        <button
          className="group flex h-7 items-center justify-center rounded-md border-b-2 border-light bg-[#333] p-1 shadow-lg"
          onClick={() => dispatch(setIsFullScreen(!isFullScreen))}
          title={isFullScreen ? 'Thu nhỏ màn hình' : 'Toàn màn hình'}
        >
          {!isFullScreen ? (
            <RiFullscreenFill
              size={20}
              className="text-light"
            />
          ) : (
            <RiFullscreenExitLine
              size={20}
              className="text-light"
            />
          )}
        </button>
      </div>

      {/* Video */}
      <div
        className={`h-full w-full object-contain`}
        ref={iframeRef}
      />

      {/* End Cover */}
      <div
        className={`absolute left-0 top-0 z-10 h-[calc(100%-44px)] w-full items-center justify-between bg-[#333] ${isEnded ? 'flex' : 'hidden'}`}
      >
        {prevLesson ? (
          <Link
            href={prevLesson}
            className="trans-500 group flex h-full w-[40%] items-center justify-center text-pretty rounded-r-full bg-white pr-10 hover:-ml-10"
          >
            <FaAnglesLeft className="wiggle h-full max-h-[150px] w-full max-w-[150px] group-hover:text-primary" />
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={nextLesson}
            className="trans-500 group flex h-full w-[40%] items-center justify-center text-pretty rounded-l-full bg-white pl-10 hover:-mr-10"
          >
            <FaAnglesRight className="wiggle h-full max-h-[150px] w-full max-w-[150px] group-hover:text-primary" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Logo Cover */}
      <Link
        href={nextLesson || prevLesson}
        className={`trans-200 absolute bottom-1.5 right-21/2 flex h-7 w-[70px] items-center justify-center rounded-md border-b-2 border-light bg-[#333] text-center text-sm font-semibold text-light shadow-lg drop-shadow-md hover:text-primary ${isEnded ? '!opacity-100' : ''}`}
        ref={logoCoverRef}
      >
        {nextLesson ? 'Bài sau' : 'Bài trước'}
      </Link>
    </div>
  )
}

export default memo(IframePlayer)
