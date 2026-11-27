import Script from "next/script";

const GTM_ID = "GTM-N6TM5QSW";

export default function GoogleAnalytics() {
  return (
    <>
      <script
        id="google-analytics-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />
      <Script
        id="google-tag-manager"
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
