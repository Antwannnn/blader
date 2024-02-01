import { useState, useRef, useEffect } from "react"

const padStart = (num: number) => {
  return num.toString().padStart(2, "0")
}

const formatMs = (milliseconds: number) => {
  let seconds = Math.floor(milliseconds / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  minutes = minutes % 60
  seconds = seconds % 60
  const ms = Math.floor((milliseconds % 1000) / 10)

  let str = `${padStart(minutes)}:${padStart(seconds)}.${padStart(ms)}`

  if (hours > 0) {
    str = `${padStart(hours)}:${str}`
  }

  return str
}

export const useStopwatch = () => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [timeWhenLastStopped, setTimeWhenLastStopped] = useState<number>(0)

  const interval = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (startTime > 0) {
      interval.current = setInterval(() => {
        setTime(() => Date.now() - startTime + timeWhenLastStopped)
      }, 1)
    } else {
      if (interval.current) {
        clearInterval(interval.current)
        interval.current = undefined
      }
    }
  }, [startTime])

  const start = () => {
    setIsRunning(true)
    setStartTime(Date.now())
  }

  const reset = () => {
    setIsRunning(false)
    setStartTime(0)
    setTimeWhenLastStopped(0)
    setTime(0)
  }

  const stop = () => {
    setIsRunning(false)
    setStartTime(0)
    setTimeWhenLastStopped(time)
  }

  return {
    start,
    stop,
    reset,

    isRunning,
    time: formatMs(time),
    rawTime: time,
  }
}