import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TokenModel from "@/models/MLCToken";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Manejar errores de autorización
    if (error) {
      return NextResponse.json(
        { 
          error: "Authorization failed", 
          details: error,
          description: searchParams.get("error_description") || "Unknown error"
        }, 
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" }, 
        { status: 400 }
      );
    }

    // Verificar variables de entorno
    const client_id = process.env.MLC_CLIENT_ID;
    const client_secret = process.env.MLC_CLIENT_SECRET;
    const redirect_uri = process.env.MLC_REDIRECT_URI;

    if (!client_id || !client_secret || !redirect_uri) {
      console.error("Missing MercadoLibre environment variables");
      return NextResponse.json(
        { error: "Server configuration error" }, 
        { status: 500 }
      );
    }

    // Intercambiar code por token
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id,
      client_secret,
      code,
      redirect_uri,
    });

    const tokenRes = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: body.toString(),
    });

    const tokenData = await tokenRes.json();
    
    if (!tokenRes.ok) {
      console.error("MercadoLibre token exchange failed:", tokenData);
      return NextResponse.json(
        { 
          error: "Token exchange failed", 
          details: tokenData 
        }, 
        { status: tokenRes.status }
      );
    }

    // Extraer datos del token
    const { 
      access_token, 
      refresh_token, 
      expires_in, 
      token_type = "Bearer",
      scope,
      user_id 
    } = tokenData;

    // Conectar a MongoDB
    await connectDB();

    // Calcular fecha de expiración
    const expires_at = new Date(Date.now() + expires_in * 1000);

    // Guardar o actualizar tokens en base de datos
    const savedToken = await TokenModel.findOneAndUpdate(
      { type: "mlc" },
      {
        access_token,
        refresh_token,
        expires_at,
        token_type,
        scope,
        user_id,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true
      }
    );

    console.log("✅ MercadoLibre tokens saved successfully:", {
      user_id,
      expires_at,
      scope
    });

    // Respuesta exitosa
    return NextResponse.json({
      ok: true,
      message: "🎉 Autorización exitosa! Tokens de MercadoLibre guardados.",
      data: {
        user_id,
        scope,
        expires_at: expires_at.toISOString(),
        token_type
      }
    });

  } catch (error) {
    console.error("❌ Error in MercadoLibre callback:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: "Failed to process MercadoLibre authorization"
      }, 
      { status: 500 }
    );
  }
}

// POST method para refresh token
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action !== "refresh") {
      return NextResponse.json(
        { error: "Invalid action" }, 
        { status: 400 }
      );
    }

    // Conectar a MongoDB
    await connectDB();

    // Obtener token actual
    const currentToken = await TokenModel.findOne({ type: "mlc" });
    
    if (!currentToken || !currentToken.refresh_token) {
      return NextResponse.json(
        { error: "No refresh token available" }, 
        { status: 404 }
      );
    }

    // Preparar datos para refresh
    const client_id = process.env.MLC_CLIENT_ID;
    const client_secret = process.env.MLC_CLIENT_SECRET;

    const body_refresh = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: client_id!,
      client_secret: client_secret!,
      refresh_token: currentToken.refresh_token,
    });

    // Hacer request de refresh
    const refreshRes = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: body_refresh.toString(),
    });

    const refreshData = await refreshRes.json();
    
    if (!refreshRes.ok) {
      console.error("Token refresh failed:", refreshData);
      return NextResponse.json(
        { error: "Token refresh failed", details: refreshData }, 
        { status: refreshRes.status }
      );
    }

    // Actualizar tokens
    const { access_token, refresh_token, expires_in } = refreshData;
    const expires_at = new Date(Date.now() + expires_in * 1000);

    await TokenModel.findOneAndUpdate(
      { type: "mlc" },
      {
        access_token,
        refresh_token,
        expires_at,
        updatedAt: new Date()
      }
    );

    console.log("✅ MercadoLibre tokens refreshed successfully");

    return NextResponse.json({
      ok: true,
      message: "Tokens refreshed successfully",
      expires_at: expires_at.toISOString()
    });

  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" }, 
      { status: 500 }
    );
  }
}