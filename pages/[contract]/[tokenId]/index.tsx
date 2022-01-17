import Layout from 'components/Layout'
import { paths } from 'interfaces/apiTypes'
import fetcher from 'lib/fetcher'
import { optimizeImage } from 'lib/optmizeImage'
import setParams from 'lib/params'
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { useRouter } from 'next/router'
import EthAccount from 'components/EthAccount'
import useSWR from 'swr'
import { FC, useEffect, useState } from 'react'
import { formatBN } from 'lib/numbers'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Index: NextPage<Props> = ({ fallback }) => {
  const router = useRouter()

  let url = new URL('/tokens/details', API_BASE)

  let query: paths['/tokens/details']['get']['parameters']['query'] = {
    contract: router.query?.contract?.toString(),
    tokenId: router.query?.tokenId?.toString(),
  }

  setParams(url, query)

  const { data, error } = useSWR<
    paths['/tokens/details']['get']['responses']['200']['schema']
  >(url.href, fetcher, {
    fallbackData: fallback.token,
  })

  if (error) {
    return <div>There was an error</div>
  }

  const token = data?.tokens?.[0]

  // Fetch ENS data for the token owner
  //   const [ens, setEns] = useState<{
  //     avatar: string | null | undefined
  //     name: string | null | undefined
  //   }>()

  //   useEffect(() => {
  //     async function getEns() {
  //       setEns(await fetchEns(token?.token?.owner))
  //     }
  //     getEns()
  //   }, [])

  return (
    <Layout>
      <div className="grid gap-10 grid-cols-2 mt-8">
        <img
          className="w-[500px]"
          src={optimizeImage(token?.token?.image, {
            sm: 500,
            md: 500,
            lg: 500,
            xl: 500,
            '2xl': 500,
          })}
        />
        <div>
          <div className="text-lg mb-4">{token?.token?.collection?.name}</div>
          <div className="text-xl font-bold mb-3">{token?.token?.name}</div>
          <div className="mb-6">
            {token?.token?.owner && <EthAccount address={token.token.owner} />}
          </div>
          <div className="bg-white rounded-md shadow-md p-5">
            <div className="grid gap-8 grid-cols-2 ">
              <Price
                title="list price"
                price={formatBN(token?.market?.floorSell?.value, 2)}
              >
                <button className="btn-blue-fill justify-center">
                  Buy Now
                </button>
              </Price>
              <Price
                title="top offer"
                price={formatBN(token?.market?.topBuy?.value, 2)}
              >
                <button className="btn-blue-fill justify-center">
                  Make Offer
                </button>
              </Price>
            </div>
            <button className="col-span-2 mx-auto btn-red-ghost mt-8">
              Cancel your offer
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Index

const Price: FC<{ title: string; price: string }> = ({
  title,
  price,
  children,
}) => (
  <div className="grid space-y-5">
    <div className="uppercase font-medium opacity-75 text-center">{title}</div>
    <div className="text-2xl font-bold text-center">{price}</div>
    {children}
  </div>
)

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{
  fallback: {
    token: paths['/tokens/details']['get']['responses']['200']['schema']
  }
}> = async ({ params }) => {
  try {
    if (!API_BASE) {
      throw 'Environment variable NEXT_PUBLIC_API_BASE is undefined.'
    }

    let url = new URL('/tokens', API_BASE)

    let query: paths['/tokens/details']['get']['parameters']['query'] = {
      contract: params?.contract?.toString(),
      tokenId: params?.tokenId?.toString(),
    }

    setParams(url, query)

    const res = await fetch(url.href)
    const token: Props['fallback']['token'] = await res.json()

    return {
      props: {
        fallback: {
          token,
        },
      },
    }
  } catch (error) {
    console.error(error)
    return {
      notFound: true,
    }
  }
}