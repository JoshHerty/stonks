import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Chart } from '~/components/chart'
import type { IntradayStockPrices } from '~/lib/stocks.server'
import { getIntradayStockPrices } from '~/lib/stocks.server'

export const loader: LoaderFunction = async ({ params }) => {
  const symbol = params.symbol!.toUpperCase()
  const prices = await getIntradayStockPrices(symbol)
  return json(prices)
}

export default function Stonks() {
  const data: IntradayStockPrices = useLoaderData()

  return (
    <>
      <Chart data={data} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}
