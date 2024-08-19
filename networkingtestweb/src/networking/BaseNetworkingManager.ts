import * as flatbuffers from 'flatbuffers';
import { TypeWrapper } from '../schema/wsschema/type-wrapper';
import { Message } from '../schema/wsschema/message';
import { PingServerRequest } from '../schema/wsschema/ping-server-request';
import { EventEmitter } from 'events';
import { ClientLoginResponse } from '../schema/wsschema/client-login-response';

export class BaseNetworkingManager extends EventEmitter {

    protected socket: WebSocket | null = null;
    protected sessionId: number = -1;

    protected constructor(private url: string)
    {
        super();
    }

    public sendPingServerRequest = (): void =>
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

    public connect = (): Promise<void> =>
    {
        return new Promise((resolve, reject) =>
        {
            this.socket = new WebSocket(this.url);

            // setting the binary type to an array buffer
            this.socket.binaryType = 'arraybuffer';

            // socket bindings
            this.socket.onopen = () => 
            {
                alert("Connected to websocket with ip = " + this.url);
                resolve();
            };
            this.socket.onerror = (error) => 
            {
                alert("Could not connect to ip = " + this.url);
                reject(error);
            };
            this.socket.onmessage = (event) => 
            {
                this.handleMessage(event.data);
            };
            this.socket.onclose = () =>
            {
                console.log('websocket connection closed');
            };
        })
    };

    protected handleMessage = (data: any): void =>
    {
        if (typeof data === 'string')
        {
            this.handleStringMessage(data);
        }
        else 
        {
            this.handleBinaryMessage(data);
        }
    };

    protected handleClientLoginResponse = (typeWrapper: TypeWrapper): void =>
    {
        const clientLoginResponseMessage = new ClientLoginResponse();
        typeWrapper.message(clientLoginResponseMessage);

        this.sessionId = clientLoginResponseMessage.assignedSessionId();

        console.log('received sessionId = ', this.sessionId);

        this.emit(Message.ClientLoginResponse.toString(), this.sessionId);
    }

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
            case Message.ClientLoginResponse:
            {
                this.handleClientLoginResponse(root);
                break;
            }
            default:
            {
                console.log('unhandled binary message of type = ', messageType);
            }
        }
    };

    protected handleStringMessage(data: string): void
    {
        console.log('Received string message: ', data);

        const obj = JSON.parse(data);
        if (obj.type === "login")
        {
            this.sessionId = obj.value;
            console.log("set sessionId to = " + this.sessionId);
        }
    }; 
}