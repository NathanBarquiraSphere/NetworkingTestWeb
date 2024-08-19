import React, { useState, useEffect } from 'react';
import { NetworkingManager } from "./../networking/NetworkingManager";

interface GyroscopeProps
{
    inNetworkingManager: NetworkingManager | null;
}

const Gyroscope = ({ inNetworkingManager }: GyroscopeProps) => {

    const [orientation, setOrientation] = useState({ yaw: 0, pitch: 0, roll: 0});
    const [hasStarted, setHasStarted] = useState(false);

    const handleOrientationEvent = (event: any) => {
        setOrientation({
            yaw: event.alpha ? event.alpha.toFixed(2) : 0,
            pitch: event.beta ? event.beta.toFixed(2) : 0,
            roll: event.gamma ? event.gamma.toFixed(2) : 0,
        });
        inNetworkingManager?.sendOrientationRequestString(event.beta, event.alpha);
    };

    const startRecording = () => {
        if (!hasStarted) {
            window.addEventListener('deviceorientation', handleOrientationEvent);
            setHasStarted(true);
            alert('Started gyroscope recording');

            // this is to request permission for IMU access on IOS
            if (
                DeviceMotionEvent &&
                typeof DeviceMotionEvent.requestPermission === "function"
              ) {
                DeviceMotionEvent.requestPermission();
              }
        };
    };

    const stopRecording = () => {
        if (hasStarted) {
            window.removeEventListener('deviceorientation', handleOrientationEvent);
            setHasStarted(false);
            alert('Stopped gyroscope recording');
        };
    };

    const textColor = {
        color: 'white'
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientationEvent);
        };
    }, []);

    return (
        <section className="ipcon">   
        <div>
			<div>
				<button onClick={startRecording}>Start IMU Readings</button>
				<button onClick={stopRecording}>Stop IMU Readings</button>
				<p style={textColor}>
                    Pitch: {orientation.pitch} Yaw: {orientation.yaw}  Roll: {orientation.roll} 
                </p>
			</div>
            
            <div>
                <button onClick={inNetworkingManager?.SendResetOrientationRequestString}>Reset Pointer</button>
            </div>
        </div>  
        </section>
    )
}

export default Gyroscope;
