import { Archive } from "./Archive";
import { FTIMMappedAreaHandle } from "./TIMMappedAreaHandle"
import { Vector2 } from "./Vector2";

export enum ETriggerEvent
{
	None		= (0x0),
	// Triggering occurred after one or more processing ticks
	Triggered	= (1 << 0),	// ETriggerState (None -> Triggered, Ongoing -> Triggered, Triggered -> Triggered)
	// An event has occurred that has begun Trigger evaluation. Note: Triggered may also occur this frame, but this event will always be fired first.
	Started		= (1 << 1),	// ETriggerState (None -> Ongoing, None -> Triggered)
	// Triggering is still being processed. For example, an action with a "Press and Hold" trigger
	// will be "Ongoing" while the user is holding down the key but the time threshold has not been met yet. 
	Ongoing		= (1 << 2),	// ETriggerState (Ongoing -> Ongoing)
	// Triggering has been canceled. For example,  the user has let go of a key before the "Press and Hold" time threshold.
	// The action has started to be evaluated, but never completed. 
	Canceled	= (1 << 3),	// ETriggerState (Ongoing -> None)
	// The trigger state has transitioned from Triggered to None this frame, i.e. Triggering has finished.
	// Note: Using this event restricts you to one set of triggers for Started/Completed events. You may prefer two actions, each with its own trigger rules.
	// Completed will not fire if any trigger reports Ongoing on the same frame, but both should fire. e.g. Tick 2 of Hold (= Ongoing) + Pressed (= None) combo will raise Ongoing event only.
	Completed	= (1 << 4),	// ETriggerState (Triggered -> None)
}

export class FTIMInputEvent
{
	constructor(AreaHandle?: FTIMMappedAreaHandle
		, Index?: number
		, Location?: Vector2
		, EventType?: ETriggerEvent
		, Time?: number)
	{
		this.AreaHandle = AreaHandle !== undefined ? AreaHandle : FTIMMappedAreaHandle.Invalid;
		this.Index = Index !== undefined ? Index : 0;
		this.Location = Location !== undefined ? Location : new Vector2();
		this.EventType = EventType !== undefined ? EventType : ETriggerEvent.None;
		this.Time = Time !== undefined ? Time : 0.0;
	}

	public AreaHandle: FTIMMappedAreaHandle;
	public Index: number;
	public Location: Vector2;
	public EventType: ETriggerEvent;
	public Time: number;

	public ToBytes(): Uint8Array
	{
		let Bytes = new Uint8Array(29);
		this.ToBytesAt(Bytes, 0);
		return Bytes;
	}

	public ToBytesAt(BytesIn: Uint8Array, Offset: number = 0): void
	{
		this.AreaHandle.ToBytesAt(BytesIn, Offset + 0);
		Archive.WriteInt32(BytesIn, Offset + 4, this.Index);
		this.Location.ToBytesAt(BytesIn, Offset + 8);
		Archive.WriteInt8(BytesIn, Offset + 24, this.EventType);
		Archive.WriteFloat32(BytesIn, Offset + 25, this.Time);
	}

	public static FromBytes(Bytes: Uint8Array, Offset: number = 0): FTIMInputEvent
	{
		let InputEvent = new FTIMInputEvent();
		if(Bytes.length < Offset + 29)
		{
			return InputEvent;
		}

		InputEvent.AreaHandle = FTIMMappedAreaHandle.FromBytes(Bytes);
		InputEvent.Index = Archive.ReadInt32(Bytes, Offset + 4);
		InputEvent.Location = Vector2.FromBytes(Bytes, Offset + 8);
		InputEvent.EventType = Archive.ReadUint8(Bytes, Offset + 24);
		InputEvent.Time = Archive.ReadFloat32(Bytes, Offset + 25);

		return InputEvent;
	}

}
