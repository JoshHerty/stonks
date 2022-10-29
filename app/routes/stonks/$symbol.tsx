import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getIntradayStockPrices } from '~/lib/stocks.server'

export const loader: LoaderFunction = async ({ params }) => {
  const symbol = params.symbol!.toUpperCase()
  const prices = await getIntradayStockPrices(symbol)
  return json(prices)
}

export default function Stonks() {
  const stocks = useLoaderData()

  let min = stocks.yesterdayClose
  let max = stocks.yesterdayClose

  for (const { value } of stocks.prices) {
    if (value > max) max = value
    if (value < min) min = value
  }

  const lastValue = stocks.prices[stocks.prices.length - 1].value
  const color = lastValue >= stocks.yesterdayClose ? 'green' : 'red'

  const width = 800
  const height = 600

  const range = max - min
  const scale = height / range
  const numPoints = stocks.prices.length
  const horizontalStep = width / numPoints

  function getY(value: number) {
    return height - (value - min) * scale
  }

  function getPoint(x: number, y: number) {
    const newX = x * horizontalStep
    const newY = getY(y)
    return [newX, newY]
  }

  function renderChart(el: HTMLCanvasElement) {
    const ctx = el.getContext('2d')!
    ctx.lineWidth = 1
    ctx.beginPath()

    for (let i = 0; i < numPoints; ++i) {
      const [x, y] = getPoint(i, stocks.prices[i].value)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.strokeStyle = color
    ctx.stroke()

    const y = getY(stocks.yesterdayClose)
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.setLineDash([5])
    ctx.strokeStyle = 'gray'
    ctx.stroke()
  }

  return (
    <>
      <canvas
        style={{ width: width / 2, height: height / 2 }}
        width={width}
        height={height}
        ref={renderChart}
      />
      <pre>{JSON.stringify(stocks, null, 2)}</pre>
    </>
  )
}
