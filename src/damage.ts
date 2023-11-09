class GameObject
{
    public frame: BinaryType;
    public x: number;
    public y: number;

    constructor(frame: BinaryType, x: number, y: number)
    {
        this.frame = frame;
        this.x = x;
        this.y = y;
    }

    public draw(ctx: CanvasRenderingContext2D){
        ctx.drawImage(this.frame, this.x, this.y);
    }
}