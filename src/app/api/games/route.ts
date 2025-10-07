import { NextRequest, NextResponse } from 'next/server';

// GET /api/games - Get all games
export async function GET() {
  try {
    // TODO: Implement games fetching from MongoDB
    const games = [
      {
        id: 1,
        title: "Cyberpunk 2077",
        price: 29.99,
        platform: "Steam",
        image: "/images/cyberpunk.jpg",
        stock: 50
      },
      {
        id: 2,
        title: "The Witcher 3",
        price: 19.99,
        platform: "GOG",
        image: "/images/witcher3.jpg",
        stock: 25
      },
      {
        id: 3,
        title: "Elden Ring",
        price: 39.99,
        platform: "Steam",
        image: "/images/eldenring.jpg",
        stock: 100
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: games,
      total: games.length
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch games'
      },
      { status: 500 }
    );
  }
}

// POST /api/games - Create new game (admin only)
export async function POST(request: NextRequest) {
  try {
    const { title, price, platform, description, image, stock } = await request.json();
    
    // TODO: Implement game creation in MongoDB
    const newGame = {
      id: Date.now(), // Temporary ID
      title,
      price,
      platform,
      description,
      image,
      stock,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(
      {
        success: true,
        data: newGame,
        message: 'Game created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create game'
      },
      { status: 500 }
    );
  }
}