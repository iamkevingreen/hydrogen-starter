import { useMatches } from '@remix-run/react'

import {  CartHeader } from '~/components/Cart'

export function Header({ title, open }) {
  const [root] = useMatches()
  const cart = root.data?.cart

  return (
    <>
      <div className='w-full bg-primary-green text-black text-center p-2'>
        <span>Promo Bar</span>
      </div>
      <header
        role="banner"
        className={`flex items-center h-[80px] p-4 sticky z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-sm`}
      >
        <div className="flex gap-12 w-full justify-between items-center">
          <a className="font-600 800:text-42" href="/">
            /
          </a>
          <CartHeader cart={cart} open={open} />
        </div>
      </header>
    </>
  )
}