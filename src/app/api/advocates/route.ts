import db from "../../../db";
import { advocates } from "../../../db/schema";
import { and, ilike, or, count, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const pageSize = Math.min(
    Math.max(parseInt(searchParams.get("pageSize") || "20", 10), 1),
    100
  );

  const likePattern = `%${q}%`;

  const whereClause = q
    ? or(
        ilike(advocates.firstName, likePattern),
        ilike(advocates.lastName, likePattern),
        ilike(advocates.city, likePattern),
        ilike(advocates.degree, likePattern),
        sql`${advocates.specialties}::text ILIKE ${likePattern}`
      )
    : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(advocates)
    .where(whereClause as any);

  const data = await db
    .select()
    .from(advocates)
    .where(whereClause as any)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return Response.json({
    data,
    page,
    pageSize,
    total,
    totalPages: Math.max(Math.ceil((total as number) / pageSize), 1),
    query: q,
  });
}
