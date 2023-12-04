var gameCanvas = document.getElementById("mainCanvas");
var ctx = gameCanvas.getContext("2d");

try
{   
    document.body.onmousedown = function()
    {
        mouseDown = true;
    }
    document.body.onmouseup = function()
    {
        mouseDown = false;
    }
    document.body.onmousemove = function(event)
    {
        mousePos = new Vector2(event.clientX, event.clientY);
    }

    // General Variables

    var factionOrder = ["a", "b"];
    var currentFaction = 0;
    var day = 1;

    var mouseDown = false;
    var mousePos = new Vector2(0, 0);

    var mousePressed = false;
    var mousePreviouslyPressed = false;

    var gridSizeX = 32;
    var gridSizeY = 32;

    var terrainGrid = 0;

    var selectedVision = "Terrain";
    var selectedCell = new Vector2(-1, -1);

    var gridMinimum = new Vector2(0, 0);
    var gridMaximum = new Vector2(31, 31);
    var fps = 60;

    Initialize();
    setInterval(Loop, 1000 / fps);

    function EndTurn()
    {
        selectedCell = new Vector2(-1, -1);
        selectedVision = "Terrain";

        currentFaction++;
        if (currentFaction >= factionOrder.length)
        {
            currentFaction = 0;
            day++;

            grid.forEach(subArray => {
                subArray.forEach(cell => {
                    if (cell !== 0)
                    {
                        cell.moves = moveAmounts[cell.type];
                        cell.attacks = attackAmounts[cell.type];
                    }
                });
            });
        }
    }

    function Loop()
    {
        UpdateMouseState();
        Update();
        Draw();
    }

    function SelectedCellContents()
    {
        if (selectedCell.X !== -1)
        {
            return grid[selectedCell.X][selectedCell.Y];
        }
        return 0;
    }

    function UpdateMouseState()
    {
        mousePreviouslyPressed = mousePressed;
        mousePressed = mouseDown;
    }

    function Initialize()
    {
        // Set canvas size to window size
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;

        // Populate grid with cells
        var subGrid = [];
        for (i = 0; i < gridSizeY; i++)
        {
            subGrid.push(0);
        }

        for (i = 0; i < gridSizeX; i++)
        {
            // Anti-Reference jank; prevent rows from having quantum entaglment
            grid.push(JSON.parse(JSON.stringify(subGrid)));
        }

        // Set terrain
        // 1 = land, 2 = water, 3 = combined

        terrainGrid = [
            [1, 1, 1, 1, 1, 1, 1, 1,  2, 2, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 2,  2, 2, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 2,  2, 2, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 2, 2,  2, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 2, 2,  2, 1, 1, 1, 1, 1, 1, 1,  1, 1, 2, 2, 2, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 2, 2, 2,  1, 1, 1, 1, 1, 1, 1, 1,  1, 2, 2, 2, 2, 2, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2, 2, 2, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 2, 2, 2, 2, 2, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 2, 2, 2, 2, 2, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],

            [2, 2, 2, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 2, 2, 2, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 2, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 2, 2, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 2, 3, 3,  2, 2, 2, 2, 2, 1, 1, 1],

            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 2, 2, 2, 3, 3,  2, 2, 2, 2, 2, 1, 1, 1],
            [2, 2, 1, 1, 1, 1, 2, 2,  2, 1, 1, 1, 2, 2, 2, 2,  1, 1, 2, 2, 2, 2, 3, 3,  2, 2, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 3, 3, 3, 2, 2,  2, 2, 2, 2, 2, 2, 2, 2,  2, 2, 2, 2, 2, 2, 3, 3,  2, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 3, 3, 3, 2, 2,  2, 2, 2, 2, 2, 2, 2, 2,  2, 2, 2, 2, 2, 2, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 3, 3, 3, 2, 2,  2, 2, 2, 2, 2, 2, 2, 2,  2, 2, 2, 2, 2, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 3, 3, 3, 2, 1,  1, 1, 1, 1, 1, 1, 1, 2,  2, 2, 2, 2, 2, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  2, 2, 2, 2, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  2, 2, 2, 2, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],

            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 2, 2, 2, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 3, 3, 3, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 3, 3, 3, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 2, 2, 2, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 2, 2, 2, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 2, 2, 2, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 2, 2, 2, 2, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 2, 2, 2, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1]
        ]
    }

    function Update()
    {
        if (mousePressed && !mousePreviouslyPressed)
        {
            // Change View Mode Buttons
            if (mousePos.ContainedBy(new Vector2(700, 100), new Vector2(790, 125)))
                selectedVision = "Terrain";
            else if (mousePos.ContainedBy(new Vector2(700, 125), new Vector2(790, 150)))
                selectedVision = "Faction";
            else if (mousePos.ContainedBy(new Vector2(700, 150), new Vector2(790, 175)))
                selectedVision = "Spawning";
            else if (mousePos.ContainedBy(new Vector2(700, 175), new Vector2(790, 200)) && SelectedCellContents() !== 0)
                selectedVision = "Attack";
            else if (mousePos.ContainedBy(new Vector2(700, 200), new Vector2(790, 225)) && SelectedCellContents() !== 0)
                selectedVision = "Movement";
            else if (mousePos.ContainedBy(new Vector2(1360, 50), new Vector2(1460, 75)))
                EndTurn();

            // Select Cell
            else if (mousePos.ContainedBy(new Vector2(0, 0), new Vector2(640, 640)) && selectedVision !== "Attack" && selectedVision !== "Movement")
            {
                var cellX = Math.floor(mousePos.X / 20);
                var cellY = Math.floor(mousePos.Y / 20);

                selectedCell = new Vector2(cellX, cellY);

                // Spawn Unit (As test)
                if (selectedVision === "Spawning")
                {
                    grid[selectedCell.X][selectedCell.Y] = new Unit(factionOrder[currentFaction], "Archer");
                }
            }
            // Attack/Move
            else if (mousePos.ContainedBy(new Vector2(0, 0), new Vector2(640, 640)) && (selectedVision === "Attack" || selectedVision === "Movement"))
            {
                var selectedUnit = SelectedCellContents();

                var cellX = Math.floor(mousePos.X / 20);
                var cellY = Math.floor(mousePos.Y / 20);

                if ((0 <= cellX - selectedCell.X + 4 && cellX - selectedCell.X + 4 <= 8)
                    && (0 <= cellY - selectedCell.Y + 4 && cellY - selectedCell.Y + 4 <= 8))
                {
                    if (selectedVision === "Attack")
                    {
                        var attackFor = selectedUnit.GetAttackPattern(cellX - selectedCell.X + 4, cellY - selectedCell.Y + 4);
                        if (grid[cellX][cellY] !== 0 && selectedUnit.faction === factionOrder[currentFaction] 
                            && selectedUnit.IsValidAttack(grid, attackFor, cellX, cellY))
                        {
                            if (selectedUnit.attacks > 0)
                            {
                                selectedUnit.attacks -= 1;
                                grid[cellX][cellY].health -= attackFor;

                                if (grid[cellX][cellY].health <= 0)
                                {
                                    grid[cellX][cellY] = 0;
                                    if (selectedUnit.type === "Archer")
                                        selectedUnit.attacks++;
                                }

                                selectedVision = "Faction";
                            }
                        }
                    }
                    else if (selectedVision === "Movement")
                    {
                        var moveDirection = selectedUnit.GetMovementInfo(cellX - selectedCell.X + 4, cellY - selectedCell.Y + 4);
                        if (grid[cellX][cellY] === 0 && selectedUnit.faction === factionOrder[currentFaction]
                            && selectedUnit.IsValidMovement(grid, moveDirection, cellX, cellY))
                        {
                            if (selectedUnit.moves > 0)
                            {
                                selectedUnit.moves -= 1;
                                selectedUnit.direction = moveDirection;

                                grid[cellX][cellY] = selectedUnit;
                                grid[selectedCell.X][selectedCell.Y] = 0;

                                selectedCell = new Vector2(cellX, cellY);
                                selectedVision = "Faction";
                            }
                        }
                    }
                }                
            }
        }
    }

    function Draw()
    {        
        // Clear canvas 
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Set colors
        selectColor = "#FF00FF";
        if (selectedVision === "Terrain")
        {
            groundColor =       "#00FF00";
            waterColor =        "#0000FF";
            combinedColor =     "#964B00";
            terrainTextColor =  "#00FF00";
            factionTextColor =  "#777777";
            spawningTextColor = "#777777";
            attackTextColor =   "#777777";
            movementTextColor = "#777777";
        }
        else if (selectedVision === "Faction")
        {
            groundColor =       "#999999";
            waterColor =        "#BBBBBB";
            combinedColor =     "#666666";
            terrainTextColor =  "#777777";
            factionTextColor =  "#0000FF";
            spawningTextColor = "#777777";
            attackTextColor =   "#777777";
            movementTextColor = "#777777";
        }
        else if (selectedVision === "Spawning")
        {
            groundColor =       "#999999";
            waterColor =        "#BBBBBB";
            combinedColor =     "#666666";
            terrainTextColor =  "#777777";
            factionTextColor =  "#777777";
            spawningTextColor = "#FF00FF";
            attackTextColor =   "#777777";
            movementTextColor = "#777777";
        }
        else if (selectedVision === "Attack")
        {
            groundColor =       "#999999";
            waterColor =        "#BBBBBB";
            combinedColor =     "#666666";
            terrainTextColor =  "#777777";
            factionTextColor =  "#777777";
            spawningTextColor = "#777777";
            attackTextColor =   "#FF0000";
            movementTextColor = "#777777";
        }
        else if (selectedVision === "Movement")
        {
            groundColor =       "#999999";
            waterColor =        "#BBBBBB";
            combinedColor =     "#666666";
            terrainTextColor =  "#777777";
            factionTextColor =  "#777777";
            spawningTextColor = "#777777";
            attackTextColor =   "#777777";
            movementTextColor = "#FF6600";
        }
        else
        {
            groundColor =       "#999999";
            waterColor =        "#BBBBBB";
            combinedColor =     "#666666";
            terrainTextColor =  "#777777";
            factionTextColor =  "#777777";
            spawningTextColor = "#777777";
            attackTextColor =   "#777777";
            movementTextColor = "#777777";
        }

        // Draw grid
        ctx.font = "20px courier new";
        ctx.textBaseline = "top";
        for (x = 0; x < grid.length; x++)
        {
            var subgrid = grid[x];
            for (y = 0; y < subgrid.length; y++)
            {
                // Draw terrain
                if (terrainGrid[x][y] === 1)
                {
                    ctx.fillStyle = groundColor;
                    ctx.fillRect(x * 20, y * 20, 20, 20);
                }
                else if (terrainGrid[x][y] === 2)
                {
                    ctx.fillStyle = waterColor;
                    ctx.fillRect(x * 20, y * 20, 20, 20);
                }
                else if (terrainGrid[x][y] === 3)
                {
                    ctx.fillStyle = combinedColor;
                    ctx.fillRect(x * 20, y * 20, 20, 20);
                }

                // Display units
                if (grid[x][y] !== 0)
                {
                    cell = grid[x][y];
                        
                    switch (cell.type)
                    {
                        case "Knight":
                            ctx.fillStyle = "#FF6600";
                            ctx.fillText("k", 5 + x * 20, y * 20);
                            break;
                        case "Archer":
                            ctx.fillStyle = "#FF6600";
                            ctx.fillText("a", 5 + x * 20, y * 20);
                            break;
                        case "City":
                            ctx.fillStyle = "#FF6600";
                            ctx.fillText("C", 5 + x * 20, y * 20);
                            break;
                        case "Captain":
                            ctx.fillStyle = "#FF6600";
                            ctx.fillText("c", 5 + x * 20, y * 20);
                            break;
                        case "Ship":
                            ctx.fillStyle = "#FF6600";
                            ctx.fillText("s", 5 + x * 20, y * 20);
                            break;
                    }
                }

                if (x === selectedCell.X && y === selectedCell.Y)
                {
                    // Display selected cell
                    ctx.globalAlpha = .4;
                    ctx.fillStyle = selectColor;
                    ctx.fillRect(x * 20, y * 20, 20, 20);
                    ctx.globalAlpha = 1;

                    // Show unit information
                    if (grid[x][y] !== 0)
                    {
                        cell = grid[x][y];

                        ctx.fillStyle = "#FFFFFF";

                        ctx.fillText("Unit Stats", 700, 250)
                        ctx.fillText("Faction:   " + cell.faction, 700, 300);
                        ctx.fillText("Type:      " + cell.type, 700, 325);
                        ctx.fillText("Direction: " + cell.direction, 700, 350);
                        ctx.fillText("Health:    " + cell.health, 700, 375);
                        ctx.fillText("Moves:     " + cell.moves, 700, 400);
                        ctx.fillText("Attacks:   " + cell.attacks, 700, 425);
                    }
                }
            }
        }

        if (selectedVision === "Attack")
        {
            // Display attack options
            var selectedUnit = SelectedCellContents();

            ctx.globalAlpha = .4;
            if (selectedUnit.attacks === 0 || selectedUnit.faction !== factionOrder[currentFaction])
                ctx.globalAlpha = .2;

            for (var x = 0; x < 9; x++)
            {
                for (var y = 0; y < 9; y++)
                {
                    var tileAttack = selectedUnit.GetAttackPattern(x, y);
                    var displayTile = new Vector2(selectedCell.X + x - 4, selectedCell.Y + y - 4);

                    if (selectedUnit.IsValidAttack(grid, tileAttack, x, y))
                    {
                        ctx.fillStyle = attackToColor[tileAttack];
                        ctx.fillRect(displayTile.X * 20, displayTile.Y * 20, 20, 20);
                    }
                }
            }
            ctx.globalAlpha = 1;

            ctx.fillStyle = "#FFFFFF";
            ctx.fillText("Attack Power Key:", 40, 660);
            var attackLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9];

            for (var i = 0; i < 9; i++)
            {
                ctx.fillStyle = attackToColor[attackLevels[i]];
                ctx.fillRect(40 + (20 * i), 680, 20, 20);
                ctx.fillText(attackLevels[i], 45 + (20 * i), 705);
            }
        }
        else if (selectedVision === "Movement")
        {
            // Display movement options
            var selectedUnit = SelectedCellContents();

            ctx.globalAlpha = .4;
            if (selectedUnit.moves === 0 || selectedUnit.faction !== factionOrder[currentFaction])
                ctx.globalAlpha = .2;

            for (var x = 0; x < 9; x++)
            {
                for (var y = 0; y < 9; y++)
                {
                    var tileMovement = selectedUnit.GetMovementInfo(x, y);
                    var displayTile = new Vector2(selectedCell.X + x - 4, selectedCell.Y + y - 4);

                    if (selectedUnit.IsValidMovement(grid, tileMovement, displayTile.X, displayTile.Y))
                    {
                        ctx.fillStyle = directionToColor[tileMovement];
                        ctx.fillRect(displayTile.X * 20, displayTile.Y * 20, 20, 20);
                    }
                }
            }
            ctx.globalAlpha = 1;

            ctx.fillStyle = "#FFFFFF";
            ctx.fillText("Direction Key:", 40, 660);
            var movements = ["N", "O", "E", "M", "S", "D", "W", "L"];

            for (var i = 0; i < 8; i++)
            {
                ctx.fillStyle = directionToColor[directionConversion[movements[i]]];
                ctx.fillRect(40 + (20 * i), 680, 20, 20);
                // End of the X calculation is to offset every other direction due to NE and such being too long
                ctx.fillText(shortDirectionConversion[movements[i]], 43 + (20 * i), 705);
            }
        }

        // Draw View Modes
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("View Mode", 700, 50)
        ctx.fillStyle = terrainTextColor;
        ctx.fillText("Terrain", 700, 100);
        ctx.fillStyle = factionTextColor;
        ctx.fillText("Faction", 700, 125);
        ctx.fillStyle = spawningTextColor;
        ctx.fillText("Spawning", 700, 150);
        ctx.fillStyle = attackTextColor;
        ctx.fillText("Attack", 700, 175);
        ctx.fillStyle = movementTextColor;
        ctx.fillText("Movement", 700, 200);

        // Draw Next Turn Button / Current Day / Current Faction
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("END TURN", 1360, 50);
        ctx.fillText("Day: " + day, 1460 - ctx.measureText("Day: " + day).width, 75);
        ctx.fillText("Faction: " + factionOrder[currentFaction], 
            1460 - ctx.measureText("Faction: " + factionOrder[currentFaction]).width, 100);

        // Draw Debug Info
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("DEBUG", 900, 50);
        ctx.fillText("Mouse Pos: " + mousePos.X + ", " + mousePos.Y, 900, 100);
        ctx.fillText("Selected Cell: " + selectedCell.X + ", " + selectedCell.Y, 900, 125);
    }
}
catch (e)
{
    ctx.fillStyle = "#FF0000";
    ctx.font = "20px courier new";
    ctx.fillText(e, 10, 10);
}
