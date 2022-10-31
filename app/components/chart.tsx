import type { IntradayStockPrices } from '~/lib/stocks.server'

const COLOR_UP = 'green'
const COLOR_DOWN = 'red'
const COLOR_YESTERDAY = 'gray'

const WIDTH = 400
const HEIGHT = 300

export interface ChartProps {
  data: IntradayStockPrices
}

export function Chart(props: ChartProps) {
  function renderChart(el: HTMLCanvasElement) {
    const m = window.devicePixelRatio
    const width = WIDTH * m
    const height = HEIGHT * m

    el.width = width
    el.height = height

    const { prices, yesterdayClose } = props.data

    let min = yesterdayClose
    let max = yesterdayClose

    for (const { value } of prices) {
      if (value > max) max = value
      if (value < min) min = value
    }

    const lastValue = prices[prices.length - 1].value
    const color = lastValue >= yesterdayClose ? COLOR_UP : COLOR_DOWN

    const range = max - min
    const verticalScale = height / range
    const numPoints = prices.length
    const horizontalScale = width / numPoints

    const getY = (value: number) => height - (value - min) * verticalScale
    const getPoint = (x: number, y: number) => {
      const newX = x * horizontalScale
      const newY = getY(y)
      return [newX, newY] as const
    }

    const ctx = el.getContext('2d')!

    ctx.lineWidth = 2
    ctx.beginPath()

    prices.forEach(({ value }, i) => {
      const [x, y] = getPoint(i, value)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.strokeStyle = color
    ctx.stroke()

    const y = getY(yesterdayClose)
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.setLineDash([5])
    ctx.strokeStyle = COLOR_YESTERDAY
    ctx.stroke()
  }

  return (
    <canvas
      style={{ width: WIDTH, height: HEIGHT }}
      width={WIDTH}
      height={HEIGHT}
      ref={renderChart}
    />
  )
}
