import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'wagmi'
import { providers } from 'ethers'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const provider = ({ chainId }: { chainId?: number }) =>
  new providers.InfuraProvider(chainId, infuraId)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider provider={provider} autoConnect>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp