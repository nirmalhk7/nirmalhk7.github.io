import "../assets/css/tailwind.css";
import "../assets/css/animation.css";

import "../assets/css/nirmalhk7.css";
import { useRouter } from 'next/router';


// import "../assets/css/base.css";
// import "../assets/css/main.scss";
// import "../assets/css/nirmalhk7.scss";
// import "../assets/css/vendor.scss";

// import "../assets/css/bootstrap-grid.css";
// import "../assets/scss/custom.scss";
// import "../assets/scss/index.scss";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

  const router = useRouter();
  return <Component {...pageProps} router={router} />;
}
