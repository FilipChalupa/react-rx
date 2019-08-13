import * as React from 'react'
import {concat, defer, merge, of, timer} from 'rxjs'
import {catchError, map, mergeMapTo, startWith, switchMapTo, take, tap} from 'rxjs/operators'
import {reactiveComponent, useEventHandler} from '../../'

const numbers$ = timer(500, 500).pipe(
  tap(() => {
    if (Math.random() > 0.9) {
      throw new Error('Stream failed')
    }
  })
)

interface Props {
  number?: number
  error?: null | Error
  retrying?: boolean | Error
  onRetry?: (event: any) => void
}

export const ErrorsExample = reactiveComponent(() => {
  const [onRetry$, onRetry] = useEventHandler<React.MouseEvent>()

  return numbers$.pipe(
    map(n => ({number: n})),
    catchError((error, caught$) =>
      merge(
        of({error}),
        onRetry$.pipe(
          take(1),
          switchMapTo(concat(of({error, retrying: true}), caught$))
        )
      )
    ),
    map((props: Props) => (
      <>
        <p>The observable stream will fail 1 in 10 times on average</p>
        {props.error ? (
          <>
            {props.retrying ? (
              'Retrying…'
            ) : (
              <>
                <p>Oh no: an error occurred: {props.error.message}</p>
                <p>
                  <button onClick={onRetry}>Retry</button>
                </p>
              </>
            )}
          </>
        ) : (
          `Counter: ${props.number}`
        )}
      </>
    ))
  )
})