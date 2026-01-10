import "./globals.css";

export const metadata = {
  title: "Yoto Weather Card Generator",
  description: "Create Yoto cards with weather information",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
