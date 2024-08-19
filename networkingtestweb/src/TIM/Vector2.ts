import { Archive } from "./Archive";

export class Vector2
{
    public x: number;
    public y: number;

    constructor (x: number = 0, y: number = 0)
    {
        this.x = x;
        this.y = y;
    }

    public equals(Other: Vector2): boolean
    {
        return ((this.x === Other.x) && (this.y === Other.y));
    }

    public ToBytes() : Uint8Array
    {
        let Bytes = new Uint8Array(4);
        this.ToBytesAt(Bytes, 0);
        return Bytes;
    }

    public ToBytesAt(BytesIn: Uint8Array, Offset: number = 0): void
    {
        Archive.WriteFloat64(BytesIn, Offset, this.x);
        Archive.WriteFloat64(BytesIn, Offset + 8, this.y);
    }

    public static FromBytes(Bytes: Uint8Array, Offset: number = 0): Vector2
    {
        let Vec = new Vector2();
        if(Bytes.length < 16 + Offset)
        {
            return Vec;
        }
        
        Vec.x = Archive.ReadFloat64(Bytes, Offset + 0);
        Vec.y = Archive.ReadFloat64(Bytes, Offset + 8);
        return Vec;
    }
}
