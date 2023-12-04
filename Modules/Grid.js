class Grid
{
    constructor(size, position, cellSize)
    {
        this.size = size;
        this.position = position;
        this.cellSize = cellSize;

        this.unitGrid = this.CreateGrid();
        this.terrain = this.CreateTerrain();

        this.selectedCell = new Vector2(9, 14);
    }

    CreateGrid()
    {
        var grid = [];
        for (var x = 0; x < this.size.X; x++)
        {
            var subGrid = [];
            for (var y = 0; y < this.size.Y; y++)
            {
                subGrid.push(Unit.NullUnit());
            }
            grid.push(subGrid);
        }

        return grid;
    }

    CreateTerrain()
    {
        var grid = [];
        for (var y = 0; y < this.size.Y; y++)
        {
            var subGrid = [];
            for (var x = 0; x < this.size.X; x++)
            {
                subGrid.push(terrainNumberToFull[terrainData.charAt((y * this.size.X) + x)]);
            }
            grid.push(subGrid);
        }
        return grid;
    }

    static UpdateViewModeColors()
    {
        var currentViewColors = viewModeColors[selectedViewMode];
        currentColors = {};

        for (var i = 0; i < colorTypes.length; i++)
        {
            if (currentViewColors.charAt(i) === "E") currentColors[colorTypes[i]] = enabledColors[colorTypes[i]];
            else if (currentViewColors.charAt(i) === "D") currentColors[colorTypes[i]] = disabledColors[colorTypes[i]];
        }
    }

    DrawTerrainGrid()
    {
        for (var x = 0; x < this.size.X; x++)
        {
            for (var y = 0; y < this.size.Y; y++)
            {
                ctx.fillStyle = currentColors[this.terrain[x][y]];
                ctx.globalAlpha = 1;
                ctx.fillRect(this.position.X + (x * this.cellSize.X), this.position.Y + (y * this.cellSize.Y), this.cellSize.X, this.cellSize.Y);
            }
        }
    }

    DrawUnitGrid()
    {
        for (var x = 0; x < this.size.X; x++)
        {
            for (var y = 0; y < this.size.Y; y++)
            {
                var unit = this.unitGrid[x][y];

                if (unit.type !== "Null")
                {
                    ctx.globalAlpha = 1;

                    ctx.fillStyle = unit.faction.color;
                    ctx.fillText(unitDisplayNames[unit.type], 5 + this.position.X + (x * this.cellSize.X), this.position.Y + (y * this.cellSize.Y))
                }
            }
        }
    }

    DrawSelectedCell()
    {
        if (this.selectedCell.X !== -1)
        {
            ctx.globalAlpha = .4;
            ctx.fillStyle = enabledColors["selectedCell"];
            ctx.fillRect(this.position.X + (this.selectedCell.X * this.cellSize.X), this.position.Y + (this.selectedCell.Y * this.cellSize.Y), this.cellSize.X, this.cellSize.Y);
        }
    }

    SpawnUnit(faction, type)
    {
        if (mouseJustPressed)
        {
            if (this.position.X <= mousePos.X && mousePos.X <= this.position.X + (this.size.X * this.cellSize.X))
            {
                if (this.position.Y <= mousePos.Y && mousePos.Y <= this.position.Y + (this.size.Y * this.cellSize.Y))
                {
                    this.unitGrid[this.selectedCell.X][this.selectedCell.Y] = new Unit(faction, type);
                }
            }
        }
    }

    DisplaySelectedUnitInfo(position)
    {
        if (this.selectedCell.X !== -1 && this.unitGrid[this.selectedCell.X][this.selectedCell.Y].type !== "Null")
        {
            var selectedUnit = this.unitGrid[this.selectedCell.X][this.selectedCell.Y];

            ctx.globalAlpha = 1;

            ctx.fillStyle = "#FFFFFF";
            ctx.fillText("Unit Info:", position.X, position.Y)
            for (var i = 0; i < unitInfoToDisplay.length; i++)
            {
                ctx.fillText(internalUnitInfoToDisplayString[unitInfoToDisplay[i]] + ": " + selectedUnit[unitInfoToDisplay[i]], 
                    position.X, position.Y + 50 + (i * 25));
            }
        }
    }

    Update()
    {
        if (mouseJustPressed)
        {
            if (this.position.X <= mousePos.X && mousePos.X <= this.position.X + (this.size.X * this.cellSize.X))
            {
                if (this.position.Y <= mousePos.Y && mousePos.Y <= this.position.Y + (this.size.Y * this.cellSize.Y))
                {
                    this.selectedCell = new Vector2(Math.floor((mousePos.X - this.position.X) / this.cellSize.X),
                        Math.floor((mousePos.Y - this.position.Y) / this.cellSize.Y));
                }
            }
        }
    }
}