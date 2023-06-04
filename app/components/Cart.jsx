import { Suspense } from 'react'
import {Link, useFetcher, Await} from '@remix-run/react';
import {flattenConnection, Image, Money} from '@shopify/hydrogen-react';

import { shallow } from 'zustand/shallow'
import useStore from '~/state/useStore'

export function CartSummary({cost}) {
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center">
            <span>Shipping estimate</span>
          </dt>
          <dd className="text-green-600">Free and carbon neutral</dd>
        </div>
      </dl>
    </>
  );
}

export function CartActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="flex flex-col mt-2">
      <a
        href={checkoutUrl}
        className="bg-black text-primary-green px-6 py-3 w-full text-20 font-600 uppercase text-center font-medium"
      >
        Continue to Checkout
      </a>
    </div>
  );
}

function ItemRemoveButton({lineIds}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/cart" method="POST">
      <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
      <input type="hidden" name="linesIds" value={JSON.stringify(lineIds)} />
      <button
        className="text-black underline text-mono-12"
        type="submit"
      >
        Remove
      </button>
    </fetcher.Form>
  );
}

export function CartHeader({cart, open}) {
  return (
    <Suspense>
      <Await resolve={cart}>
        {(data) => (
          <Link to='/cart' className="flex items-center">
            <div className="text-mono-42">
              {data?.totalQuantity}
            </div>
          </Link>
        )}
      </Await>
    </Suspense>
  );
}

export function CartDrawer({cart, close}) {
  return (
    <Suspense>
      <Await resolve={cart}>
        {(data) => (
          <>
            {data?.totalQuantity > 0 ? (
              <>
                <div className="flex-1 overflow-y-auto">
                  <div className="">
                    <CartLineItems linesObj={data.lines} />
                  </div>
                </div>
                <div className="w-full md:px-12 px-4 py-6 space-y-6 border border-1 border-gray-00">
                  <CartSummary cost={data.cost} />
                  <CartActions checkoutUrl={data.checkoutUrl} />
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
                <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
                  Your cart is empty
                </h2>
                <button
                  onClick={close}
                  className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </>
        )}
      </Await>
    </Suspense>
  );
}



export function CartLineItems({linesObj}) {
  const lines = flattenConnection(linesObj);
  return (
    <div className="">
      {lines.map((line) => {
        return <LineItem key={line.id} lineItem={line} />;
      })}
    </div>
  );
}

function LineItem({lineItem}) {
  const {merchandise, quantity} = lineItem;

  return (
    <div className="flex w-full p-4 border-b-2 border-solid justify-between gap-4">
      <Link
        to={`/products/${merchandise.product.handle}`}
        className="flex-shrink-0"
      >
        {merchandise.image && (<Image data={merchandise.image} width={110} height={110} />)}
      </Link>
      <div className="flex-1">
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="no-underline hover:underline"
        >
          {merchandise.product.title}
        </Link>
        <div className="text-gray-800 text-sm">{merchandise.title}</div>
        <div className="text-gray-800 text-sm">Qty: {quantity}</div>
        <ItemRemoveButton lineIds={[lineItem.id]} />
      </div>
      <Money data={lineItem.cost.totalAmount} />
    </div>
  );
}
