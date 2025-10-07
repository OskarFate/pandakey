import { NextRequest, NextResponse } from "next/server";

// GET /api/keybin/products/[id] - Obtener producto específico de KeyBin
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const keybin_api_url = process.env.KEYBIN_API_URL;
    const keybin_api_key = process.env.KEYBIN_API_KEY;

    if (!keybin_api_url || !keybin_api_key) {
      return NextResponse.json(
        { error: "KeyBin API configuration missing" },
        { status: 500 }
      );
    }

    // Hacer request a KeyBin para producto específico
    const response = await fetch(`${keybin_api_url}/v1/products/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${keybin_api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

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

    const product = await response.json();

    // Obtener tasa de cambio EUR → CLP
    let clp_rate = 1000; // Fallback rate
    try {
      const fx_response = await fetch(process.env.FX_API_URL!);
      if (fx_response.ok) {
        const fx_data = await fx_response.json();
        clp_rate = fx_data.rates?.CLP || 1000;
      }
    } catch (fx_error) {
      console.warn("Exchange rate API failed, using fallback rate");
    }

    // Procesar producto con información completa
    const processedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      long_description: product.long_description,
      category: product.category,
      platform: product.platform,
      region: product.region,
      price_eur: product.price,
      price_clp: Math.round(product.price * clp_rate),
      currency_original: product.currency || "EUR",
      stock: product.stock || 0,
      images: product.images || [product.image],
      gallery: product.gallery || [],
      tags: product.tags || [],
      requirements: {
        minimum: product.requirements?.minimum || {},
        recommended: product.requirements?.recommended || {}
      },
      features: product.features || [],
      release_date: product.release_date,
      publisher: product.publisher,
      developer: product.developer,
      rating: product.rating,
      reviews: product.reviews || [],
      screenshots: product.screenshots || [],
      videos: product.videos || [],
      languages: product.languages || [],
      drm: product.drm,
      keybin_id: product.id,
      availability: {
        in_stock: (product.stock || 0) > 0,
        estimated_delivery: "Inmediata", // Para keys digitales
        auto_delivery: true
      }
    };

    return NextResponse.json({
      success: true,
      data: processedProduct,
      exchange_rate: {
        eur_to_clp: clp_rate,
        last_updated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Error fetching KeyBin product:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch product from KeyBin",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}