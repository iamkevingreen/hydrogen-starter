import React, { useEffect, useRef, useState } from 'react'
import { useIntersection } from 'use-intersection'
import cx from 'classnames'

const shopifyImageUrl = (image, {maxWidth, maxHeight}) => {
  const splitUrl = (image || '').split('?')
  const notQuery = splitUrl[0]
  const query = splitUrl[1] ? `?${splitUrl[1]}` : ''

  // Use the section before the query
  const imageTokens = notQuery.split('.')

  // Take the token before the file extension and append the dimensions
  const imagePathIndex = imageTokens.length - 2

  imageTokens[
    imagePathIndex
  ] = `${imageTokens[imagePathIndex]}_${maxWidth}x${maxHeight}.progressive`

  return `${imageTokens.join('.')}${query}`
}

export const ShopifyPhoto = ({
  url,
  altText,
  wrapperClass = 'relative',
  forceLoad = false,
  layout = 'intrinsic',
  lazyLoad = false,
  className, 
  onLoad = () => null,
  width = 600, 
  height = 750, 
  maxWidth = 1200, 
  maxHeight = 1500,
  ...props}) => {

    const imageRef = useRef()
    const [isLoaded, setIsLoaded] = useState(forceLoad)

    const isIntersecting = useIntersection(imageRef, {
      once: true,
      threshold: 0.3,
    })

    // const isIntersecting = true

    // handle our image onLoad
    function handleLoad() {
      requestAnimationFrame(() => {
        setIsLoaded(true)
      })
    }
    // trigger any onLoad callbacks
    useEffect(() => {
      if (isLoaded && onLoad) onLoad()
    }, [isLoaded])

    if (/svg/.test(url)) {
      return (
        <img src={url} alt='svg' />
      )
    }
  

    return (
      <div 
        className={cx(wrapperClass)}>
        <picture>
          <source
            srcSet={isIntersecting ? shopifyImageUrl(url, {
              maxWidth: maxWidth,
              maxHeight: maxHeight,
            }): undefined}
            media="(min-width: 1000px)"
          />
          <source
            srcSet={isIntersecting ? shopifyImageUrl(url, {
              maxWidth: parseInt(maxWidth / 0.7).toFixed(0),
              maxHeight: parseInt(maxHeight / 0.7).toFixed(0),
            }) : undefined}
            media="(min-width: 800px)"
          />
          <img
            alt={altText}
            ref={imageRef}
            decoding='async'
            // loading="lazy"
            className={cx('duration-300', className,
              'pointer-events-none', {
                'opacity-0': !isLoaded && !isIntersecting,
                'opacity-100': isLoaded && isIntersecting
              }
            )}
            {...props}
            onLoad={handleLoad}
            data-zoom={shopifyImageUrl(url, {
              maxWidth: 1000,
              maxHeight: 1000
            })}
            src={isLoaded || forceLoad ? shopifyImageUrl(url, {
              maxWidth: maxWidth,
              maxHeight: maxHeight,
            }) : shopifyImageUrl(url, {
              maxWidth: 500,
              maxHeight: 500,
            })}
          />
        </picture>
        {lazyLoad && (
          <div className={cx(
            // wrapperClass,
            'absolute z-20 top-0 w-full h-full transition-opacity duration-300', 
            isLoaded && isIntersecting && 'opacity-0'
          )}>
            <img className={cx('', className, 'w-full')} src={shopifyImageUrl(url, {
              maxWidth: 100,
              maxHeight: 100,
            })} alt='loading asset' />
          </div>
        )}
      </div>
    )
}