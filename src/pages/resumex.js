/* eslint-disable no-undef */
import { renderToStaticMarkup } from 'react-dom/server';
import pdf from 'html-pdf';
import Resume from './resume';

const componentToPDFBuffer = (component) => {
    return new Promise((resolve, reject) => {
        const html = renderToStaticMarkup(component);

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
            footer: {
                height: '10mm',
            },
            type: 'pdf',
            timeout: 30000,
        };

        const buffer = pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                return reject(err);
            }

            return resolve(buffer);
        });
    });
};

export const getServerSideProps = async ({ req, res, query }) => {
    const isServer = !!req;
    if (isServer) {
        const content = <html lang="en"><body><Resume /></body></html>;
        const buffer = await componentToPDFBuffer(
            content
        );

        // prompt to download pdf
        res.setHeader('Content-disposition', 'attachment; filename="article.pdf');

        // set content type
        res.setHeader('Content-Type', 'application/pdf');

        // output the pdf buffer
        res.end(buffer);
    }

    return {};
};
export default function Home() {
    return (<>some stuffs</>);
}