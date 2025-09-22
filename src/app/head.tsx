// app/head.tsx
export default function Head() {
    return (
        <>
            <link
                rel="apple-touch-startup-image"
                href="/pwa/apple-splash-2048-2732.png"
                media="(device-width: 1024px) and (device-height: 1366px)
         and (-webkit-device-pixel-ratio: 2)
         and (orientation: portrait)"
            />
            <link rel="icon" href="/pwa/favicon.ico" />
            <link rel="icon" type="image/png" sizes="16x16" href="/pwa/favicon-16x16.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/pwa/favicon-32x32.png" />
            <link rel="apple-touch-icon" href="/pwa/apple-touch-icon.png" />

        </>
    );
}
