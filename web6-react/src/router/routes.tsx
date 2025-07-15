import { createBrowserRouter, RouterProvider, type LoaderFunctionArgs } from 'react-router';
import Theme1 from '../pages/Theme1';
import Theme2 from '../pages/Theme2';
import App from '../App';

const bgColor: Record<PageKey, string> = {
  page1: 'red',
  page2: 'green',
  dashboard: 'purple',
  settings: 'darkblue',
  default: '#f0f0f0',
};

const bgColorLoader = async ({ request }: LoaderFunctionArgs) => {
  console.log('Common Loader Called for:', request.url);

  const url = new URL(request.url);
  const segment = url.pathname.split('/').filter((s) => s !== '');
  const currentPageName = segment[segment.length - 1] || 'default';

  let backgroundColor: string | undefined;

  const isPageKey = (key: string): key is PageKey => {
    return Object.keys(bgColor).includes(key);
  };

  if (isPageKey(currentPageName)) {
    backgroundColor = bgColor[currentPageName];
  }

  const colorValue = backgroundColor || bgColor['default'];

  return { backgroundColor: colorValue };
};

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: 'page1',
        Component: Theme1,
        loader: bgColorLoader,
      },
      {
        path: 'page2',
        Component: Theme2,
        loader: bgColorLoader,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
