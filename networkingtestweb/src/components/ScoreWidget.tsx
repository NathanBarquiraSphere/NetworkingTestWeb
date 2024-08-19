import React, { useState, useEffect } from 'react';
import { NetworkingManager } from "./../networking/NetworkingManager";
import { Message } from '../schema/wsschema/message';

interface ScoreWidgetProps
{
    inNetworkingManager: NetworkingManager | null;
}

const ScoreWidget = ({ inNetworkingManager }: ScoreWidgetProps) =>
{
    const [score, setScore] = useState(0);

    useEffect(() =>
    {
        const handleScoreEvent = (inScore: number) =>
        {
            setScore((prevScore) => prevScore + inScore);
        };

        const resetScore = () =>
        {
            setScore(0);
        }

        // inNetworkingManager?.on(Message.ScoreUpdateResponse.toString(), handleScoreEvent);
        // inNetworkingManager?.on(Message.MediaPlaneToMobileLoginResponse.toString(), resetScore);

        // cleaning up
        return () =>
        {
            // inNetworkingManager?.off(Message.ScoreUpdateResponse.toString(), handleScoreEvent);
            // inNetworkingManager?.off(Message.MediaPlaneToMobileLoginResponse.toString(), resetScore);
        };
    }, [inNetworkingManager]);

    return <span className="resultText">Score = {score}</span>
}

export default ScoreWidget;
