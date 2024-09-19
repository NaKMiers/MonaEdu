'use client'

import { useAppDispatch } from '@/libs/hooks'
import { setLearningLesson } from '@/libs/reducers/learningReducer'
import { ICourse } from '@/models/CourseModel'
import { ILesson } from '@/models/LessonModel'
import { IProgress } from '@/models/ProgressModel'
import { updateProgressApi } from '@/requests'
import { Slider } from '@mui/material'
import moment from 'moment-timezone'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6'
import { GrRotateLeft, GrRotateRight } from 'react-icons/gr'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import { RiFullscreenFill } from 'react-icons/ri'

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

  // states
  const [showControls, setShowControls] = useState<boolean>(true)
  const [volume, setVolume] = useState<number>(100)
  const [prevVolume, setPrevVolume] = useState<number>(100)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(
    lesson.progress?.progress ? (lesson.progress.progress / 100) * lesson.duration : 0
  ) // sec
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

  useEffect(() => {
    // set duration
    const player = videoRef.current
    if (player) {
      player.onloadedmetadata = () => {
        const duration = player.duration
        setDuration(duration)

        // set init current time from prev progress
        player.currentTime = currentTime
      }
    }

    // set volume from local storage
    setVolume(+(localStorage.getItem('volume') || '100'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        console.log('update progress - curTime:', curTime, duration, lesson.progress.progress)

        const { progress } = await updateProgressApi(
          (lesson.progress as IProgress)._id,
          (lesson.courseId as ICourse)._id,
          curTime > 0.8 * duration ? 'completed' : 'in-progress',
          curTime > 0.8 * duration ? 100 : Math.floor((curTime / duration) * 100 * 100) / 100
        )

        // update states
        dispatch(setLearningLesson({ ...lesson, progress }))

        // // update course's progress
        // if (progress.status === 'completed') {
        //   await update()
        // }
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
  }, [dispatch, duration, lesson, curUser])

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
  const handleFullscreen = useCallback(() => {
    const element = playerContainerRef.current

    if (!isFullscreen) {
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
      setIsFullscreen(true)
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
      setIsFullscreen(false)
    }
  }, [isFullscreen])

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

  // useEffect to handle mouse move for showing/hiding controls
  useEffect(() => {
    const playerContainer = playerContainerRef.current

    if (playerContainer) {
      playerContainer.addEventListener('mousemove', showControlsHandler)

      return () => {
        playerContainer.removeEventListener('mousemove', showControlsHandler)
      }
    }
  }, [showControlsHandler])

  // useEffect to show/hide controls
  useEffect(() => {
    if (currentTime === 0 || isDragging) return

    if (showControls) {
      if (!controlsRef.current || !playRef.current || !videoBarRef.current) return

      playRef.current.style.opacity = '1'
      videoBarRef.current.style.transform = 'translateY(0)'
      controlsRef.current.classList.add('bg-neutral-950')
      controlsRef.current.classList.add('g-opacity-50')
    } else {
      if (!controlsRef.current || !playRef.current || !videoBarRef.current) return

      playRef.current.style.opacity = '0'
      videoBarRef.current.style.transform = 'translateY(100%)'
      controlsRef.current.classList.remove('bg-neutral-950')
      controlsRef.current.classList.remove('g-opacity-50')
    }
  }, [showControls, currentTime, isDragging])

  // MARK: Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        handleFullscreen()
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
        handleSeek(currentTime - 5)
      }

      // L
      if (e.key === 'K') {
        e.preventDefault()
        handleSeek(currentTime - 5)
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
    handlePlay,
    handleMute,
    handleFullscreen,
    handleSeek,
    handleChangeVolume,
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
      className={`relative w-full h-full ${className}`}
      onDoubleClick={handleFullscreen}
      ref={playerContainerRef}
    >
      {/* Video */}
      <video className='w-full h-full object-contain' ref={videoRef}>
        <source src={lesson.source} type='video/mp4' />
      </video>

      {/* Controls */}
      <div
        className='flex flex-col justify-end absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-neutral-950 bg-opacity-50 select-none trans-300'
        onClick={() => isFirstPlayed.current && setShowControls(!showControls)}
        ref={controlsRef}
      >
        <div className='flex flex-1 justify-between'>
          <div // back to 5s
            className='max-w-[300px] w-1/4 h-full'
            onDoubleClick={e => {
              e.stopPropagation()
              handleSeek(currentTime - seekTime < 0 ? 0 : currentTime - seekTime)
            }}
          />
          <div // next to 5s
            className='max-w-[300px] w-1/4 h-full'
            onDoubleClick={e => {
              e.stopPropagation()
              handleSeek(currentTime + seekTime > duration ? duration : currentTime + seekTime)
            }}
          />
        </div>

        {/* Play - Back - Next Button */}
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-5 sm:gap-8 justify-center trans-300'
          onClick={e => e.stopPropagation()}
          ref={playRef}
        >
          {/* Back */}
          <button
            className='absolute -top-4 -left-8 -translate-x-1/2 -translate-y-1/2 text-light trans-200 hover:text-orange-400 shadow-lg rounded-full'
            onClick={() => handleSeek(currentTime - seekTime < 0 ? 0 : currentTime - seekTime)}
            onDoubleClick={e => e.stopPropagation()}
          >
            <GrRotateLeft className='w-[40px] sm:w-[50px] h-[40px] sm:h-[50px]' />
            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5 text-xs sm:text-base font-semibold'>
              5
            </span>
          </button>

          {/* Next */}
          <button
            className='absolute -top-4 -right-8 translate-x-1/2 -translate-y-1/2 text-light trans-200 hover:text-orange-400 shadow-lg rounded-full'
            onClick={() =>
              handleSeek(currentTime + seekTime > duration ? duration : currentTime + seekTime)
            }
            onDoubleClick={e => e.stopPropagation()}
          >
            <GrRotateRight className='w-[40px] sm:w-[50px] h-[40px] sm:h-[50px]' />
            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5 text-xs sm:text-base font-semibold'>
              5
            </span>
          </button>

          {/* Play/Pause */}
          <button
            className='rounded-full bg-orange-400 w-[80px] h-[80px] flex items-center justify-center shadow-lg hover:shadow-orange-400 trans-300'
            onClick={handlePlay}
            onDoubleClick={e => e.stopPropagation()}
          >
            {isPlaying ? (
              <FaCirclePause size={40} className='text-light' />
            ) : (
              <FaCirclePlay size={40} className='text-light' />
            )}
          </button>

          {/* Smile */}
          <div className='absolute -bottom-12 -translate-y-1/2 w-[110px]'>
            <Image
              width={150}
              height={100}
              className='w-full h-full object-contain'
              src='/icons/smile-line.png'
              alt='mona-edu'
            />
          </div>
        </div>

        {/* Seek & Controls */}
        <div
          className='flex flex-col w-full px-4 trans-300 overflow-hidden'
          onClick={e => e.stopPropagation()}
          ref={videoBarRef}
        >
          {/* Seek */}
          <div
            className='relative w-full h-1 bg-slate-400 bg-opacity-50 cursor-pointer hover:h-3 trans-200'
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
              className='absolute top-1/2 left-0 -translate-y-1/2 h-[100%] bg-orange-400'
              style={{
                width: `${(currentTime / duration) * 100}%`,
              }}
            />
          </div>

          {/* Actions Buttons */}
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-[13px]'>
              <button
                className='group w-12 h-[50px] flex items-center justify-center'
                onClick={handlePlay}
              >
                {isPlaying ? (
                  <FaCirclePause
                    size={22}
                    className='text-light group-hover:shadow-orange-400 shadow-md rounded-full trans-200'
                  />
                ) : (
                  <FaCirclePlay
                    size={22}
                    className='text-light group-hover:shadow-orange-400 shadow-md rounded-full trans-200'
                  />
                )}
              </button>
              <div className='flex h-[50px] items-center cursor-pointer'>
                <button className='flex items-center justify-center group peer' onClick={handleMute}>
                  {volume > 0 ? (
                    <HiSpeakerWave size={23} className='text-light flex-shrink-0' />
                  ) : (
                    <HiSpeakerXMark size={23} className='text-light flex-shrink-0' />
                  )}
                </button>

                <div className='w-0 h-full items-center peer-hover:flex peer-hover:w-[135px] peer-hover:px-4 hover:flex hover:w-[135px] hover:px-4 hover:overflow-visible overflow-hidden hover:mr-1 peer-hover:mr-1 mr-3 flex trans-300'>
                  <Slider
                    value={volume}
                    onChange={(_: any, newValue: any) => handleChangeVolume(newValue as number)}
                    color='warning'
                  />
                </div>
              </div>
              <div className='text-light tracking-widest font-semibold text-sm flex items-center'>
                <span>
                  {currentTime / 3600 < 1
                    ? moment.utc(currentTime * 1000).format('m:ss')
                    : moment.utc(currentTime * 1000).format('h:mm:ss')}
                </span>
                <span className='mx-0.5'>/</span>
                <span>
                  {duration / 3600 < 1
                    ? moment.utc(duration * 1000).format('m:ss')
                    : moment.utc(duration * 1000).format('h:mm:ss')}
                </span>
              </div>
            </div>
            <div className='flex items-center'>
              <button
                className='group w-12 h-[50px] flex items-center justify-center'
                onClick={handleFullscreen}
              >
                <RiFullscreenFill size={24} className='text-light' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(VideoPlayer)
