import { ActionResponse } from '@/lib/types/action-response'
import { useEffect, useState } from 'react'

type Action<T = any> = () => Promise<ActionResponse<T>> //eslint-disable-line

export function useFetchAction<T>(action: Action<T>) {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<T | undefined | null>(undefined)

  useEffect(() => {
    setIsLoading(true)
    action()
      .then((response) => {
        setData(response.data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsError(true)
        setIsLoading(false)
      })
  }, [action])

  return { isLoading, isError, data }
}
