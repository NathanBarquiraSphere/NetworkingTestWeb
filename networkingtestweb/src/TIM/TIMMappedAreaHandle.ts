import { Archive } from "./Archive";

export class FTIMMappedAreaHandle
{
	private Id : number;
	public static readonly Invalid: FTIMMappedAreaHandle = new FTIMMappedAreaHandle(-1);

	constructor(int? : number)
	{
        this.Id = int !== undefined ? int : -1;
    }

	public static Create(): FTIMMappedAreaHandle 
    {
        return new FTIMMappedAreaHandle();
    }

    public equals(Other: FTIMMappedAreaHandle): boolean
    {
        return Other['Id'] === this.Id;
    }

    public IsValid(): boolean
    {
        return !this.equals(FTIMMappedAreaHandle.Invalid);
    }

    public ToBytes() : Uint8Array
    {
        let Bytes = new Uint8Array(4);
        this.ToBytesAt(Bytes, 0);
        return Bytes;
    }

    public ToBytesAt(BytesIn: Uint8Array, Offset: number = 0): void
    {
        Archive.WriteInt32(BytesIn, 0, this.Id);
    }

    public static FromBytes(Bytes: Uint8Array, Offset: number = 0): FTIMMappedAreaHandle
    {
        if(Bytes.length < 4 + Offset)
        {
            return FTIMMappedAreaHandle.Invalid;
        }

        const Value =  Archive.ReadInt32(Bytes, Offset);
        return new FTIMMappedAreaHandle(Value);
    }
}
