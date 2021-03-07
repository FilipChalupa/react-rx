import {Observable, OperatorFunction} from 'rxjs'
import * as React from 'react'
import {useAsObservable} from './useAsObservable'
import {observableCallback} from 'observable-callback'
import {startWith} from 'rxjs/operators'

const createState = <T>(initialState: T) => observableCallback(startWith<T, T>(initialState))

export function observeState<T>(
  initial: T | (() => T),
): [Observable<T>, React.Dispatch<React.SetStateAction<T>>]
export function observeState<T>(
  initial?: T | (() => T),
): [Observable<T | undefined>, React.Dispatch<React.SetStateAction<T | undefined>>] {
  const [value, update] = React.useState<T | undefined>(initial)
  return [useAsObservable(value), update]
}

export function observeCallback<T>(): [Observable<T>, (arg: T) => void]
export function observeCallback<T, K>(
  operator: OperatorFunction<T, K>,
): [Observable<K>, (arg: T) => void]
export function observeCallback<T, K>(
  operator?: OperatorFunction<T, K>,
): [Observable<T | K>, (arg: T) => void] {
  const ref = React.useRef<[Observable<T | K>, (arg: T) => void]>()
  if (!ref.current) {
    ref.current = operator ? observableCallback<T, K>(operator) : observableCallback<T>()
  }
  return ref.current
}

export function observeContext<T>(context: React.Context<T>): Observable<T> {
  return useAsObservable(React.useContext<T>(context))
}

export function observeElement<T>(): [Observable<T | null>, (el: T | null) => void] {
  const ref = React.useRef<[Observable<T | null>, (value: T | null) => void]>()
  if (!ref.current) {
    ref.current = createState<T | null>(null)
  }
  return ref.current
}
