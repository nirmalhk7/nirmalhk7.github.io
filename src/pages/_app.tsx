import "@/assets/css/main.scss";
import "@/assets/css/nirmalhk7.scss";

import "@/assets/css/index.scss";
import "@/assets/css/tailwind.css";
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}