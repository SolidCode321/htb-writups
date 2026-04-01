import Link from 'next/link';
import { getCategories } from '@/lib/markdown';

export default function Navbar() {
  const categories = getCategories();

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <Link href="/" className="terminal-text" style={{ fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
          ALEX_SEC {'>'}_
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/" className="nav-link">HOME</Link>
          {categories.map((category) => (
            <Link 
              key={category} 
              href={`/${category}`} 
              className="nav-link"
              style={{ textTransform: 'uppercase' }}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
