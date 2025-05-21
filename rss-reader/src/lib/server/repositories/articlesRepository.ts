import { db } from '../db';
import { articles } from '../db/schema';
import { eq, count } from 'drizzle-orm';
import type { Articles } from '../db/schema';


export type Article = {
  id?: number;
  rssId: number;
  title: string;
  link: string;
  publishedAt?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  author?: string | null;
};

export async function getAllArticles(): Promise<Articles[]> {
  return await db.select().from(articles);
}

export async function getArticlesPaginated(limit: number, offset: number): Promise<Articles[]> {
  return await db.select().from(articles).limit(limit).offset(offset);
}

export async function getArticleById(id: number): Promise<Articles | null> {
  const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return article || null;
}

export async function getArticleByLink(link: string): Promise<Articles | null> {
  const [article] = await db.select().from(articles).where(eq(articles.link, link)).limit(1);
  return article || null;
}

export async function createArticle(articleData: Article): Promise<number> {
  const result = await db.insert(articles).values(articleData);  
  return (result[0] as any).insertId;
}

export async function updateArticle(id: number, articleData: Partial<Article>): Promise<number> {
  const result = await db.update(articles).set(articleData).where(eq(articles.id, id));
  return (result[0] as any).affectedRows;
}

export async function deleteArticle(id: number): Promise<number> {
  const result = await db.delete(articles).where(eq(articles.id, id));
  return (result[0] as any).affectedRows;
}

export async function countArticles(): Promise<number> {
  const [{ count: total }] = await db.select({count: count() }).from(articles);
  return total;
}
