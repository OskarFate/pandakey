import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TokenModel from "@/models/MLCToken";

// GET /api/ml-auth/status - Verificar estado de tokens
export async function GET() {
  try {
    await connectDB();
    
    const token = await TokenModel.findOne({ type: "mlc" });
    
    if (!token) {
      return NextResponse.json({
        authorized: false,
        message: "No MercadoLibre authorization found"
      });
    }

    const now = Date.now();
    const isExpired = now >= token.expires_at.getTime();
    const needsRefresh = (token.expires_at.getTime() - now) < (60 * 60 * 1000); // 1 hora

    return NextResponse.json({
      authorized: true,
      expired: isExpired,
      needsRefresh,
      user_id: token.user_id,
      scope: token.scope,
      expires_at: token.expires_at.toISOString(),
      updated_at: token.updatedAt.toISOString()
    });

  } catch (error) {
    console.error("❌ Error checking ML auth status:", error);
    return NextResponse.json(
      { error: "Failed to check authorization status" },
      { status: 500 }
    );
  }
}