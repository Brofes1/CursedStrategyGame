class ViewSelector
{
    constructor(position)
    {
        this.position = position;
    }

    DisplayViews()
    {
        ctx.globalAlpha = 1;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("View Modes:", this.position.X, this.position.Y)
        for (var i = 0; i < viewModes.length; i++)
        {
            ctx.fillStyle = currentColors[viewModeTextToColorType[viewModes[i]]];
            ctx.fillText(viewModes[i], this.position.X, this.position.Y + 50 + (i * 25));
        }
    }

    Update()
    {
        if (mouseJustPressed)
        {
            for (var i = 0; i < viewModes.length; i++)
            {
                if (this.position.X <= mousePos.X && mousePos.X < this.position.X + ctx.measureText(viewModes[i]).width)
                {
                    if (this.position.Y + 50 + (i * 25) <= mousePos.Y && mousePos.Y < this.position.Y + 75 + (i * 25))
                    {
                        selectedViewMode = viewModes[i];
                        Grid.UpdateViewModeColors();
                    }
                }
            }
        }
    }
}