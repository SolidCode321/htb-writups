import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export type Writeup = {
  slug: string;
  category: string;
  title: string;
  date: string;
  content: string;
  description?: string;
};

export function getCategories() {
  if (!fs.existsSync(contentDirectory)) return [];
  return fs.readdirSync(contentDirectory).filter((file) => 
    fs.statSync(path.join(contentDirectory, file)).isDirectory()
  );
}

export function getWriteupsByCategory(category: string): Writeup[] {
  const categoryPath = path.join(contentDirectory, category);
  if (!fs.existsSync(categoryPath)) return [];

  const files = fs.readdirSync(categoryPath);
  
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const fullPath = path.join(categoryPath, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug: file.replace(/\.md$/, ''),
        category,
        title: data.title || file.replace(/\.md$/, ''),
        date: data.date || '2024-01-01',
        description: data.description || '',
        content,
      };
    })
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function getAllWriteups(): Writeup[] {
  const categories = getCategories();
  let allWriteups: Writeup[] = [];

  categories.forEach((category) => {
    allWriteups = allWriteups.concat(getWriteupsByCategory(category));
  });

  return allWriteups.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function getWriteup(category: string, slug: string): Writeup | null {
  const fullPath = path.join(contentDirectory, category, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    category,
    title: data.title || slug,
    date: data.date || '2024-01-01',
    description: data.description || '',
    content,
  };
}
