import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/games - Get all games
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Implement games fetching from database
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
      }
    ];
    
    res.json({
      success: true,
      data: games,
      total: games.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games'
    });
  }
});

// GET /api/games/:id - Get game by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Implement game fetching by ID from database
    const game = {
      id: parseInt(id),
      title: "Cyberpunk 2077",
      price: 29.99,
      platform: "Steam",
      description: "An open-world, action-adventure story set in Night City.",
      image: "/images/cyberpunk.jpg",
      stock: 50,
      features: ["Single Player", "Multiplayer", "Achievements"]
    };
    
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch game'
    });
  }
});

// POST /api/games - Create new game (admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, price, platform, description, image, stock } = req.body;
    
    // TODO: Implement game creation in database
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
    
    res.status(201).json({
      success: true,
      data: newGame,
      message: 'Game created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create game'
    });
  }
});

export default router;