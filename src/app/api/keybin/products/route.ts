import { NextRequest, NextResponse } from "next/server";

// GET /api/keybin/products - Obtener productos de KeyBin
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const keybin_api_url = process.env.KEYBIN_API_URL;
    const keybin_api_key = process.env.KEYBIN_API_KEY;

    if (!keybin_api_url || !keybin_api_key) {
      return NextResponse.json(
        { error: "KeyBin API configuration missing" },
        { status: 500 }
      );
    }

    // Construir URL de KeyBin API
    const apiUrl = new URL(`${keybin_api_url}/v1/products`);
    apiUrl.searchParams.set("page", page);
    apiUrl.searchParams.set("limit", limit);
    
    if (search) {
      apiUrl.searchParams.set("search", search);
    }
    
    if (category) {
      apiUrl.searchParams.set("category", category);
    }

    // Hacer request a KeyBin
    const response = await fetch(apiUrl.toString(), {
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

    // Obtener tasa de cambio EUR → CLP si es necesario
    let clp_rate = 1;
    try {
      const fx_response = await fetch(process.env.FX_API_URL!);
      if (fx_response.ok) {
        const fx_data = await fx_response.json();
        clp_rate = fx_data.rates?.CLP || 1000; // Fallback ~1000 CLP por EUR
      }
    } catch (fx_error) {
      console.warn("Exchange rate API failed, using fallback rate");
      clp_rate = 1000; // Fallback rate
    }

    // Procesar productos y convertir precios
    const processedProducts = data.products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      platform: product.platform,
      region: product.region,
      price_eur: product.price,
      price_clp: Math.round(product.price * clp_rate),
      currency_original: product.currency || "EUR",
      stock: product.stock || 0,
      image: product.image,
      tags: product.tags || [],
      requirements: product.requirements,
      features: product.features,
      release_date: product.release_date,
      publisher: product.publisher,
      developer: product.developer,
      rating: product.rating,
      keybin_id: product.id
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        products: processedProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: data.total || 0,
          pages: Math.ceil((data.total || 0) / parseInt(limit))
        },
        exchange_rate: {
          eur_to_clp: clp_rate,
          last_updated: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error("❌ Error fetching KeyBin products:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch products from KeyBin",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}