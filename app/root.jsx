import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useLocation,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
} from '@remix-run/react';

import { ExternalScripts } from 'remix-utils'

import {defer} from '@shopify/remix-oxygen';
import {CART_QUERY} from '~/queries/cart';

import { Seo } from '@shopify/hydrogen'
import { ShopifyProvider } from '@shopify/hydrogen-react'

// import { useAnalyticsFromLoaders, useAnalyticsFromActions } from './utils'

import styles from './styles/app.css';
import favicon from '../public/favicon.svg';

import {Layout} from 'app/components/Layout'

const shopifyConfig = {
  storefrontToken: 'fa69d4a1acea5b210dcfff76ac4fa6d9',
  storeDomain: `https://superhi-bagel.myshopify.com`,
  storefrontApiVersion: '2023-04',
  countryIsoCode: 'US',
  languageIsoCode: 'en',
};

async function getCart({storefront}, cartId) {
  if (!storefront) {
    throw new Error('missing storefront client in cart query');
  }
  const {cart} = await storefront.query(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });
  return cart;
}

export const links = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export const meta = () => {
  return [
    { charset: 'utf-8' },
    { property: 'viewport', content: 'width=device-width,initial-scale=1' },
    { name: 'title', content: 'Hydrogen Demo Store' },
  ]
};



export async function loader({context}) {
  const cartId = await context.session.get('cartId');
  const cartOpen = await context.session.get('cartOpen');
  return defer({
    cart: cartId ? getCart(context, cartId) : undefined,
    cartOpen: cartOpen || false,
    layout: await context.storefront.query(LAYOUT_QUERY),
  });
}

export default function App() {
  const data = useLoaderData();
  const location = useLocation()
  const {name} = data.layout.shop;

  return (
    <ShopifyProvider {...shopifyConfig}>
      <html lang="en">
        <head>
          <Seo />
          <Meta />
          <Links />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Martian+Mono:wght@300&display=swap" rel="stylesheet"></link>
        </head>
        <body>
          <Layout title={name}>
            <Outlet />
          </Layout>
          <ScrollRestoration />
          <ExternalScripts />
          <Scripts />
        </body>
      </html>
    </ShopifyProvider>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
    }
  }
`;


