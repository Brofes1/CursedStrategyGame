class Unit
{
    constructor(faction, type)
    {
        this.type = type;
        
        if (this.type !== "Null")
        {
            this.faction = faction;
            this.factionName = faction.name;
            this.movementStyle = movementStyle[type];
            this.direction = "North";

            this.health = startingHealthValues[type];
            this.moves = moveAmounts[type];
            this.attacks = attackAmounts[type];
            this.movementPattern = Unit.UncompressMovementPattern(movementPatterns[type]);
            this.attackPattern = Unit.UncompressAttackPattern(attackPatterns[type]);
        }
    }

    static NullUnit()
    {
        return new Unit("", "Null");
    }

    static UncompressMovementPattern(pattern)
    {
        var movementDirections = ["N", "O", "E", "M", "S", "D", "W", "L"];
        var movementPattern = {};
        for (var d = 0; d < 8; d++)
        {
            var compressedPattern = pattern[movementDirections[d]];
            var uncompressedPattern = [];
            for (var i = 0; i < 9; i++)
            {
                var subArray = [];
                for (var j = 0; j < 9; j++)
                {
                    var cell = compressedPattern.charAt((j * 9) + i);
                    subArray.push(directionConversion[cell]);
                }
                uncompressedPattern.push(subArray);
            }
            movementPattern[directionConversion[movementDirections[d]]] = uncompressedPattern;
        }
        return movementPattern;
    }

    static UncompressAttackPattern(pattern)
    {
        var attackDirections = ["N", "O", "E", "M", "S", "D", "W", "L"];
        var attackPattern = {};
        for (var d = 0; d < 8; d++)
        {
            var compressedPattern = pattern[attackDirections[d]];
            var uncompressedPattern = [];
            for (var i = 0; i < 9; i++)
            {
                var subArray = [];
                for (var j = 0; j < 9; j++)
                {
                    var cell = parseInt(compressedPattern.charAt((j * 9) + i));
                    subArray.push(cell);
                }
                uncompressedPattern.push(subArray);
            }
            attackPattern[directionConversion[attackDirections[d]]] = uncompressedPattern;
        }
        return attackPattern;
    }

    IsValidMovement(grid, tileMovement, x, y)
    {
        if (tileMovement === "Invalid")
            return false;
        if (tileMovement === "Unit")
            return false;
        if (!(new Vector2(x, y)).ContainedBy(gridMinimum, gridMaximum))
            return false;
        if (grid[x][y] !== 0)
            return false;
        if (this.movementStyle === "Ground" && terrainGrid[x][y] === 1)
            return true;
        if (this.movementStyle === "Water" && terrainGrid[x][y] === 2)
            return true;
        if (terrainGrid[x][y] === 3)
            return true;
        return false;
    }

    IsValidAttack(grid, attack, x, y)
    {
        if (attack === 0)
            return false;
        if (!(new Vector2(x, y)).ContainedBy(gridMinimum, gridMaximum))
            return false;
        return true;
    }

    GetMovementInfo(x, y)
    {
        return this.movementPattern[this.direction][x][y];
    }

    GetAttackPattern(x, y)
    {
        return this.attackPattern[this.direction][x][y];
    }
}