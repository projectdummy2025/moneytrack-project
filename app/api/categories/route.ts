import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { categories } from "@/db/schema";
import { DEV_USER_ID } from "@/lib/dummy-user";
import { eq } from "drizzle-orm";

// GET /api/categories - List all categories
export async function GET() {
  try {
    const allCategories = await db.select().from(categories)
      .where(eq(categories.userId, DEV_USER_ID))
      .orderBy(categories.categoryName);
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryName, classification, icon, color } = body;

    if (!categoryName || !classification) {
      return NextResponse.json(
        { error: "categoryName and classification are required" },
        { status: 400 }
      );
    }

    if (!["income", "expense"].includes(classification)) {
      return NextResponse.json(
        { error: "classification must be 'income' or 'expense'" },
        { status: 400 }
      );
    }

    const [newCategory] = await db.insert(categories).values({
      userId: DEV_USER_ID,
      categoryName,
      classification,
      icon,
      color,
    }).returning();

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
