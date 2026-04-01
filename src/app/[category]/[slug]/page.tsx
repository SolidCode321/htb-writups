import Link from 'next/link';
import { getWriteup, getAllWriteups, getCategories, getWriteupsByCategory } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export async function generateStaticParams() {
  const writeups = getAllWriteups();
  return writeups.map((writeup) => ({
    category: writeup.category,
    slug: writeup.slug,
  }));
}

export default async function WriteupPage({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const writeup = getWriteup(category, slug);

  if (!writeup) return notFound();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
        <div className="terminal-text" style={{ fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          {writeup.category}
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{writeup.title}</h1>
        <div style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>
          Published: {new Date(writeup.date).toLocaleDateString()}
        </div>
      </header>

      <div className="prose">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeHighlight]}
        >
          {writeup.content}
        </ReactMarkdown>
      </div>

      <footer style={{ marginTop: '5rem', padding: '2rem 0', borderTop: '1px solid var(--border)', opacity: 0.5 }}>
        <p className="terminal-text" style={{ fontSize: '0.8rem' }}>
          &gt; end_of_writeup
        </p>
      </footer>
    </div>
  );
}
