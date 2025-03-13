import { useCallback, useEffect, useRef, useState } from "react"

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

interface StopwatchOptions {
  mode?: 'timer' | 'countdown'
  initialTime?: number // Durée initiale en millisecondes pour le décompte
  onComplete?: () => void // Callback quand le décompte atteint zéro
}

export const useStopwatch = (options: StopwatchOptions = {}) => {
  const { 
    mode = 'timer',
    initialTime = 0,
    onComplete
  } = options
  
  const [time, setTime] = useState(mode === 'countdown' ? initialTime : 0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [timeWhenLastStopped, setTimeWhenLastStopped] = useState<number>(mode === 'countdown' ? initialTime : 0)
  const [isComplete, setIsComplete] = useState(false)

  const interval = useRef<ReturnType<typeof setInterval>>()
  const onCompleteRef = useRef(onComplete)

  // Mettre à jour la référence du callback quand il change
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (startTime > 0) {
      interval.current = setInterval(() => {
        setTime(() => {
          const elapsed = Date.now() - startTime
          let newTime = 0

          if (mode === 'timer') {
            newTime = elapsed + timeWhenLastStopped
          } else {
            // Mode décompte
            newTime = Math.max(0, timeWhenLastStopped - elapsed)
            
            // Vérifier si le décompte est terminé
            if (newTime === 0 && !isComplete) {
              setIsComplete(true)
              setIsRunning(false)
              setStartTime(0)
              if (onCompleteRef.current) {
                onCompleteRef.current()
              }
            }
          }
          
          return newTime
        })
      }, 1)
    } else {
      if (interval.current) {
        clearInterval(interval.current)
        interval.current = undefined
      }
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current)
        interval.current = undefined
      }
    }
  }, [startTime, timeWhenLastStopped, mode, isComplete])

  const start = useCallback(() => {
    if (mode === 'countdown' && timeWhenLastStopped === 0) return // Ne pas démarrer si décompte déjà à zéro
    setIsRunning(true)
    setStartTime(Date.now())
    setIsComplete(false)
  }, [mode, timeWhenLastStopped])

  const reset = useCallback(() => {
    setIsRunning(false)
    setStartTime(0)
    setTimeWhenLastStopped(mode === 'countdown' ? initialTime : 0)
    setTime(mode === 'countdown' ? initialTime : 0)
    setIsComplete(false)
  }, [mode, initialTime])

  const stop = useCallback(() => {
    setIsRunning(false)
    setStartTime(0)
    setTimeWhenLastStopped(time)
  }, [time])

  const setInitialCountdown = useCallback((newInitialTime: number) => {
    if (mode === 'countdown' && !isRunning) {
      setTime(newInitialTime)
      setTimeWhenLastStopped(newInitialTime)
      setIsComplete(false)
    }
  }, [mode, isRunning])

  return {
    start,
    stop,
    reset,
    setInitialCountdown,
    
    isRunning,
    isComplete,
    time: formatMs(time),
    rawTime: time,
    mode,
  }
}