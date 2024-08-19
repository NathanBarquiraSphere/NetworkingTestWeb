// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { Vec2 } from '../shape-template/vec2.ts';


export class Template {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Template {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsTemplate(bb:flatbuffers.ByteBuffer, obj?:Template):Template {
  return (obj || new Template()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsTemplate(bb:flatbuffers.ByteBuffer, obj?:Template):Template {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Template()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

name():string|null
name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

points(index: number, obj?:Vec2):Vec2|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new Vec2()).__init(this.bb!.__vector(this.bb_pos + offset) + index * 8, this.bb!) : null;
}

pointsLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startTemplate(builder:flatbuffers.Builder) {
  builder.startObject(2);
}

static addName(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, nameOffset, 0);
}

static addPoints(builder:flatbuffers.Builder, pointsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, pointsOffset, 0);
}

static startPointsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(8, numElems, 4);
}

static endTemplate(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static finishTemplateBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedTemplateBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}

static createTemplate(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset, pointsOffset:flatbuffers.Offset):flatbuffers.Offset {
  Template.startTemplate(builder);
  Template.addName(builder, nameOffset);
  Template.addPoints(builder, pointsOffset);
  return Template.endTemplate(builder);
}
}
