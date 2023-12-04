var gameCanvas = document.getElementById("mainCanvas");
var ctx = gameCanvas.getContext("2d");

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
function UpdateMouseState()
{
    mousePreviouslyPressed = mousePressed;
    mousePressed = mouseDown;
    mouseJustPressed = mousePressed && !mousePreviouslyPressed;
}

var factions = [];
var numberOfFactions = 0;
var currentFaction = 0;

var mouseDown = false;
var mousePos = new Vector2(0, 0);

var mousePressed = false;
var mousePreviouslyPressed = false;
var mouseJustPressed = false;

var selectedViewMode = "Terrain";
var currentColors = enabledColors;

var grid = 0;
var viewSelector = 0;

var fps = 60;

Initialize();
setInterval(Loop, 1000 / fps);

function Loop()
{
    UpdateMouseState();
    Update();
    Draw();
}

function Initialize()
{
    // Set canvas size to window size
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    // Set text
    ctx.font = "20px courier new";
    ctx.textBaseline = "top";

    // Create grid
    grid = new Grid(new Vector2(32, 32), new Vector2(0, 0), new Vector2(20, 20));
    Grid.UpdateViewModeColors();
    viewSelector = new ViewSelector(new Vector2(700, 50));

    // Create Factions
    var doneText = "";
    while (true)
    {
        while (nextFaction === undefined)
        {
            var nextFaction = prompt("Player " + (numberOfFactions + 1) + ":" + doneText);
        }
        
        if (doneText === " (Input DONE to finish)")
        {
            if (nextFaction === "DONE") break;
        }

        factions.push(new Faction(nextFaction));
        nextFaction = undefined;

        if (numberOfFactions === 2) doneText = " (Input DONE to finish)";

        if (numberOfFactions === 4) break;
    }
}

function Update()
{
    grid.Update();
    viewSelector.Update();
    if (selectedViewMode === "Spawning")
    {
        grid.SpawnUnit(factions[currentFaction], "Archer");
    }
}

function Draw()
{
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    grid.DrawTerrainGrid();
    grid.DrawUnitGrid();
    grid.DrawSelectedCell();
    grid.DisplaySelectedUnitInfo(new Vector2(700, 250));

    viewSelector.DisplayViews();
}