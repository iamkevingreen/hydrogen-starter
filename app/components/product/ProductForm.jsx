
export function ProductForm({
  variantId,
  selectedVariant,
}) {

  return  selectedVariant.availableForSale ?
      <div className='w-full h-[60px] col-span-6 flex items-center justify-center'>
        Add to Cart
      </div>
    : (
      <div className='w-full border-2'>
        Sold Out
      </div>
    )
}