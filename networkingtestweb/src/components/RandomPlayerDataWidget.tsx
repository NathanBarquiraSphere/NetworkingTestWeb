import React, { useState, useEffect } from 'react';
import { NetworkingManager } from "./../networking/NetworkingManager";
import { Message } from '../schema/wsschema/message';

interface RandomPlayerDataWidgetProps
{
    inNetworkingManager: NetworkingManager | null;
}

const RandomPlayerDataWidget = ({ inNetworkingManager }: RandomPlayerDataWidgetProps) =>
{
    const [stringData, setStringData] = useState("");

    useEffect(() =>
    {
        const handleClientDataResponse = (inStringData: string) =>
        {
            setStringData(inStringData);
        };

        const resetStringData = () =>
        {
            setStringData("");
        }

        // inNetworkingManager?.on(Message.ClientDataResponse.toString(), handleClientDataResponse);
        // inNetworkingManager?.on(Message.MediaPlaneToMobileLoginResponse.toString(), resetStringData);

        // cleaning up
        return () =>
        {
            // inNetworkingManager?.off(Message.ClientDataResponse.toString(), handleClientDataResponse);
            // inNetworkingManager?.off(Message.MediaPlaneToMobileLoginResponse.toString(), resetStringData);
        };
    }, [inNetworkingManager]);

    return <span className="resultText">Player Data = {stringData}</span>
}

export default RandomPlayerDataWidget;
