import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import alphaadvantage from 'alphavantage'

const alpha = alphaadvantage({ key: process.env.ALPHA_ADVANTAGE_API_KEY! })

export async function loader() {
  const data = await alpha.data.intraday('TSLA', 'full')
  return json(data)
}

export default function Stonks() {
  const stocks = useLoaderData()

  return <pre>{JSON.stringify(stocks, null, 2)}</pre>
}
