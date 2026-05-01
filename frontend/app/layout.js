import "./globals.css";

export const metadata = {
  title: "AI Decision Simulator — Predict Your Future",
  description:
    "Simulate life and business decisions with AI-powered analysis. Get predicted outcomes, risk assessments, timelines, and alternative scenarios powered by advanced graph-based reasoning.",
  keywords: ["AI", "decision simulator", "decision making", "AI analysis", "life decisions", "business strategy"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
