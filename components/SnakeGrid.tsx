/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { KeyboardEvent, useEffect } from "react";

const GRID_SIZE = 20;

type Point = {
    x: number;
    y: number;
};

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const SnakeGrid = () => {
    const [snake, setSnake] = React.useState<Point[]>([
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
    ]);
    const [food, setFood] = React.useState<Point>({ x: 0, y: 0 });
    const [direction, setDirection] = React.useState<Direction>("RIGHT");
    const [gameOver, setGameOver] = React.useState<boolean>(false);

    const generateFood = () => {
        setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        });
    };

    const moveSnake = () => {
        const newSnake = [...snake];
        const snakeHead = { ...newSnake[0] };

        if (direction === "UP") {
            snakeHead.y -= 1;
        }
        if (direction === "DOWN") {
            snakeHead.y += 1;
        }
        if (direction === "LEFT") {
            snakeHead.x -= 1;
        }
        if (direction === "RIGHT") {
            snakeHead.x += 1;
        }

        // check if snake hits the wall
        if (
            snakeHead.x < 0 ||
            snakeHead.x >= GRID_SIZE ||
            snakeHead.y < 0 ||
            snakeHead.y >= GRID_SIZE ||
            // check if snake hits itself
            newSnake.some(
                (snakePart) =>
                    snakePart.x === snakeHead.x && snakePart.y === snakeHead.y
            )
        ) {
            setGameOver(true);
            return;
        }

        newSnake.unshift(snakeHead);

        // check if snake eats the food
        if (snakeHead.x === food.x && snakeHead.y === food.y) {
            generateFood();
        } else {
            newSnake.pop();
        }
        setSnake(newSnake);
    };

    useEffect(() => {
        const interval = setInterval(moveSnake, 70);
        return () => clearInterval(interval);
    }, [snake, direction]);

    useEffect(() => {
        generateFood();
    }, []);

    const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowUp" && direction !== "DOWN") {
            setDirection("UP");
        }
        if (event.key === "ArrowDown" && direction !== "UP") {
            setDirection("DOWN");
        }
        if (event.key === "ArrowLeft" && direction !== "RIGHT") {
            setDirection("LEFT");
        }
        if (event.key === "ArrowRight" && direction !== "LEFT") {
            setDirection("RIGHT");
        }
    };

    return (
        <div
            onKeyDown={handleKeyPress}
            tabIndex={0}
            autoFocus
            className="grid grid-cols-20 grid-rows-20 border-[1px] border-gray-700"
        >
            {gameOver && (
                <div className="absolute inset-0 flex justify-center items-center text-4xl font-bold text-red-500">
                    Game Over
                </div>
            )}

            {Array.from({ length: GRID_SIZE }).map((_, y) => (
                <div className="flex" key={y}>
                    {Array.from({ length: GRID_SIZE }).map((_, x) => (
                        <div
                            key={x}
                            className={`border-[0.2px] w-6 h-6 border-gray-400 ${
                                snake.some(
                                    (snakePart) =>
                                        snakePart.x === x && snakePart.y === y
                                )
                                    ? "bg-green-500"
                                    : ""
                            } ${
                                food.x === x && food.y === y ? "bg-red-500" : ""
                            }`}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SnakeGrid;
