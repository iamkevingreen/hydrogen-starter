/** @type {import('tailwindcss').Config} */
const reduce = require('lodash/reduce');

const generateValues = (max, factor = 1, unit = 'px') =>
	new Array(max)
		.fill()
		.map((_, i) => i)
		.reduce((acc, val) => {
			acc[val] = `${val * factor}${unit}`;
			return acc;
		}, {});


const FONT_SIZES = {
  // Sans
  'mono-82': ['82px', '90px'],
  'mono-64': ['64px', '64px'],
  'mono-50': ['50px', '52px'],
  'mono-52': ['52px', '52px'],
  'mono-42': ['42px', '46px'],
  'mono-36': ['36px', '36px'],
  'mono-32': ['32px', '35px'],
  'mono-26': ['26px', '26px'],
  'mono-24': ['24px', '26px'],
  'mono-22': ['22px', '26px'],
  'mono-20': ['20px', '20px'],
  'mono-18': ['18px', '22px'],
  'mono-16': ['16px', '19px'],
  'mono-14': ['14px', '17px'],
  'mono-12': ['12px', '15px'],
  'mono-10': ['10px', '13px'],
  'mono-8': ['8px', '16px'],
};

const LINE_HEIGHTS = reduce(
  FONT_SIZES,
  (lineHeights, value, key) => ({...lineHeights, [key]: value[1]}),
  {},
);

const theme = {
  container: {
    center: true,
    screens: {
      1440: '1440px',
    },
  },
  fontFamily: {
    mono: 'Martian Mono',
  },
  colors: {
    'white': '#fff',
    'black': `#000`,
    'almost-black': '#1A1A1A',
    'transparent': 'transparent',
    'current': 'currentColor',
    'primary-green': '#CBFF00',
  },
  screens: {
    400: '400px',
    500: '500px',
    600: '600px',
    800: '800px',
    900: '900px',
    1000: '1000px',
    1200: '1200px',
    1300: '1300px',
    1400: '1400px',
    1600: '1600px',
  },
  fontWeight: {
    100: 100,
    200: 200,
    300: 300,
    400: 400,
    500: 500,
    600: 600,
    700: 700,
    800: 800,
    900: 900,
  },
  fontSize: {
    ...FONT_SIZES,
    ...generateValues(400),
  },
  lineHeight: {
    ...LINE_HEIGHTS,
    ...generateValues(180),
    80: '80%',
  },
  boxShadow: {
    'button': '0px 0px 8px rgba(0, 0, 0, 0.14)'
  }
}

const safeList = [
  'w-[18px]', 
  'h-[18px',
  'col-span-1',
  'col-span-2',
  'col-span-3',
  'col-span-4',
  'col-span-5',
  'col-span-6',
  '800:col-span-2',
  '800:col-span-3',
  '800:col-span-4',
  '800:col-span-5',
  '800:col-span-6',
  '800:col-span-7',
  '800:col-span-8',
  '800:col-span-9',
  '800:col-span-10',
  '800:col-span-11',
  '800:col-span-12',
  '1000:col-span-2',
  '1000:col-span-3',
  '1000:col-span-4',
  '1000:col-span-5',
  '1000:col-span-6',
  '1000:col-span-7',
  '1000:col-span-8',
  '1000:col-span-9',
  '1000:col-span-10',
  '1000:col-span-11',
  '1000:col-span-12',
]

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme,
  safeList,
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}