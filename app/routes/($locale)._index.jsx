import {defer} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, useLoaderData, useFetcher, Link} from '@remix-run/react';
import { AnalyticsPageType } from '@shopify/hydrogen';
import { flattenConnection } from '@shopify/hydrogen-react'

export async function loader({context}) {
  const collections = await context.storefront.query(COLLECTIONS_QUERY)
  const pages = await context.storefront.query(PAGES_QUERY)
  const products = await context.storefront.query(PRODUCT_QUERY)
  const articles = await context.storefront.query(ARTICLES_QUERY)

  // We're not covering accounts/auth in this class
  // const customerAccessToken = await context.session.get('customerAccessToken');
  // const customer = customerAccessToken ? 
  //   await getCustomer(context, customerAccessToken)
  //   : false

  return {
    collections,
    pages,
    articles,
    products
  }
}

const seo = ({data}) => ({
  title: 'Superhi Luggage Store',
  description: 'best place to internet',
});

export const handle = {
  seo
};

export default function Homepage() {

  const fetcher = useFetcher();
  const {collections, pages, products, articles} = useLoaderData()

  const pagesArray = flattenConnection(pages.pages)
  const productArray = flattenConnection(products.products)
  const collectionArray = flattenConnection(collections.collections)
  const articlesArray = flattenConnection(articles.articles)

  return (
    <div className='relative'>
      <>
        {/* Let's make sure to remove the 80px from the sticky top */}
        <div className='h-[calc(100vh-80px)] w-screen flex items-center justify-center'>
          <div>
            <h1 className='text-sans-64'>Welcome to Modular Commerce</h1>
            <div className='bg-black p-4 text-primary-green rounded-[6px] mt-2'>
              Products:
              {productArray.map(product => (
                <Link className='block underline' to={`/products/${product.handle}`} key={product.handle}>{product.title}</Link>
              ))}
            </div>
          </div>
        </div>
      </>
      <div className='bg-almost-black text-primary-green'>
        <div className='px-12 pt-12'>
          <h2 className='text-22'>Fetch Shopify routes (helpful for existing stores/testing):</h2>
        </div>
        <div className='relative p-12 grid grid-cols-12'>
          <div className='col-span-3'>
            <h2 className='text-mono-22'>Pages:</h2>
            {pagesArray.map(page => (
              <Link className='block underline' to={`/pages/${page.handle}`} key={page.handle}>{page.title}</Link>
            ))}
          </div>
          <div className='col-span-3'>
            <h2 className='text-mono-22'>Products:</h2>
            {productArray.map(product => (
              <Link className='block underline' to={`/products/${product.handle}`} key={product.handle}>{product.title}</Link>
            ))}
          </div>
          <div className='col-span-3'>
            <h2 className='text-mono-22'>Collections:</h2>
            {collectionArray.map(collection => (
              <Link className='block underline' to={`/collections/${collection.handle}`} key={collection.handle}>{collection.title}</Link>
            ))}
          </div>
          <div className='col-span-3'>
            <h2 className='text-mono-22'>Articles:</h2>
            {articlesArray.map(article => (
              <Link className='block underline' to={`/journal/${article.blog.handle}/${article.handle}`} key={article.handle}>{article.title}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

{/* 
  Some sample queries to get you started:
*/}

const COLLECTIONS_QUERY = `#graphql
  query collections {
    collections(first: 80) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query products {
    products(first: 200, reverse: true, query: "inventory_total:>200") {
      edges {
        node {
          handle
          title
        }
      }
    }
  }
`;

const PAGES_QUERY = `#graphql
  query pages {
    pages(first: 100) {
      edges {
        node {
          handle
          title
        }
      }
    }
  }
`;

const ARTICLES_QUERY = `#graphql
  query articles {
    articles(first: 100, reverse: true) {
      edges {
        node {
          handle
          title
          blog {
            id
            handle
          }
        }
      }
    }
  }
`