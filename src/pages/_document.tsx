import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head />
            <body>
                <script dangerouslySetInnerHTML={{
                    __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
                }} />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
