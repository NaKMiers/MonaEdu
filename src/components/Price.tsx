'use client'

import { IFlashSale } from '@/models/FlashSaleModel'
import { countPercent, formatPrice } from '@/utils/number'
import { memo, useEffect, useState } from 'react'
import { FaBoltLightning } from 'react-icons/fa6'
import CounterItem from './CounterItem'

interface PriceProps {
  price: number
  oldPrice?: number
  big?: boolean
  flashSale: IFlashSale | undefined
  className?: string
}

function Price({ price, oldPrice, flashSale, big, className = '' }: PriceProps) {
  // states
  const [isValidFS, setIsValidFS] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number[]>([0, 0, 0])
  const [newPrice, setNewPrice] = useState<number>(price)

  // MARK: Effects
  // count down
  useEffect(() => {
    // check flash sale
    if (!flashSale) return

    let interval: NodeJS.Timeout

    // get hours, minutes, seconds left
    const getTimesLeft = () => {
      // target time
      const now = new Date().getTime()
      let targetTime: any

      // check time type
      if (flashSale.timeType === 'once' && flashSale.expire) {
        targetTime = new Date(flashSale.expire)
      } else if (flashSale.timeType === 'loop' && flashSale.duration) {
        const begin = new Date(flashSale.begin).getTime()

        const a = (now - begin) / 1000 / 60 // time distance in minute
        const d = flashSale.duration // duration in minute
        const b = a / d
        const c = Math.ceil(b) * d
        const t = new Date(begin)
        t.setMinutes(t.getMinutes() + c)
        targetTime = t
      }

      let timeDifference = targetTime - now

      let seconds = 0
      let minutes = 0
      let hours = 0
      if (timeDifference > 0) {
        seconds = Math.floor((timeDifference / 1000) % 60)
        minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
        hours = Math.floor(timeDifference / (1000 * 60 * 60))
      }

      // return hours, minutes, seconds left
      return [hours, minutes, seconds]
    }

    // start count down
    interval = setInterval(() => {
      setTimeLeft(getTimesLeft())

      // check if time is up
      if (timeLeft[0] === 0 && timeLeft[1] === 0 && timeLeft[2] === 0) {
        clearInterval(interval)
      }
    }, 1000)

    // clean up
    return () => clearInterval(interval)
  }, [flashSale, timeLeft])

  // check flash sale is valid
  useEffect(() => {
    if (flashSale) {
      const now = new Date()

      if (now > new Date(flashSale.begin)) {
        if (flashSale.timeType === 'once') {
          if (flashSale.expire && now < new Date(flashSale.expire)) {
            setIsValidFS(true)
          }
        } else if (flashSale.timeType === 'loop') {
          setIsValidFS(true)
        }

        switch (flashSale.type) {
          case 'fixed-reduce':
            setNewPrice(price + +flashSale.value >= 0 ? price + +flashSale.value : 0)
            break
          case 'fixed':
            setNewPrice(+flashSale.value)
            break
          case 'percentage':
            setNewPrice(price + Math.floor((price * parseFloat(flashSale.value)) / 100))
            break
        }
      }
    }
  }, [flashSale, price])

  return (
    <div className={`overflow-hidden rounded-md ${className}`}>
      {/* MARK: Flash Sale */}
      {isValidFS && (
        <div className="flex items-center justify-between gap-2 bg-dark-0 px-2 py-1.5 font-body text-[18px] font-bold tracking-wider text-light">
          <span className={`hidden leading-[20px] md:block ${big ? 'sm:text-[22px]' : ''} text-[14px]`}>
            Flash sale
          </span>
          <FaBoltLightning
            size={16}
            className="md:hidden"
          />

          {/* Counter */}
          <div className="flex h-[20px] shrink-0 items-center gap-1">
            {/* Hours */}
            <div className="flex items-center rounded-sm bg-dark-100 pl-[2px] pr-[1px]">
              <CounterItem
                value={Math.floor(timeLeft[0] / 10)}
                max={9}
              />
              <CounterItem
                value={timeLeft[0] % 10}
                max={9}
              />
            </div>
            <span>:</span>

            {/* Minutes */}
            <div className="flex items-center rounded-sm bg-dark-100 pl-[2px] pr-[1px]">
              <CounterItem
                value={Math.floor(timeLeft[1] / 10)}
                max={5}
              />
              <CounterItem
                value={timeLeft[1] % 10}
                max={9}
              />
            </div>
            <span>:</span>

            {/* Seconds */}
            <div className="flex items-center rounded-sm bg-dark-100 pl-[2px] pr-[1px]">
              <CounterItem
                value={Math.floor(timeLeft[2] / 10)}
                max={5}
              />
              <CounterItem
                value={timeLeft[2] % 10}
                max={9}
              />
            </div>
          </div>
        </div>
      )}

      {/* MARK: Price */}
      <div
        className={`flex h-[36px] items-center justify-evenly gap-2 px-1.5 py-1 ${
          big ? 'sm:justify-start sm:gap-4 sm:px-21' : ''
        } flex-wrap bg-slate-100 font-body`}
      >
        <div
          className={`text-dark ${
            big ? 'text-[30px] tracking-wide' : 'text-[21px] tracking-wider'
          } leading-7`}
        >
          {formatPrice(newPrice)}
        </div>
        {oldPrice && (
          <div
            className={`text-gray-400 ${
              big ? 'text-[16px] tracking-wider' : 'text-[12px]'
            } line-through`}
          >
            {formatPrice(oldPrice)}
          </div>
        )}
        {oldPrice && (
          <div
            className={`bg-yellow-400 ${
              big ? 'text-[16px]' : 'text-[11px]'
            } flex h-6 items-center rounded-md px-1 py-0.5 font-sans font-semibold text-light`}
          >
            -{countPercent(newPrice, oldPrice)}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(Price)
