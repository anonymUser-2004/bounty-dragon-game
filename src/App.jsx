import React, { useState } from 'react';
import Navbar from './components/Navbar';
import './index.css';

const gridSize = 21; // 7 rows and 3 columns = 21 cells
const rows = gridSize / 3; // 7 rows
const totemValues = [1.5, 2, 5, 10, 50]; // Possible totem values

const createGrid = () => {
    const grid = [];
    const totemValueMap = [];

    for (let i = 0; i < rows; i++) {
        const row = shuffleArray([false, true, true]); // One totem (false) and two volcanoes (true)
        grid.push(...row);

        // Assign a random totem value for this row
        const randomTotemValue = totemValues[Math.floor(Math.random() * totemValues.length)];
        totemValueMap.push(randomTotemValue);
    }

    return { grid, totemValueMap };
};

const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

const DragonTowerGame = () => {
    const [{ grid, totemValueMap }, setGridData] = useState(createGrid());
    const [revealedTiles, setRevealedTiles] = useState([]); // Tiles revealed by the player
    const [reward, setReward] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [playerPosition, setPlayerPosition] = useState(gridSize - 3); // Start at the last row
    const [currentRow, setCurrentRow] = useState(6); // Starting at the bottom row (index 6)
    const [currentTotemValue, setCurrentTotemValue] = useState(null); // Store the current totem's value
    const [crackingIndex, setCrackingIndex] = useState(null); // Tile currently cracking
    const [animationStep, setAnimationStep] = useState(0); // Track animation step
    const [multiplier, setMultiplier] = useState(0); // Initial multiplier starts at 0

    const revealTile = (index) => {
        if (revealedTiles.includes(index) || gameOver || crackingIndex !== null) return;

        const row = Math.floor(index / 3);
        if (row !== currentRow) return; // Only allow clicking on the current row

        setCrackingIndex(index); // Set the clicked tile as cracking
        setAnimationStep(1); // Start cracking animation

        // Animation sequence
        setTimeout(() => {
            setAnimationStep(2); // Show the second cracking animation
        }, 600); // Time for first crack

        setTimeout(() => {
            setPlayerPosition(index); // Player moves to the clicked tile
            if (grid[index]) {
                // Volcano found, game over
                setGameOver(true);
                setRevealedTiles([...Array(grid.length).keys()]); // Reveal all tiles
            } else {
                // Totem found
                setRevealedTiles([...revealedTiles, index]);
                const totemReward = totemValueMap[currentRow];
                setReward(reward + totemReward * multiplier); // Increase reward based on totem value and multiplier
                setCurrentTotemValue(totemReward); // Store the current totem value
                
                // Increase multiplier based on the totem value
                setMultiplier(multiplier + 1); // Increment the multiplier by 1 for each totem found

                if (currentRow > 0) {
                    // Move the player one row up
                    setCurrentRow(currentRow - 1); // Move to the row above
                }
            }
            setCrackingIndex(null); // Reset cracking index after reveal
            setAnimationStep(0); // Reset animation step
        }, 1200); // Total time for both cracks before revealing
    };

    // Function for autopick
    const autopick = () => {
        const availableTiles = [];
        for (let i = currentRow * 3; i < (currentRow + 1) * 3; i++) {
            if (!revealedTiles.includes(i) && grid[i] === false) { // Only select tiles that are not revealed and are totems
                availableTiles.push(i);
            }
        }

        if (availableTiles.length > 0) {
            const randomIndex = availableTiles[Math.floor(Math.random() * availableTiles.length)];
            revealTile(randomIndex); // Reveal the selected tile
        }
    };

    const restartGame = () => {
        const newGridData = createGrid();
        setGridData(newGridData); // Reset the grid with random totems
        setRevealedTiles([]);
        setReward(0);
        setGameOver(false);
        setPlayerPosition(gridSize - 3); // Start at the last row
        setCurrentRow(6); // Start from the bottom row
        setCurrentTotemValue(null); // Reset totem value
        setCrackingIndex(null); // Reset cracking state
        setAnimationStep(0); // Reset animation step
        setMultiplier(0); // Reset multiplier
    };

    return (
        <>
            <Navbar />
            <div className="flex px-14 items-center justify-center h-screen bg-[url('bg.jpg')] text-white">
                {/* Sidebar */}
                <div className="p-4 bg-opacity-90 bg-black rounded-md h-[90%] flex flex-col items-center relative">
                    <div className="type-bet flex justify-center items-center gap-3">
                        <div className="manual px-10 m-4 py-3 font-bold bg-slate-700 rounded-md">Manual</div>
                        <button 
                            onClick={autopick} // Call autopick function on button click
                            className="autopick px-10 m-4 py-3 font-bold bg-slate-900 rounded-md"
                        >
                            Autopick
                        </button>
                    </div>
                    <div className="mb-8 w-full">
                        <h2 className='font-bold m-1'>Bet Amount</h2>
                        <input
                            type="number"
                            className="w-full p-2 mb-4 bg-gray-700 rounded text-gray-200"
                        />
                        <button
                            onClick={restartGame}
                            className="w-full bg-green-500 py-2 rounded-lg hover:bg-green-700 transition mb-4"
                        >
                            Play
                        </button>
                    </div>
                    <div className="bottom-part ">
                        <div className="man absolute bottom-10 right-[80%]">
                            <img width={45} height={45} src="man2.png" alt="" />
                        </div>
                        <div className="instruction w-36 absolute bottom-10 right-[20%]">
                            <h2 className='font-bold'>Click one of the blue tiles to start</h2>
                        </div>
                    </div>
                </div>

                {/* Game Grid */}
                <div className="relative w-3/4 flex flex-col items-center justify-center bg-cover" style={{ backgroundImage: "url('/lava-bg.jpg')" }}>
                    <div className="goldcoins flex">
                        <img src="coins.png" width={200} alt="" />
                        <img src="coins.png" width={200} alt="" />
                        <img src="coins.png" width={200} alt="" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {grid.map((tile, index) => (
                            <button
                                key={index}
                                className={`w-24 h-16 flex items-center justify-center border-2 border-gray-500 rounded-lg relative`}
                                style={{
                                    backgroundImage: revealedTiles.includes(index)
                                        ? tile
                                            ? "url('/volcano.png')" // Background for volcano
                                            : "url('/totem.png')"   // Background for totem
                                        : index >= currentRow * 3 && index < (currentRow + 1) * 3
                                            ? "url('/blue-brick.png')" // Blue brick background when clickable
                                            : "url('/grey-brick.png')", // Grey brick for unrevealed tiles
                                    backgroundSize: 'cover',
                                    animation: !revealedTiles.includes(index) && index >= currentRow * 3 && index < (currentRow + 1) * 3
                                        ? 'glow 1.5s infinite alternate' // Apply glowing effect only on blue bricks in the current row
                                        : 'none', // No animation for other tiles
                                }}
                                onClick={() => revealTile(index)}
                                disabled={gameOver || revealedTiles.includes(index)}
                            >
                                {crackingIndex === index && animationStep === 1 && (
                                    <img src="/1st_crack.png" className="absolute inset-0" />
                                )}
                                {crackingIndex === index && animationStep === 2 && (
                                    <img src="/2nd_crack.png" className="absolute inset-0" />
                                )}
                                {revealedTiles.includes(index) && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <h2 className="text-2xl font-bold">{tile ? '💥' : '🎉'}</h2>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    {/* Multiplier Bar at the bottom */}
<div className="absolute right-10 bottom-10 flex flex-col items-center">
    {/* Displaying Multiplier Values */}
    <div className="flex flex-col items-center">
        <span className="text-lg">Multiplier: {multiplier}x</span>
        <div className="multiplier-bar">
            <div
                className="multiplier-fill"
                style={{ height: `${Math.min(multiplier * 10, 100)}%` }} // Fill height based on the multiplier
            ></div>
        </div>
    </div>
</div>

                    
                    {gameOver && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-black bg-opacity-80">
                            <h2 className="text-xl font-bold">Game Over!</h2>
                            <p className="text-lg">Total Reward: {reward}*</p>
                            <button onClick={restartGame} className="bg-red-500 text-white py-2 px-4 rounded">Restart</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DragonTowerGame;
