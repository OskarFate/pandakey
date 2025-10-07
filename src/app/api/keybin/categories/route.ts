import { NextRequest, NextResponse } from "next/server";

// GET /api/keybin/categories - Obtener categorías disponibles
export async function GET() {
  try {
    const keybin_api_url = process.env.KEYBIN_API_URL;
    const keybin_api_key = process.env.KEYBIN_API_KEY;

    if (!keybin_api_url || !keybin_api_key) {
      return NextResponse.json(
        { error: "KeyBin API configuration missing" },
        { status: 500 }
      );
    }

    // Hacer request a KeyBin para categorías
    const response = await fetch(`${keybin_api_url}/v1/categories`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${keybin_api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("KeyBin API error:", errorData);
      return NextResponse.json(
        { 
          error: "KeyBin API request failed",
          status: response.status,
          details: errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Procesar categorías
    const processedCategories = data.categories?.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      product_count: category.product_count || 0,
      subcategories: category.subcategories || []
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        categories: processedCategories,
        total: processedCategories.length
      }
    });

  } catch (error) {
    console.error("❌ Error fetching KeyBin categories:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch categories from KeyBin",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}