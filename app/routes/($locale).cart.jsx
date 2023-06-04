import {Link, useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';

import { CartLineItems, CartActions, CartSummary } from '~/components/Cart';
import { CART_QUERY } from '~/queries/cart';

import {
  CREATE_CART_MUTATION,
  CART_DISCOUNT_CODES_UPDATE,
  ADD_LINES_MUTATION,
  REMOVE_LINE_ITEMS_MUTATION,
  LINES_UPDATE_MUTATION,
  UPDATE_CART_BUYER_COUNTRY
} from '~/data/mutations'

export async function loader({context}) {
  const cartId = await context.session.get('cartId');

  const cart = cartId
    ? (
        await context.storefront.query(CART_QUERY, {
          variables: {
            cartId,
            country: context.storefront.i18n.country,
            language: context.storefront.i18n.language,
          },
          cache: context.storefront.CacheNone(),
        })
      ).cart
    : null;

  return {
    cart,
    analytics: {
      cartId
    }
  };
}

export async function action({request, context}) {
  const {session, storefront} = context;
  const headers = new Headers();
  const [formData, storedCartId, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('cartId'),
    session.get('customerAccessToken'),
  ]);

  let cartId = storedCartId;
  let status = 200;
  let result;
  // TODO form action
  const cartAction = formData.get('cartAction');
  const countryCode = formData.get('countryCode')
    ? formData.get('countryCode')
    : null;

  switch (cartAction) {
    case 'ADD_TO_CART':
      const lines = formData.get('lines')
        ? JSON.parse(String(formData.get('lines')))
        : [];

      if (!cartId) {
        result = await cartCreate({
          input: countryCode ? {lines, buyerIdentity: {countryCode}} : {lines},
          storefront,
        });
      } else {
        result = await cartAdd({
          cartId,
          lines,
          storefront,
        });
      }

      cartId = result.cart.id;
      break;
    case 'REMOVE_FROM_CART':
      const lineIds = formData.get('linesIds')
        ? JSON.parse(String(formData.get('linesIds')))
        : [];

      if (!lineIds.length) {
        throw new Error('No lines to remove');
      }

      result = await cartRemove({
        cartId,
        lineIds,
        storefront,
      });

      cartId = result.cart.id;
      break;
    default:
      throw new Error('Invalid cart action');
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  session.set('cartId', cartId);
  headers.set('Set-Cookie', await session.commit());

  const {cart, errors} = result;
  return json({cart, errors}, {status, headers});

}

export default function Cart() {
  const {cart} = useLoaderData();
  
  if (cart?.totalQuantity > 0)
    return (
      <div className="w-full max-w-6xl mx-auto pb-12 grid 800:grid-cols-2 800:items-start gap-8 800:gap-8 lg:gap-12">
        <div className="flex-grow 800:translate-y-4">
          <CartLineItems linesObj={cart.lines} />
        </div>
        <div className="fixed left-0 right-0 bottom-0 800:sticky 800:top-[65px] grid gap-6 p-4 800:px-6 800:translate-y-4 bg-gray-100 rounded-md w-full">
          <CartSummary cost={cart.cost} />
          <CartActions checkoutUrl={cart.checkoutUrl} />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col space-y-7 justify-center items-center 800:py-8 800:px-12 px-4 py-6 h-screen">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <Link
        to="/"
        className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
      >
        Continue shopping
      </Link>
    </div>
  );
}

export async function cartCreate({input, storefront}) {
  const {cartCreate} = await storefront.mutate(CREATE_CART_MUTATION, {
    variables: {input},
  });
  return cartCreate;
}

export async function cartAdd({cartId, lines, storefront}) {
  const {cartLinesAdd} = await storefront.mutate(ADD_LINES_MUTATION, {
    variables: {cartId, lines},
  });
  return cartLinesAdd;
}

export async function cartRemove({cartId, lineIds, storefront}) {
  const {cartLinesRemove} = await storefront.mutate(
    REMOVE_LINE_ITEMS_MUTATION,
    {
      variables: {
        cartId,
        lineIds,
      },
    },
  );
  if (!cartLinesRemove) {
    throw new Error('No data returned from remove lines mutation');
  }
  return cartLinesRemove;
}

export async function cartUpdate({cartId, lines, storefront}) {
  const {cartLinesUpdate} = await storefront.mutate(LINES_UPDATE_MUTATION, {
    variables: {cartId, lines},
  });

  invariant(
    cartLinesUpdate,
    'No data returned from update lines items mutation',
  );
  return cartLinesUpdate;
}

export async function cartUpdateBuyerIdentity({
  cartId,
  buyerIdentity,
  storefront,
}) {
  const {cartBuyerIdentityUpdate} = await storefront.mutate(
    UPDATE_CART_BUYER_COUNTRY,
    {
      variables: {
        cartId,
        buyerIdentity,
      },
    },
  );

  invariant(
    cartBuyerIdentityUpdate,
    'No data returned from cart buyer identity update mutation',
  );

  return cartBuyerIdentityUpdate;
}

export async function cartDiscountCodesUpdate({
  cartId,
  discountCodes,
  storefront,
}) {
  const {cartDiscountCodesUpdate} = await storefront.mutate(
    CART_DISCOUNT_CODES_UPDATE,
    {
      variables: {
        cartId,
        discountCodes,
      },
    },
  );

  invariant(
    cartDiscountCodesUpdate,
    'No data returned from the cartDiscountCodesUpdate mutation',
  );

  return cartDiscountCodesUpdate;
}
