import { useLoaderData } from '@remix-run/react'
import { json } from 'react-router'

import { Suspense } from 'react'

import {
  SHOPIFY_PRODUCT_QUERY
} from '~/data/fragments'

import {
  ProductForm
} from '~/components/product/ProductForm'


const seo = ({data}) => ({
  title: `${data?.product?.title} - Superhi Luggage Store`,
  description: 'best place to internet',
});

export const handle = {
  seo
};

export const loader = async ({ params, context, request }) => {
  const { handle } = params
  const searchParams = new URL(request.url).searchParams
  const selectedOptions = []

  searchParams.forEach((value, name) => {
    selectedOptions.push({ name, value })
  })

  const { product } = await context.storefront.query(SHOPIFY_PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions
    }
  })
  if (!product?.id) {
    throw new Response(null, { status: 404 })
  }

  const selectedVariant = product.selectedVariant ?? product?.variants?.nodes[0]

  return json({
    handle,
    product,
    selectedVariant,
    analytics: {
      pageType: 'product'
    }
  })
}

function PrintJson({data}) {
  return (
    <details className="outline outline-2 outline-blue-300 p-4 my-2">
      <summary>Product JSON</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  )
}

export default function ProductHandle() {
  const { handle, product, selectedVariant, analytics } = useLoaderData()

  // FIXME: Render the product schema
  const schema = JSON.stringify({
		'@context': 'https://schema.org/',
		'@type': 'Product',
		name: product.title,
		// image: product.images[0].url,
		description: product.hero,
		sku: product.sku,
		mpn: product.sku,
		brand: {
			'@type': 'Thing',
			name: 'Super Luggage',
		},
		offers: {
			'@type': 'Offer',
			url: `https://superluggage.co/products/${handle}`,
			priceCurrency: 'USD',
			// price: selectedVariant.price,
			itemCondition: 'https://schema.org/NewCondition',
			availability: 'https://schema.org/InStock',
			seller: {
				'@type': 'Organization',
				name: 'Super Luggage',
			},
		},
	});

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema}} />
      <div className='relative w-full'>
        <h2 className='absolute left-1/2 -translate-x-1/2 -top-[60px] text-mono-42'>{product.title}</h2>
        <div className='relative h-[calc(100vh-174px)]'>
          <div className='w-[calc(100%-40px)] flex justify-between absolute bottom-12 left-4'>
            <span>
              Info
            </span>
            <span>$PRICE</span>
          </div>
        </div>
        <div className='w-full border-t-2 grid-cols-9 font-600 uppercase items-center border-b-2 grid text-mono-20'>
          <div className='col-span-3 text-20 text-center'>
            Select COLOR
          </div>
          <ProductForm product={product} selectedVariant={selectedVariant} productAnalytics={analytics} variantId={selectedVariant?.id} />
        </div>
        
      </div>
      <div className='p-4'>
        <PrintJson data={product} />
      </div>
    </div>
  )
}

