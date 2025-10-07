import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TokenModel from "@/models/MLCToken";

// POST /api/sync/keybin-to-ml - Sincronizar producto de KeyBin a MercadoLibre
export async function POST(req: NextRequest) {
  try {
    const { keybin_product_id, ml_listing_config } = await req.json();

    if (!keybin_product_id) {
      return NextResponse.json(
        { error: "keybin_product_id is required" },
        { status: 400 }
      );
    }

    // 1. Obtener token de MercadoLibre válido
    await connectDB();
    const mlToken = await TokenModel.findOne({ type: "mlc" });
    
    if (!mlToken || mlToken.isExpired()) {
      return NextResponse.json(
        { error: "MercadoLibre authorization required or expired" },
        { status: 401 }
      );
    }

    // 2. Obtener producto de KeyBin
    const keybin_api_url = process.env.KEYBIN_API_URL;
    const keybin_api_key = process.env.KEYBIN_API_KEY;

    const keybinResponse = await fetch(`${keybin_api_url}/v1/products/${keybin_product_id}`, {
      headers: {
        "Authorization": `Bearer ${keybin_api_key}`,
        "Accept": "application/json",
      },
    });

    if (!keybinResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch product from KeyBin" },
        { status: 404 }
      );
    }

    const keybinProduct = await keybinResponse.json();

    // 3. Obtener tasa de cambio
    let clp_rate = 1000;
    try {
      const fx_response = await fetch(process.env.FX_API_URL!);
      if (fx_response.ok) {
        const fx_data = await fx_response.json();
        clp_rate = fx_data.rates?.CLP || 1000;
      }
    } catch (fx_error) {
      console.warn("Using fallback exchange rate");
    }

    // 4. Preparar listing de MercadoLibre
    const listing = {
      title: ml_listing_config?.title || `${keybinProduct.name} - Key Digital`,
      category_id: ml_listing_config?.category_id || "MLC1144", // Videojuegos
      price: ml_listing_config?.price || Math.round(keybinProduct.price * clp_rate * 1.3), // +30% margen
      currency_id: "CLP",
      available_quantity: Math.min(keybinProduct.stock || 0, ml_listing_config?.max_quantity || 10),
      buying_mode: "buy_it_now",
      listing_type_id: "gold_special",
      condition: "new",
      description: {
        plain_text: ml_listing_config?.description || `
🎮 ${keybinProduct.name}

✅ Key digital original
✅ Entrega inmediata automática
✅ Garantía 100%
✅ Soporte técnico

📋 Detalles:
• Plataforma: ${keybinProduct.platform}
• Región: ${keybinProduct.region || "Global"}
• Editor: ${keybinProduct.publisher || "N/A"}
• Desarrollador: ${keybinProduct.developer || "N/A"}

${keybinProduct.description || ""}

⚠️ IMPORTANTE: Este es un producto digital. Recibirás la key por mensaje privado inmediatamente después de la compra.
        `.trim()
      },
      pictures: keybinProduct.images?.slice(0, 10).map((img: string) => ({ source: img })) || [
        { source: keybinProduct.image || "https://via.placeholder.com/500x300?text=Game+Key" }
      ],
      attributes: [
        {
          id: "GTIN",
          value_name: "Sin código"
        },
        {
          id: "BRAND",
          value_name: keybinProduct.publisher || "Varios"
        },
        {
          id: "MODEL",
          value_name: keybinProduct.platform || "PC"
        }
      ],
      tags: ["immediate_payment", "good_quality_picture", "good_quality_thumbnail"],
      shipping: {
        mode: "not_specified",
        free_shipping: true
      }
    };

    // 5. Crear listing en MercadoLibre
    const mlResponse = await fetch("https://api.mercadolibre.com/items", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${mlToken.access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(listing)
    });

    const mlResult = await mlResponse.json();

    if (!mlResponse.ok) {
      console.error("MercadoLibre listing creation failed:", mlResult);
      return NextResponse.json(
        { 
          error: "Failed to create MercadoLibre listing",
          details: mlResult
        },
        { status: mlResponse.status }
      );
    }

    // 6. Respuesta exitosa
    return NextResponse.json({
      success: true,
      message: "Product synchronized successfully",
      data: {
        keybin_product: {
          id: keybinProduct.id,
          name: keybinProduct.name,
          price_eur: keybinProduct.price,
          price_clp: Math.round(keybinProduct.price * clp_rate)
        },
        mercadolibre_listing: {
          id: mlResult.id,
          title: mlResult.title,
          price: mlResult.price,
          permalink: mlResult.permalink,
          status: mlResult.status
        },
        exchange_rate: clp_rate,
        margin_applied: "30%"
      }
    });

  } catch (error) {
    console.error("❌ Error syncing product:", error);
    return NextResponse.json(
      { 
        error: "Synchronization failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// GET /api/sync/keybin-to-ml - Obtener productos sincronizables
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    // Obtener productos de KeyBin con stock disponible
    const keybin_api_url = process.env.KEYBIN_API_URL;
    const keybin_api_key = process.env.KEYBIN_API_KEY;

    const apiUrl = new URL(`${keybin_api_url}/v1/products`);
    apiUrl.searchParams.set("page", page);
    apiUrl.searchParams.set("limit", limit);
    apiUrl.searchParams.set("min_stock", "1"); // Solo productos con stock

    const response = await fetch(apiUrl.toString(), {
      headers: {
        "Authorization": `Bearer ${keybin_api_key}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch KeyBin products" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Obtener tasa de cambio
    let clp_rate = 1000;
    try {
      const fx_response = await fetch(process.env.FX_API_URL!);
      if (fx_response.ok) {
        const fx_data = await fx_response.json();
        clp_rate = fx_data.rates?.CLP || 1000;
      }
    } catch (fx_error) {
      console.warn("Using fallback exchange rate");
    }

    // Procesar productos para sincronización
    const syncableProducts = data.products?.map((product: any) => ({
      keybin_id: product.id,
      name: product.name,
      platform: product.platform,
      region: product.region,
      stock: product.stock,
      price_eur: product.price,
      price_clp_base: Math.round(product.price * clp_rate),
      price_clp_suggested: Math.round(product.price * clp_rate * 1.3), // +30% margen
      category: product.category,
      image: product.image,
      can_sync: (product.stock || 0) > 0
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        products: syncableProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: data.total || 0
        },
        exchange_rate: clp_rate,
        suggested_margin: "30%"
      }
    });

  } catch (error) {
    console.error("❌ Error fetching syncable products:", error);
    return NextResponse.json(
      { error: "Failed to fetch syncable products" },
      { status: 500 }
    );
  }
}