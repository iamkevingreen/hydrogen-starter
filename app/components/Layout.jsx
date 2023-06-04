// 'use client'

import { useFetchers, useMatches } from '@remix-run/react'

import { shallow } from 'zustand/shallow'
import useStore from '~/state/useStore'

import { Footer } from '~/components/global/Footer'
import { Header } from '~/components/global/Header'

export function Layout({children, title}) {
  const fetchers = useFetchers()
  const [root] = useMatches()
  const cart = root.data?.cart

  const {isCartOpen, toggleCart} = useStore(
    store => ({
      isCartOpen: store.isCartOpen,
      toggleCart: store.toggleCart,
    }),
    shallow,
  )


  // Grab all the fetchers that are adding to cart
  const addToCartFetchers = [];
  for (const fetcher of fetchers) {
    if (fetcher?.submission?.formData?.get('cartAction') === 'ADD_TO_CART') {
      addToCartFetchers.push(fetcher);
    }
  }

  return (
    <div className="flex flex-col min-h-screen antialiased font-mono">
      <Header title={''} open={toggleCart} />
      <main
        role="main"
        id="mainContent"
        className="flex-grow"
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}


