class Vector2
{
    constructor(X, Y)
    {
        this.X = X;
        this.Y = Y;
    }

    static Zero()
    {
        return new Vec2(0, 0);
    }

    static One()
    {
        return new Vec2(1, 1);
    }

    ContainedBy(vector1, vector2)
    {
        var normalizedVector1 = new Vector2(Math.min(vector1.x, vector2.x), Math.min(vector1.y, vector2.y));
        var normalizedVector2 = new Vector2(Math.max(vector1.x, vector2.x), Math.max(vector1.y, vector2.y));

        if (normalizedVector1.X <= this.X && this.X <= normalizedVector2.X)
        {
            if (normalizedVector1.Y <= this.Y && this.Y <= normalizedVector2.Y)
            {
                return true;
            }
        }
        return false;
    }

    static Add(left, right)
    {
        return new Vector2(left.x + right.x, left.y + right.y);
    }

    static Sub(left, right)
    {
        return new Vector2(left.x - right.x, left.y - right.y);
    }

    static Mul(left, right)
    {
        return new Vector2(left.x * right, left.y * right);
    }

    static Div(left, right)
    {
        return new Vector2(left.x / right, left.y / right);
    }
}