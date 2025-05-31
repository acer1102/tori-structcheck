// pages/index.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1>Welcome to Tori StructCheck</h1>
      <p>
        👉 <Link href="/upload">Go to Upload Page</Link>
      </p>
    </div>
  );
}
