import { Link } from '@remix-run/react'
import { Disclosure } from '@headlessui/react'

import {
  Twitter,
  Facebook,
  Pinterest,
  Instagram
} from '~/components/Icon'

const Social = () => {
  return (
    <div className='flex justify-end 800:justify-start'>
      <div className='ml-5 800:ml-0'>
        <Twitter className='' />
      </div>
      <div className='ml-5'>
        <Facebook className='' />
      </div>
      <div className='ml-5'>
        <Pinterest className='' />
      </div>
      <div className='ml-5'>
        <Instagram className='' />
      </div>
    </div>
  )
}

const MobileMenu = ({ menus }) => {
  return (
    <div className='border-b border-solid border-white mb-8'>
      {menus?.map((menu, i) => {
        return (
          <Disclosure defaultOpen={i === 0} key={menu.name}>
          {({ open }) => (
            <>
              <Disclosure.Button className="text-left py-4 border-t w-full border-solid border-black">
                <h5 className='text-sans-16 font-600 uppercase font-sans'>{menu.title}</h5>
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500 mb-4">
                {menu.items?.map(item => {
                  if (item.href)  {
                      return (
                        <a href={item.href} className='block text-body-16 py-1' key={item.name}>{item.title}</a>
                      )
                    }
                  return (
                    <Link className='block text-body-16 py-1 font-body' key={item.name} to={item.route}>{item.title}</Link>
                  )
                })}
              </Disclosure.Panel>
            </>
          )}
          </Disclosure>
        )
      })}
    </div>
  )
}

export function Footer() {
  const date = new Date
  return (
    <>
      <footer className='p-5 py-8 800:p-[62px] 1200:px-[100px] bg-primary-green text-black'>
        <div className=''>
          <div className='800:grid 800:grid-cols-12 800:gap-5'>
            <div className='800:hidden'>
              <MobileMenu menus={menus} />
            </div>
            <div className='hidden 800:col-span-9 1200:col-span-9 800:flex'>
              {menus?.map(menu => (
                <div className='hidden 800:block col-span-6 800:w-full' key={menu.name}>
                  <h5 className='uppercase font-600 font-sans text-sans-15 mb-5'>{menu.title}</h5>
                  {menu.items?.map(item => {
                    if (item.href)  {
                      return (
                        <a href={item.href} className='block pb-1' key={item.name}>{item.title}</a>
                      )
                    }
                    return (
                      <Link className='block pb-1' key={item.name} to={item.route}>{item.title}</Link>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className='800:col-span-6 1000:col-span-3 1200:col-span-3'>
              <div className='hidden 800:block'>
                <h5 className='uppercase font-600 font-sans mb-5 text-sans-16'>Contact Us</h5>
                <p><a className='py-1 block' href='tel:4106938857'>410.693.8857</a></p>
                <p><a className='py-1 block' href='mailto:ride@jetskis.biz'>ride@jetskis.biz</a></p>
              </div>
              <div className='w-full 800:mt-6'>
                <Social />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className='bg-black text-primary-green p-5 text-center text-primary-grey'>
        <span className='block text-body-10 uppercase font-body'>&copy; {date.getFullYear()} Luggage Bois.</span>
      </div>
    </>
  )
}

const menus = [

  {
    name: 'about',
    title: 'About',
    items: [
      { name: 'learn', href: 'https://ctrlaltdel.notion.site/Building-Modular-E-Commerce-378617a0af4648d7a95adbe44536a229?pvs=4', title: 'Learn' },
    ]
  },
  {
    name: 'help',
    title: 'Help',
    items: [
      { name: 'faqs', route: '/faqs', title: 'FAQs' },
      { name: 'shipping', route: '/shipping', title: 'Shipping' },
      { name: 'privacy', route: '/privacy', title: 'Privacy Policy' },
      { name: 'terms', route: '/terms', title: 'Terms of Service' },
    ]
  }
]