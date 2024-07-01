// based on https://codepen.io/nami1021/pen/VwOvKJK

import { useRef, useState } from 'react'
import classes from '~/components/cute-loader.module.css'

const b = 20 // ここでブロック数を変更

// 開始色、中間色、終了色
const startColor = [18, 194, 233] // #12c2e9
const middleColor = [196, 113, 237] // #c471ed
const endColor = [246, 79, 89] // #f64f59

// 総ステップ数
const steps = b

function clamp(num: number, lower: number, upper: number) {
  return Math.min(Math.max(num, lower), upper)
}

// 色を補間する関数
function interpolateColor(color1: number[], color2: number[], factor: number) {
  return color1.map((c, i) => Math.round(c + factor * (color2[i] - c)))
}

// グラデーションの色を計算する関数
function getGradientColor(index: number) {
  let color
  if (index < steps / 2) {
    color = interpolateColor(startColor, middleColor, index / (steps / 2 - 1))
  } else {
    color = interpolateColor(middleColor, endColor, (index - steps / 2) / (steps / 2 - 1))
  }
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}

interface CuteLoaderProps {
  progress: number // between 0 and 1
}

function CuteLoader({ progress }: CuteLoaderProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const barWrapRef = useRef<HTMLDivElement>(null)

  const [hidden, setHidden] = useState(false)

  const numBlocks = Math.floor(clamp(progress, 0, 1) * b)
  if (numBlocks === b) {
    barWrapRef.current?.animate(
      {
        opacity: [1, 0],
        visibility: 'hidden',
      },
      {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards',
      },
    )
    !hidden && setHidden(true)
  }

  return (
    <div className={classes['bar-wrap']} ref={barWrapRef}>
      {!hidden && (
        <div className={classes['bar']} ref={barRef}>
          {barRef.current &&
            Array.from({ length: numBlocks }).map((_, i) => {
              const bar = barRef.current!
              bar.style.setProperty('visibility', 'visible')

              const width = bar.offsetWidth
              const style = getComputedStyle(bar)
              const paddingLeft = parseFloat(style.paddingLeft)
              const calc = paddingLeft / 2 + (width / b - paddingLeft) / b
              const blockWidth = width / b - calc

              return (
                <span
                  key={i}
                  className={classes['bar-block']}
                  style={{
                    width: `${blockWidth}px`,
                    height: `${blockWidth}px`,
                    backgroundColor: getGradientColor(i),
                  }}
                />
              )
            })}
        </div>
      )}
    </div>
  )
}

export default CuteLoader
