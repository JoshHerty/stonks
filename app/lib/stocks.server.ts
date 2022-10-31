import alphaadvantage from 'alphavantage'

const alpha = alphaadvantage({ key: process.env.ALPHA_ADVANTAGE_API_KEY! })

const CLOSE_KEY = '4. close'

export interface StockPrice {
  date: string
  value: number
}

export interface IntradayStockPrices {
  yesterdayClose: number
  prices: StockPrice[]
}

export async function getIntradayStockPrices(
  symbol: string,
): Promise<IntradayStockPrices> {
  const data = await alpha.data.intraday(symbol, 'full')
  const points = data['Time Series (1min)']

  let today: string | null = null
  let yesterday: string | null = null
  const prices: StockPrice[] = []
  for (const date of Object.keys(points)) {
    if (today == null) today = extractDay(date)

    if (!date.startsWith(today)) {
      yesterday = extractDay(date)
      break
    }

    const value = +points[date][CLOSE_KEY]
    prices.push({ date, value })
  }

  // alpha returns prices from newest to oldest, but we want to return them from
  // oldest to newest
  prices.reverse()
  const yesterdayClose = +points[closingTime(yesterday!)][CLOSE_KEY]

  return { yesterdayClose, prices }
}

const extractDay = (date: string) => date.split(' ')[0]
const closingTime = (day: string) => `${day} 16:00:00`
