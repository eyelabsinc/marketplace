import { styled, keyframes } from '@stitches/react'
import * as Popover from '@radix-ui/react-popover'
import { FC, useState } from 'react'
import { FaShoppingCart, FaTrashAlt } from 'react-icons/fa'
import FormatEth from './FormatEth'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Execute } from '@reservoir0x/reservoir-kit-client'
import { Signer } from 'ethers'
import { setToast } from './token/setToast'
import { useAccount, useBalance, useSigner } from 'wagmi'
import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import cartTokensAtom, {
  getCartCount,
  getCartCurrency,
  getCartTotalPrice,
} from 'recoil/cart'
import FormatCrypto from 'components/FormatCrypto'

const slideDown = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideUp = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const StyledContent = styled(Popover.Content, {
  animationDuration: '0.6s',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  animationFillMode: 'forwards',
  '&[data-side="top"]': { animationName: slideUp },
  '&[data-side="bottom"]': { animationName: slideDown },
})

const SellMenu: FC = () => {

  const [_open, setOpen] = useState(false)
  
  
  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="relative z-10 grid h-8 w-8 items-center justify-center rounded-full">
          Sell
          {/* <FaShoppingCart className="h-[18px] w-[18px]" /> */}
        </div>
      </Popover.Trigger>
    </Popover.Root>
  )
}
export default SellMenu