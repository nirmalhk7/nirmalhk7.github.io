import { Html, Head, Main, NextScript } from 'next/document';
import Navbar from "../components/navbar";
import Footer, { ScrollToTop } from "../components/footer";
import ContactForm from "../components/contactme";
import RandomQuote from "../components/quote";

import jquery from "jquery";
import { useRouter } from 'next/router';

export default function Document() {
    //  console.log(`
    // .d8888b.                           888    d8b                            888
    // d88P  Y88b                          888    Y8P                            888
    // 888    888                          888                                   888
    // 888        888d888 .d88b.   .d88b.  888888 888 88888b.   .d88b.  .d8888b  888
    // 888  88888 888P"  d8P  Y8b d8P  Y8b 888    888 888 "88b d88P"88b 88K      888
    // 888    888 888    88888888 88888888 888    888 888  888 888  888 "Y8888b. Y8P
    // Y88b  d88P 888    Y8b.     Y8b.     Y88b.  888 888  888 Y88b 888      X88  "
    //  "Y8888P88 888     "Y8888   "Y8888   "Y888 888 888  888  "Y88888  88888P' 888
    //                                                              888
    //                                                         Y8b d88P
    //                                                          "Y88P"

    // Find my resume here: https://nirmalhk7.tech/Resume.pdf`);
    return (
        <Html>
            <Head />
            <body>
                <Navbar location />

                <main><Main /></main>
                <RandomQuote />
                <ContactForm />
                <Footer />
                <ScrollToTop />
                <NextScript />
            </body>
        </Html>
    );
}