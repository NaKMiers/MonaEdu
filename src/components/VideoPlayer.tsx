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
import { Slider } from '@mui/material'
import moment from 'moment-timezone'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAnglesLeft, FaAnglesRight, FaCirclePause, FaCirclePlay } from 'react-icons/fa6'
import { GrRotateLeft, GrRotateRight } from 'react-icons/gr'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import { RiFullscreenExitLine, RiFullscreenFill } from 'react-icons/ri'

interface VideoPlayerProps {
  lesson: ILesson
  className?: string
}

const seekTime = 5

function VideoPlayer({ lesson, className = '' }: VideoPlayerProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // reducers
  const chapters = useAppSelector(state => state.learning.chapters)
  const nextLesson = useAppSelector(state => state.learning.nextLesson)
  const prevLesson = useAppSelector(state => state.learning.prevLesson)
  const isFullScreen = useAppSelector(state => state.learning.isFullScreen)

  // states
  const [showControls, setShowControls] = useState<boolean>(true)
  const [volume, setVolume] = useState<number>(100)
  const [prevVolume, setPrevVolume] = useState<number>(100)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(
    lesson.progress?.progress ? (lesson.progress.progress / 100) * lesson.duration : 0
  ) // sec
  const [isEnded, setIsEnded] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [buffered, setBuffered] = useState<number>(0)

  // refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerContainerRef = useRef<any>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const playRef = useRef<HTMLDivElement>(null)
  const videoBarRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFirstPlayed = useRef<boolean>(false)
  const topCoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // set duration
    const player = videoRef.current
    if (!player) return

    player.onloadedmetadata = () => {
      const duration = player.duration
      setDuration(duration)

      // set init current time from prev progress
      player.currentTime = currentTime
    }

    // check if ended
    player.onended = () => {
      setIsEnded(true)
      setIsPlaying(false)
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current)
      }
    }

    // set volume from local storage
    const volume: number = +(localStorage.getItem('volume') || '100')
    setVolume(volume)
    player.volume = volume / 100
  }, [currentTime])

  // MARK: reset player on unmount
  useEffect(() => {
    return () => {
      dispatch(resetLearningLesson())
      clearTimeout(progressTimeoutRef.current as NodeJS.Timeout)
      setIsPlaying(false)
      setIsEnded(false)
      isFirstPlayed.current = false
      dispatch(setIsFullScreen(false))
    }
  }, [dispatch])

  // update current time and buffered
  useEffect(() => {
    const interval = setInterval(() => {
      const player = videoRef.current
      if (player && isPlaying) {
        const buffered =
          player.buffered.length > 0
            ? player.buffered.end(player.buffered.length - 1) / player.duration
            : 0

        setBuffered(buffered * duration)
        setCurrentTime(player.currentTime)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, duration])

  // MARK: Update lesson progress
  const handleUpdateLessonProgress = useCallback(async () => {
    const isEnrolled = curUser?.courses
      ?.map((course: any) => course.course)
      .includes((lesson?.courseId as ICourse)._id)
    if (!lesson?.progress || !isEnrolled || !duration) return

    try {
      const player = videoRef.current
      if (!player) return

      const curTime = player.currentTime

      const invalidProgress =
        Math.floor((curTime / duration) * 100 * 100) / 100 <= lesson.progress.progress
      if (!invalidProgress) {
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

          const completedLessons = allLessons.filter(
            lesson => lesson?.progress && lesson.progress.status === 'completed'
          )

          let percent = Math.round(((completedLessons.length + 1) / allLessons.length) * 100)
          if (percent > 100) percent = 100

          dispatch(setUserProgress(percent))
        }
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      let interval = 120000 // default 2m/time
      if (duration < 60) {
        // < 1min
        interval = 6000 // 6s/time -> 10 times
        console.log('6 sec/time', duration)
      } else if (duration < 300) {
        // < 5min
        interval = 30000 // 30s/time -> 10 times
        console.log('30 sec/time', duration)
      } else if (duration < 600) {
        // < 10min
        interval = 60000 // 1min/time -> 10 times
        console.log('1 min/time', duration)
      } else if (duration < 1800) {
        // < 30min
        interval = 90000 // 1.5min/time -> 20 times
        console.log('1.5 min/time', duration)
      } else if (duration < 3600) {
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
  }, [dispatch, lesson, chapters, duration, curUser])

  // MARK: Play/Pause
  const play = useCallback(() => {
    // play if player is ready
    const player = videoRef.current
    if (player) {
      player.play()
      setIsPlaying(true)
    }
  }, [])

  const pause = useCallback(() => {
    const player = videoRef.current
    if (player) {
      player.pause()
      setIsPlaying(false)
    }
  }, [])

  const handlePlay = useCallback(() => {
    const player = videoRef.current
    if (player) {
      if (isPlaying) {
        pause()

        if (progressTimeoutRef.current) {
          clearTimeout(progressTimeoutRef.current)
        }
      } else {
        isFirstPlayed.current = true
        play()

        // update lesson progress every play
        handleUpdateLessonProgress()
      }
    }
  }, [handleUpdateLessonProgress, play, pause, isPlaying])

  // MARK: Seek
  const handleSeek = useCallback((seconds: number) => {
    const player = videoRef.current
    if (player) {
      player.currentTime = seconds
      setCurrentTime(seconds)
    }
  }, [])

  const handleSeekMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isDragging && progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect()
        const newTime = ((e.clientX - rect.left) / rect.width) * duration
        handleSeek(newTime)
      }
    },
    [duration, handleSeek, isDragging]
  )

  const handleSeekMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleSeekMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsDragging(true)
      handleSeekMouseMove(e)
    },
    [handleSeekMouseMove]
  )

  const handleSeekMouseClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect()
        const newTime = ((e.clientX - rect.left) / rect.width) * duration
        handleSeek(newTime)
        handleUpdateLessonProgress()
      }
    },
    [duration, handleSeek, handleUpdateLessonProgress]
  )

  const handleSeekTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isDragging && progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect()
        const newTime = ((e.touches[0].clientX - rect.left) / rect.width) * duration
        handleSeek(newTime)
      }
    },
    [duration, handleSeek, isDragging]
  )

  const handleSeekTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setIsDragging(true)
      handleSeekTouchMove(e)
    },
    [handleSeekTouchMove]
  )

  const handleSeekTouchEnd = useCallback(() => {
    setIsDragging(false)
    handleUpdateLessonProgress()
  }, [handleUpdateLessonProgress])

  // MARK: Volume
  const handleChangeVolume = useCallback((newValue: number) => {
    setVolume(newValue as number)
    localStorage.setItem('volume', JSON.stringify(newValue))

    const player = videoRef.current
    if (player) {
      player.volume = newValue / 100
    }
  }, [])

  const handleMute = useCallback(() => {
    const player = videoRef.current
    if (player) {
      if (volume > 0) {
        setPrevVolume(volume)
        setVolume(0)
        player.muted = true
      } else {
        setVolume(prevVolume)
        player.muted = false
      }
    }
  }, [prevVolume, volume])

  // MARK: Fullscreen
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

  // MARK: Show/Hide Controls
  const showControlsHandler = useCallback(() => {
    if (!isFirstPlayed.current || isDragging) return

    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 2500)
  }, [isDragging])

  // useEffect to show/hide controls
  useEffect(() => {
    if (currentTime === 0 || isDragging) return

    if (showControls) {
      if (!controlsRef.current || !playRef.current || !videoBarRef.current || !topCoverRef.current)
        return

      playRef.current.style.opacity = '1'
      topCoverRef.current.style.opacity = '1'
      videoBarRef.current.style.transform = 'translateY(0)'
      controlsRef.current.classList.add('bg-neutral-950')
      controlsRef.current.classList.add('g-opacity-50')
    } else {
      if (!controlsRef.current || !playRef.current || !videoBarRef.current || !topCoverRef.current)
        return

      playRef.current.style.opacity = '0'
      topCoverRef.current.style.opacity = '0'
      videoBarRef.current.style.transform = 'translateY(100%)'
      controlsRef.current.classList.remove('bg-neutral-950')
      controlsRef.current.classList.remove('g-opacity-50')
    }
  }, [showControls, currentTime, isDragging])

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

      // Space
      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault()
        handlePlay()
      }

      // M
      if (e.key === 'm') {
        e.preventDefault()
        handleMute()
      }

      // F
      if (e.key === 'f') {
        e.preventDefault()
        dispatch(setIsFullScreen(!isFullScreen))
      }

      // Arrow Left
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleSeek(currentTime - 5)
      }

      // Arrow Right
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleSeek(currentTime + 5)
      }

      // Arrow Up
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleChangeVolume(volume + 5 > 100 ? 100 : volume + 5)
      }

      // Arrow Down
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleChangeVolume(volume - 5 < 0 ? 0 : volume - 5)
      }

      // J
      if (e.key === 'j') {
        e.preventDefault()
        handleSeek(currentTime - 10)
      }

      // L
      if (e.key === 'l') {
        e.preventDefault()
        handleSeek(currentTime + 10)
      }

      // Number: 0-9
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        const number = +e.key
        handleSeek((number / 9) * duration)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    dispatch,
    handlePlay,
    handleMute,
    handleSeek,
    handleChangeVolume,
    isFullScreen,
    currentTime,
    volume,
    duration,
  ])

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
      onMouseMove={showControlsHandler}
      ref={playerContainerRef}
    >
      {/* Video */}
      <video
        className="h-full w-full object-contain"
        ref={videoRef}
      >
        <source
          src={lesson.source}
          type="video/mp4"
        />
      </video>

      {/* Controls */}
      <div
        className="trans-300 absolute bottom-0 left-0 right-0 top-0 flex h-full w-full select-none flex-col justify-end bg-neutral-950 bg-opacity-50"
        onClick={() => isFirstPlayed.current && setShowControls(!showControls)}
        ref={controlsRef}
      >
        <div
          className="absolute left-0 top-0 flex h-[60px] w-full items-center gap-2 px-2.5"
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

        <div className="flex flex-1 justify-between">
          <div // back to 5s
            className="h-full w-1/4 max-w-[300px]"
            onDoubleClick={e => {
              e.stopPropagation()
              handleSeek(currentTime - seekTime < 0 ? 0 : currentTime - seekTime)
            }}
          />
          <div // next to 5s
            className="h-full w-1/4 max-w-[300px]"
            onDoubleClick={e => {
              e.stopPropagation()
              handleSeek(currentTime + seekTime > duration ? duration : currentTime + seekTime)
            }}
          />
        </div>

        {/* Play - Back - Next Button */}
        <div
          className="trans-300 absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-5 sm:gap-8"
          onClick={e => e.stopPropagation()}
          ref={playRef}
        >
          {/* Back */}
          <button
            className="trans-200 absolute -left-8 -top-4 -translate-x-1/2 -translate-y-1/2 rounded-full text-light shadow-lg hover:text-orange-400"
            onClick={() => handleSeek(currentTime - seekTime < 0 ? 0 : currentTime - seekTime)}
            onDoubleClick={e => e.stopPropagation()}
          >
            <GrRotateLeft className="h-[40px] w-[40px] sm:h-[50px] sm:w-[50px]" />
            <span className="absolute left-1/2 top-1/2 mt-0.5 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold sm:text-base">
              5
            </span>
          </button>

          {/* Next */}
          <button
            className="trans-200 absolute -right-8 -top-4 -translate-y-1/2 translate-x-1/2 rounded-full text-light shadow-lg hover:text-orange-400"
            onClick={() =>
              handleSeek(currentTime + seekTime > duration ? duration : currentTime + seekTime)
            }
            onDoubleClick={e => e.stopPropagation()}
          >
            <GrRotateRight className="h-[40px] w-[40px] sm:h-[50px] sm:w-[50px]" />
            <span className="absolute left-1/2 top-1/2 mt-0.5 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold sm:text-base">
              5
            </span>
          </button>

          {/* Play/Pause */}
          <button
            className="trans-300 flex h-[80px] w-[80px] items-center justify-center rounded-full bg-orange-400 shadow-lg hover:shadow-orange-400"
            onClick={handlePlay}
            onDoubleClick={e => e.stopPropagation()}
          >
            {isPlaying ? (
              <FaCirclePause
                size={40}
                className="text-light"
              />
            ) : (
              <FaCirclePlay
                size={40}
                className="text-light"
              />
            )}
          </button>

          {/* Smile */}
          <div className="absolute -bottom-12 w-[110px] -translate-y-1/2">
            <Image
              width={150}
              height={100}
              className="h-full w-full object-contain"
              src="/icons/smile-line.png"
              alt="mona-edu"
            />
          </div>
        </div>

        {/* Seek & Controls */}
        <div
          className="trans-300 flex w-full flex-col overflow-hidden px-4"
          onClick={e => e.stopPropagation()}
          ref={videoBarRef}
        >
          {/* Seek */}
          <div
            className="trans-200 relative h-1 w-full cursor-pointer bg-slate-400 bg-opacity-50 hover:h-3"
            ref={progressBarRef}
            onMouseDown={handleSeekMouseDown}
            onMouseMove={handleSeekMouseMove}
            onMouseUp={handleSeekMouseUp}
            onMouseLeave={handleSeekMouseUp}
            onTouchStart={handleSeekTouchStart}
            onTouchMove={handleSeekTouchMove}
            onTouchEnd={handleSeekTouchEnd}
            onClick={handleSeekMouseClick}
          >
            <div
              className={`h-full bg-slate-300`}
              style={{
                width: `${(buffered / duration) * 100}%`,
              }}
            />
            <div
              className="absolute left-0 top-1/2 h-[100%] -translate-y-1/2 bg-orange-400"
              style={{
                width: `${(currentTime / duration) * 100}%`,
              }}
            />
          </div>

          {/* Actions Buttons */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[13px]">
              <button
                className="group flex h-[50px] w-12 items-center justify-center"
                onClick={handlePlay}
              >
                {isPlaying ? (
                  <FaCirclePause
                    size={22}
                    className="trans-200 rounded-full text-light shadow-md group-hover:shadow-orange-400"
                  />
                ) : (
                  <FaCirclePlay
                    size={22}
                    className="trans-200 rounded-full text-light shadow-md group-hover:shadow-orange-400"
                  />
                )}
              </button>
              <div className="flex h-[50px] cursor-pointer items-center">
                <button
                  className="group peer flex items-center justify-center"
                  onClick={handleMute}
                >
                  {volume > 0 ? (
                    <HiSpeakerWave
                      size={23}
                      className="flex-shrink-0 text-light"
                    />
                  ) : (
                    <HiSpeakerXMark
                      size={23}
                      className="flex-shrink-0 text-light"
                    />
                  )}
                </button>

                <div className="trans-300 mr-3 flex h-full w-0 items-center overflow-hidden hover:mr-1 hover:flex hover:w-[135px] hover:overflow-visible hover:px-4 peer-hover:mr-1 peer-hover:flex peer-hover:w-[135px] peer-hover:px-4">
                  <Slider
                    value={volume}
                    onChange={(_: any, newValue: any) => handleChangeVolume(newValue as number)}
                    color="warning"
                  />
                </div>
              </div>
              <div className="flex items-center text-sm font-semibold tracking-widest text-light">
                <span>
                  {currentTime / 3600 < 1
                    ? moment.utc(currentTime * 1000).format('m:ss')
                    : moment.utc(currentTime * 1000).format('h:mm:ss')}
                </span>
                <span className="mx-0.5">/</span>
                <span>
                  {duration / 3600 < 1
                    ? moment.utc(duration * 1000).format('m:ss')
                    : moment.utc(duration * 1000).format('h:mm:ss')}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <Link
                href={nextLesson || prevLesson}
                className={`trans-200 absolute bottom-[11px] right-21/2 flex h-7 w-[70px] items-center justify-center rounded-md border-b-2 border-light bg-[#333] text-center text-sm font-semibold text-light shadow-lg drop-shadow-md hover:text-primary ${isEnded ? '!opacity-100' : ''}`}
              >
                {nextLesson ? 'Bài kế' : 'Bài trước'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* End Cover */}
      <div
        className={`absolute left-0 top-0 z-10 h-[calc(100%-55px)] w-full items-center justify-between bg-[#333] ${isEnded ? 'flex' : 'hidden'}`}
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
    </div>
  )
}

export default memo(VideoPlayer)
