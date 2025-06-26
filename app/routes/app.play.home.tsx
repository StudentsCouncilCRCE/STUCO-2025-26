import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

// Types
interface Position {
  x: number;
  y: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

interface Star {
  x: number;
  y: number;
  opacity: number;
  size: number;
}

interface GameState {
  bird: Position;
  pipes: Pipe[];
  stars: Star[];
  score: number;
  gameStarted: boolean;
  gameOver: boolean;
  showStartAnimation: boolean;
}

const GRAVITY = 2;
const JUMP_FORCE = -100;
const PIPE_WIDTH = 80;
const PIPE_GAP = 200;
const PIPE_SPEED = 3;
const BIRD_SIZE = 30;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;

const FlappyBirdGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [gameSize, setGameSize] = useState({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  });

  const [gameState, setGameState] = useState<GameState>({
    bird: { x: 100, y: GAME_HEIGHT / 2 },
    pipes: [],
    stars: [],
    score: 0,
    gameStarted: false,
    gameOver: false,
    showStartAnimation: true,
  });

  // Handle responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== "undefined") {
        const maxWidth = Math.min(GAME_WIDTH, window.innerWidth - 16);
        const maxHeight = Math.min(GAME_HEIGHT, window.innerHeight - 32);
        setGameSize({ width: maxWidth, height: maxHeight });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Generate stars for background
  const generateStars = useCallback((): Star[] => {
    const stars: Star[] = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        opacity: Math.random() * 0.8 + 0.2,
        size: Math.random() * 2 + 1,
      });
    }
    return stars;
  }, []);

  // Initialize stars
  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      stars: generateStars(),
    }));
  }, [generateStars]);

  // Generate pipe
  const generatePipe = useCallback((x: number): Pipe => {
    const topHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
    return {
      x,
      topHeight,
      bottomY: topHeight + PIPE_GAP,
      passed: false,
    };
  }, []);

  // Jump function
  const jump = useCallback(() => {
    if (!gameState.gameStarted || gameState.gameOver) return;

    setGameState((prev) => ({
      ...prev,
      bird: {
        ...prev.bird,
        y: Math.max(0, prev.bird.y + JUMP_FORCE),
      },
    }));
  }, [gameState.gameStarted, gameState.gameOver]);

  // Start game
  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      bird: { x: 100, y: GAME_HEIGHT / 2 },
      pipes: [generatePipe(GAME_WIDTH)],
      score: 0,
      gameStarted: true,
      gameOver: false,
      showStartAnimation: false,
    }));
  }, [generatePipe]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      bird: { x: 100, y: GAME_HEIGHT / 2 },
      pipes: [],
      score: 0,
      gameStarted: false,
      gameOver: false,
      showStartAnimation: false,
    }));
  }, []);

  // Collision detection
  const checkCollision = useCallback(
    (bird: Position, pipes: Pipe[]): boolean => {
      // Ground and ceiling collision
      if (bird.y <= 0 || bird.y >= GAME_HEIGHT - BIRD_SIZE) {
        return true;
      }

      // Pipe collision
      for (const pipe of pipes) {
        if (
          bird.x < pipe.x + PIPE_WIDTH &&
          bird.x + BIRD_SIZE > pipe.x &&
          (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.bottomY)
        ) {
          return true;
        }
      }

      return false;
    },
    []
  );

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.gameStarted || prev.gameOver) return prev;

      // Update bird position
      const newBird = {
        ...prev.bird,
        y: prev.bird.y + GRAVITY,
      };

      // Update pipes
      let newPipes = prev.pipes.map((pipe) => ({
        ...pipe,
        x: pipe.x - PIPE_SPEED,
      }));

      // Remove off-screen pipes
      newPipes = newPipes.filter((pipe) => pipe.x > -PIPE_WIDTH);

      // Add new pipes
      if (
        newPipes.length === 0 ||
        newPipes[newPipes.length - 1].x < GAME_WIDTH - 300
      ) {
        newPipes.push(generatePipe(GAME_WIDTH));
      }

      // Update score
      let newScore = prev.score;
      newPipes.forEach((pipe) => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < newBird.x) {
          pipe.passed = true;
          newScore++;
        }
      });

      // Check collision
      const collision = checkCollision(newBird, newPipes);

      return {
        ...prev,
        bird: newBird,
        pipes: newPipes,
        score: newScore,
        gameOver: collision,
      };
    });
  }, [generatePipe, checkCollision]);

  // Game loop effect
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
      const interval = setInterval(() => {
        animationRef.current = requestAnimationFrame(gameLoop);
      }, 16);

      return () => {
        clearInterval(interval);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [gameState.gameStarted, gameState.gameOver, gameLoop]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (!gameState.gameStarted) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState.gameStarted, jump, startGame]);

  // Touch/mouse controls
  const handleClick = () => {
    if (!gameState.gameStarted) {
      startGame();
    } else {
      jump();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-2">
      <div
        ref={gameRef}
        className="relative bg-gradient-to-b from-indigo-950 to-purple-950 rounded-lg shadow-2xl overflow-hidden cursor-pointer select-none max-w-full"
        style={{
          width: gameSize.width,
          height: gameSize.height,
          aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}`,
        }}
        onClick={handleClick}
        onTouchStart={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {/* Stars Background */}
        {gameState.stars.map((star, index) => (
          <div
            key={index}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}

        {/* Game Title */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
            gameState.showStartAnimation ? "top-1/2 -translate-y-1/2" : "top-8"
          }`}
        >
          <h1 className="text-4xl font-bold text-white text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Flappy Bird
          </h1>
        </div>

        {/* Score */}
        {gameState.gameStarted && (
          <div className="absolute top-4 right-4 text-white text-2xl font-bold">
            {gameState.score}
          </div>
        )}

        {/* Bird */}
        {(gameState.gameStarted || !gameState.showStartAnimation) && (
          <div
            className="absolute w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg transition-transform duration-100"
            style={{
              left: gameState.bird.x,
              top: gameState.bird.y,
              transform: `rotate(${Math.min(
                45,
                Math.max(-45, GRAVITY * 5)
              )}deg)`,
            }}
          >
            {/* Bird eye */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full">
              <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-black rounded-full" />
            </div>
          </div>
        )}

        {/* Pipes */}
        {gameState.pipes.map((pipe, index) => (
          <div key={index}>
            {/* Top pipe */}
            <div
              className="absolute bg-gradient-to-r from-green-600 to-green-800 border-r-4 border-green-900"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.topHeight,
              }}
            />
            {/* Bottom pipe */}
            <div
              className="absolute bg-gradient-to-r from-green-600 to-green-800 border-r-4 border-green-900"
              style={{
                left: pipe.x,
                top: pipe.bottomY,
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.bottomY,
              }}
            />
          </div>
        ))}

        {/* Start Button */}
        {!gameState.gameStarted && !gameState.gameOver && (
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
              gameState.showStartAnimation ? "top-3/4" : "bottom-20"
            }`}
          >
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              Start Game
            </Button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-xl text-gray-300 mb-2">
                Score: {gameState.score}
              </p>
              <Button
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-full mt-4"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!gameState.gameStarted && !gameState.gameOver && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-white text-sm opacity-75">
              Click or press SPACE to flap
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlappyBirdGame;
