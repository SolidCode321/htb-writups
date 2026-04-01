import Link from 'next/link';
import { getWriteupsByCategory, getCategories } from '@/lib/markdown';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    category,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const writeups = getWriteupsByCategory(category);

  if (writeups.length === 0) return notFound();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 className="terminal-text" style={{ fontSize: '2.5rem' }}>
        {category.toUpperCase()}
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {writeups.map((w) => (
          <Link key={w.slug} href={`/${category}/${w.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ marginBottom: '1rem' }}>{w.title}</h3>
            <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>
              {new Date(w.date).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
