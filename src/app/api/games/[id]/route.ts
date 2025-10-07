import { NextRequest, NextResponse } from 'next/server';

// GET /api/games/[id] - Get game by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // TODO: Implement game fetching by ID from MongoDB
    const game = {
      id: parseInt(id),
      title: "Cyberpunk 2077",
      price: 29.99,
      platform: "Steam",
      description: "An open-world, action-adventure story set in Night City.",
      image: "/images/cyberpunk.jpg",
      stock: 50,
      features: ["Single Player", "Multiplayer", "Achievements"],
      systemRequirements: {
        minimum: "GTX 1060, 8GB RAM, Intel i5-3570K",
        recommended: "RTX 3070, 16GB RAM, Intel i7-8700K"
      }
    };
    
    if (!game) {
      return NextResponse.json(
        {
          success: false,
          error: 'Game not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: game
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch game'
      },
      { status: 500 }
    );
  }
}