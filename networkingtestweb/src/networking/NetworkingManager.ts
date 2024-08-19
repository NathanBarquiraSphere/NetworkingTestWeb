import * as flatbuffers from 'flatbuffers';
import { ShapeRequest } from './../schema/wsschema/shape-request';
import { TypeWrapper } from '../schema/wsschema/type-wrapper';
import { Message } from '../schema/wsschema/message';
import { PingServerRequest } from '../schema/wsschema/ping-server-request';
import { ClientLoginResponse } from '../schema/wsschema/client-login-response';
import { PhaseResponse } from '../schema/wsschema/phase-response';
import { PhaseEnums } from '../schema/wsschema/phase-enums'
import { PlayerNameRequest } from '../schema/wsschema/player-name-request';
import { BaseNetworkingManager } from './BaseNetworkingManager';

// similar to ENET client overrides.
// just create the senders / message handlers here.
export class NetworkingManager extends BaseNetworkingManager {


    // START SENDERS
    public sendPlayerNameRequest = (inName: string) =>
    {
        const builder = new flatbuffers.Builder(256);

        const builtString = builder.createString(inName);

        PlayerNameRequest.startPlayerNameRequest(builder);
        PlayerNameRequest.addSessionId(builder, this.sessionId);
        PlayerNameRequest.addName(builder, builtString);
        const builtPlayerNameRequest = PlayerNameRequest.endPlayerNameRequest(builder);

        TypeWrapper.startTypeWrapper(builder);
        TypeWrapper.addMessageType(builder, Message.PlayerNameRequest);
        TypeWrapper.addMessage(builder, builtPlayerNameRequest);
        const BuiltTypeWrapper = TypeWrapper.endTypeWrapper(builder);

        builder.finish(BuiltTypeWrapper);
        const buf = builder.asUint8Array();
        
        this.socket?.send(buf);
    }

    public sendShapeRequest = (shapeInt : number) => 
    {
        const builder = new flatbuffers.Builder(256);

        ShapeRequest.startShapeRequest(builder);
        ShapeRequest.addShapeId(builder, shapeInt);
        ShapeRequest.addSessionId(builder, this.sessionId);
        const builtShapeRequest = ShapeRequest.endShapeRequest(builder);

        TypeWrapper.startTypeWrapper(builder);
        TypeWrapper.addMessageType(builder, Message.ShapeRequest);
        TypeWrapper.addMessage(builder, builtShapeRequest);
        const BuiltTypeWrapper = TypeWrapper.endTypeWrapper(builder);

        builder.finish(BuiltTypeWrapper);
        const buf = builder.asUint8Array();
        
        this.socket?.send(buf);
    }

    public sendPingServerRequest = () =>
    {
        const builder = new flatbuffers.Builder(256);

        PingServerRequest.startPingServerRequest(builder);
        PingServerRequest.addSessionId(builder, this.sessionId);
        const pingServerRequest = PingServerRequest.endPingServerRequest(builder);

        TypeWrapper.startTypeWrapper(builder);
        TypeWrapper.addMessageType(builder, Message.PingServerRequest);
        TypeWrapper.addMessage(builder, pingServerRequest);
        const typeWrapper = TypeWrapper.endTypeWrapper(builder);

        builder.finish(typeWrapper);

        const buf = builder.asUint8Array();

        this.socket?.send(buf);
    }

    public sendShapeRequestString = (shapeInt: number) =>
    {
        const message = { id: this.sessionId, type: "shape", value: shapeInt };
        this.socket?.send(JSON.stringify(message));
    }

    public sendOrientationRequestString = (inPitch: number, inYaw: number) => {
		const message = { id: this.sessionId, type: "orientation", pitch: inPitch, yaw: inYaw};
		this.socket?.send(JSON.stringify(message));
	}

    public sendResetOrientationRequestString = () => {
        const message = { id: this.sessionId, type: 'resetOrientation'};
        this.socket?.send(JSON.stringify(message));
    }

    public sendWillMessage = () => {
        const message = {id: this.sessionId, type: 'Will', value: 'hello'};
        this.socket?.send(JSON.stringify(message));
    }
    // END SENDERS

    

    // START MESSAGE HANDLERS:
    protected handleClientLoginResponse = (typeWrapper: TypeWrapper) =>
    {
        const clientLoginResponseMessage = new ClientLoginResponse();
        typeWrapper.message(clientLoginResponseMessage);

        this.sessionId = clientLoginResponseMessage.assignedSessionId();

        console.log('received sessionId = ', this.sessionId);

        this.emit(Message.ClientLoginResponse.toString(), this.sessionId);
    }

    protected handlePhaseResponse = (typeWrapper: TypeWrapper) =>
    {
        const phaseResponse = new PhaseResponse();
        typeWrapper.message(phaseResponse);

        console.log('received phase response = ', phaseResponse.phaseId());

        this.emit(Message.PhaseResponse.toString(),  PhaseEnums[phaseResponse.phaseId()]);
    }
    // END MESSAGE HANDLERS



    // START BASE CLASS OVERRIDE
    protected handleBinaryMessage(data: ArrayBuffer): void
    {
        console.log('Received binary message: ', data);
        const myBuf = new Uint8Array(data);
        const buf = new flatbuffers.ByteBuffer(myBuf);

        const root = TypeWrapper.getRootAsTypeWrapper(buf);
        const messageType = root.messageType();
        console.log('message type = ', messageType);

        switch (messageType)
        {
            case Message.PhaseResponse:
            {
                this.handlePhaseResponse(root);
                break;
            }
            default:
            {
                super.handleBinaryMessage(data);
            }
        }
    }

    protected handleStringMessage(data: string)
    {
        console.log('Received string message: ', data);

        const obj = JSON.parse(data);
        if (obj.type === "team")
        {
            console.log("received team message");
        }
        else
        {
            super.handleStringMessage(data);
        }
    };
    // END BASE CLASS OVERIDE
}