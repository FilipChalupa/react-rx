import {
  React,
  ReactDOM,
  reactiveComponent,
  useState,
  switchMap,
  startWith,
  timer,
  map
} from '../_utils/globalScope'
//@endimport

const UseStateExample = reactiveComponent(() => {
  const [delay$, setDelay] = useState(100)

  return delay$.pipe(
    switchMap(delay =>
      timer(500, delay).pipe(
        map(n => `Count: ${n}`),
        startWith('Starting counter…'),
        map(label => (
          <>
            Counter interval (ms):{' '}
            <input
              type="range"
              min={0}
              max={1000}
              step={100}
              onChange={e => setDelay(Number(e.currentTarget.value))}
            />
            {delay}
            <div>{label}</div>
          </>
        ))
      )
    )
  )
})

ReactDOM.render(
  <UseStateExample />,
  document.getElementById('use-state-example')
)
