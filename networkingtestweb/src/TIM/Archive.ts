const int32 = new Int32Array(2);
const float32 = new Float32Array(int32.buffer);
const float64 = new Float64Array(int32.buffer);
const isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

export class Archive
{
    public static ReadInt8(BytesIn: Uint8Array, Offset: number): number {
      return Archive.ReadUint8(BytesIn, Offset) << 24 >> 24;
    }
  
    public static ReadUint8(BytesIn: Uint8Array, Offset: number): number {
      return BytesIn[Offset];
    }
  
    public static ReadInt16(BytesIn: Uint8Array, Offset: number): number {
      return Archive.ReadUint16(BytesIn, Offset) << 16 >> 16;
    }
  
    public static ReadUint16(BytesIn: Uint8Array, Offset: number): number {
      return BytesIn[Offset] | BytesIn[Offset + 1] << 8;
    }
  
    public static ReadInt32(BytesIn: Uint8Array, Offset: number): number {
      return BytesIn[Offset] | BytesIn[Offset + 1] << 8 | BytesIn[Offset + 2] << 16 | BytesIn[Offset + 3] << 24;
    }
  
    public static ReadUint32(BytesIn: Uint8Array, Offset: number): number {
      return Archive.ReadInt32(BytesIn, Offset) >>> 0;
    }
  
    public static ReadInt64(BytesIn: Uint8Array, Offset: number): bigint {
      return BigInt.asIntN(64, BigInt(Archive.ReadUint32(BytesIn, Offset)) + (BigInt(Archive.ReadUint32(BytesIn, Offset + 4)) << BigInt(32)));
    }
  
    public static ReadUint64(BytesIn: Uint8Array, Offset: number): bigint {
      return BigInt.asUintN(64, BigInt(Archive.ReadUint32(BytesIn, Offset)) + (BigInt(Archive.ReadUint32(BytesIn, Offset + 4)) << BigInt(32)));
    }
  
    public static ReadFloat32(BytesIn: Uint8Array, Offset: number): number {
        int32[0] = Archive.ReadInt32(BytesIn, Offset);
        return float32[0];
    }
  
    public static ReadFloat64(BytesIn: Uint8Array, Offset: number): number {
      int32[isLittleEndian ? 0 : 1] = Archive.ReadInt32(BytesIn, Offset);
      int32[isLittleEndian ? 1 : 0] = Archive.ReadInt32(BytesIn, Offset + 4);
      return float64[0];
    }
  
    public static WriteInt8(BytesIn: Uint8Array, Offset: number, Value: number): void {
      BytesIn[Offset] = Value;
    }
  
    public static WriteUint8(BytesIn: Uint8Array, Offset: number, Value: number): void {
      BytesIn[Offset] = Value;
    }
  
    public static WriteInt16(BytesIn: Uint8Array, Offset: number, Value: number): void {
      BytesIn[Offset] = Value;
      BytesIn[Offset + 1] = Value >> 8;
    }
  
    public static WriteUint16(BytesIn: Uint8Array, Offset: number, Value: number): void {
      BytesIn[Offset] = Value;
      BytesIn[Offset + 1] = Value >> 8;
    }
  
    public static WriteInt32(BytesIn: Uint8Array, Offset: number, Value: number): void {
      BytesIn[Offset] = Value;
      BytesIn[Offset + 1] = Value >> 8;
      BytesIn[Offset + 2] = Value >> 16;
      BytesIn[Offset + 3] = Value >> 24;
    }
  
    public static WriteUint32(BytesIn: Uint8Array, Offset: number, Value: number): void {
      BytesIn[Offset] = Value;
      BytesIn[Offset + 1] = Value >> 8;
      BytesIn[Offset + 2] = Value >> 16;
      BytesIn[Offset + 3] = Value >> 24;
    }
  
    public static WriteInt64(BytesIn: Uint8Array, Offset: number, Value: bigint): void {
      Archive.WriteInt32(BytesIn, Offset, Number(BigInt.asIntN(32, Value)));
      Archive.WriteInt32(BytesIn, Offset + 4, Number(BigInt.asIntN(32, Value >> BigInt(32))));
    }
  
    public static WriteUint64(BytesIn: Uint8Array, Offset: number, Value: bigint): void {
      Archive.WriteUint32(BytesIn, Offset, Number(BigInt.asUintN(32, Value)));
      Archive.WriteUint32(BytesIn, Offset + 4, Number(BigInt.asUintN(32, Value >> BigInt(32))));
    }
  
    public static WriteFloat32(BytesIn: Uint8Array, Offset: number, Value: number): void {
      float32[0] = Value;
      Archive.WriteInt32(BytesIn, Offset, int32[0]);
    }
  
    public static WriteFloat64(BytesIn: Uint8Array, Offset: number, Value: number): void {
      float64[0] = Value;
      Archive.WriteInt32(BytesIn, Offset, int32[isLittleEndian ? 0 : 1]);
      Archive.WriteInt32(BytesIn, Offset + 4, int32[isLittleEndian ? 1 : 0]);
    }
}
