import {BehaviorSubject, Observable, Subject} from 'rxjs'
import {useRef} from 'react'
import {useIsomorphicEffect} from './useIsomorphicEffect'

/**
 * React hook to convert any props or state value into an observable
 * Returns an observable representing updates to any React value (props, state or any other calculated value)
 * Note: the returned observable is the same instance throughout the component lifecycle
 * @param value
 */
export function useAsObservable<T>(value: T): Observable<T>
export function useAsObservable<T, K>(
  value: T,
  operator: (input: Observable<T>) => Observable<K>,
): Observable<K>
export function useAsObservable<T, K = T>(
  value: T,
  operator?: (input: Observable<T>) => Observable<K>,
): Observable<T | K> {
  const initialized = useRef(false)
  const observableRef = useRef<Observable<T | K>>()
  const subjectRef = useRef<Subject<T>>(new BehaviorSubject(value))

  if (!initialized.current) {
    const observable = subjectRef.current.asObservable()
    observableRef.current = operator ? observable.pipe(operator) : observable
    initialized.current = true
  }

  useIsomorphicEffect(() => {
    // emit only on update
    subjectRef.current.next(value)
  }, [value])

  useIsomorphicEffect(() => {
    return () => {
      return subjectRef.current.complete()
    }
  }, [])

  return observableRef.current!
}
