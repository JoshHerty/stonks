import alphaadvantage from 'alphavantage'

const alpha = alphaadvantage({ key: process.env.ALPHA_ADVANTAGE_API_KEY! })

export async function getIntradayStockPrices(symbol: string): Promise<{
  yesterdayClose: number
  prices: { date: string; value: number }[]
}> {
  const data = await alpha.data.intraday(symbol, 'full')

  const points = data['Time Series (1min)']
  let today = null
  let yesterday = null
  const prices = []
  for (const date of Object.keys(points)) {
    if (today == null) today = date.split(' ')[0]

    if (!date.startsWith(today)) {
      yesterday = date.split(' ')[0]
      break
    }

    prices.push({ date, value: +points[date]['4. close'] })
  }

  const yesterdayClose = points[`${yesterday} 16:00:00`]['4. close']

  prices.reverse()

  return { yesterdayClose, prices }
}
