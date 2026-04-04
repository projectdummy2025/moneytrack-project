import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { categories } from "@/db/schema";
import { getSessionUserId } from "@core/utils/UserSession";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const allCategories = await db.select().from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(categories.categoryName);
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { categoryName, classification, icon, color } = body;

    if (!categoryName || !classification) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [newCategory] = await db.insert(categories).values({
      userId,
      categoryName,
      classification,
      icon,
      color,
    }).returning();

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
