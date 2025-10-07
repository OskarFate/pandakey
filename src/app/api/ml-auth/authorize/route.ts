import { NextResponse } from "next/server";

// GET /api/ml-auth/authorize - Iniciar proceso de autorización
export async function GET() {
  try {
    const client_id = process.env.MLC_CLIENT_ID;
    const redirect_uri = process.env.MLC_REDIRECT_URI;

    if (!client_id || !redirect_uri) {
      return NextResponse.json(
        { error: "Missing MercadoLibre configuration" },
        { status: 500 }
      );
    }

    // Generar state para seguridad (opcional pero recomendado)
    const state = Math.random().toString(36).substring(2, 15);
    
    // Scopes necesarios para vender en MercadoLibre
    const scopes = [
      "offline_access",  // Para refresh token
      "read",           // Leer información básica
      "write"           // Crear y modificar publicaciones
    ].join(" ");

    // URL de autorización de MercadoLibre
    const authUrl = new URL("https://auth.mercadolibre.com.ar/authorization");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", client_id);
    authUrl.searchParams.set("redirect_uri", redirect_uri);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("state", state);

    return NextResponse.json({
      authorization_url: authUrl.toString(),
      state,
      scopes,
      instructions: {
        step1: "Redirige al usuario a authorization_url",
        step2: "El usuario autoriza la aplicación en MercadoLibre",
        step3: "MercadoLibre redirige a tu redirect_uri con un code",
        step4: "Tu callback /api/ml-auth intercambia el code por tokens"
      }
    });

  } catch (error) {
    console.error("❌ Error generating authorization URL:", error);
    return NextResponse.json(
      { error: "Failed to generate authorization URL" },
      { status: 500 }
    );
  }
}