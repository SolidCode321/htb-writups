import Link from 'next/link';
import { getAllWriteups } from '@/lib/markdown';

export default function Home() {
  const recentWriteups = getAllWriteups().slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <section style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 className="terminal-text" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          ALEX_SECURITY
        </h1>
        <p style={{ color: 'var(--secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          My personal collection of HackTheBox, PicoCTF, and security research writeups.
        </p>
      </section>

      <section>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="terminal-text">#</span> Recent Writeups
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {recentWriteups.length > 0 ? (
            recentWriteups.map((writeup) => (
              <Link key={writeup.slug} href={`/${writeup.category}/${writeup.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="terminal-text" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  {writeup.category}
                </span>
                <h3 style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>{writeup.title}</h3>
                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>
                  {new Date(writeup.date).toLocaleDateString()}
                </p>
              </Link>
            ))
          ) : (
            <p style={{ color: 'var(--secondary)' }}>No writeups found. Add some to the `content/` directory!</p>
          )}
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
        <p className="terminal-text" style={{ fontSize: '0.8rem' }}>
          &gt; system_status: operational
        </p>
      </div>
    </div>
  );
}
