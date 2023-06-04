import { create } from 'zustand'

export const getInitialState = (set, get) => {
  isCartOpen: false
}

export const toggleCart = (set, get) => async () => {
  const {isCartOpen} = get(s => s.isCartOpen)
  set({isCartOpen: !isCartOpen})
}

export default create((...args) => ({
  // State
  ...getInitialState(...args),

  // Actions
  toggleCart: toggleCart(...args),
}))
