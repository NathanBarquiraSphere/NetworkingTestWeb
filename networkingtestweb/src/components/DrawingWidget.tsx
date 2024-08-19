import { background } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { NetworkingManager } from "./../networking/NetworkingManager";
import { Message } from "../schema/wsschema/message";

interface DrawingProps {
  drawEndFunction: () => void;
  inNetworkingManager: NetworkingManager | null;
}

const UserInputKey = "UserInput";

function storageAvailable(type: 'localStorage' | 'sessionStorage') {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function AddNewInput(X: number, Y: number) {
  let newInput = {
    Input: [{ x: X, y: Y }],
  };

  let newInputString = JSON.stringify(newInput);
  localStorage.setItem(UserInputKey, newInputString);
}

function AppendNexInput(X: number, Y: number) {
  let existingInputString = localStorage.getItem(UserInputKey);

  if (typeof existingInputString === "string") {
    let existingInputObj = JSON.parse(existingInputString);
    existingInputObj["Input"].push({ x: X, y: Y });

    let newInputString = JSON.stringify(existingInputObj);

    localStorage.setItem(UserInputKey, newInputString);
  }
}

const canvasWidth = window.innerHeight;
const canvasHeight = window.innerHeight;

const DrawingWidget = ({
  drawEndFunction,
  inNetworkingManager,
  }: DrawingProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasRect = useRef<DOMRect | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth /*setLineWidth*/] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity /*setLineOpacity*/] = useState(1.0);

  const setLineColorFromTeamId = (teamId: number) => {
    switch (teamId) {
      case 0: {
        setLineColor("red");
        break;
      }
      case 1: {
        setLineColor("blue");
        break;
      }
      default: {
        setLineColor("black");
        break;
      }
    }
  };

  useEffect(() => {
    // inNetworkingManager?.on(
    //   Message.MediaPlaneToMobileLoginResponse.toString(),
    //   setLineColorFromTeamId
    // );

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = lineOpacity;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctxRef.current = ctx;
        canvasRect.current = canvas.getBoundingClientRect();
      }
    }

    return () => {
      // inNetworkingManager?.off(
      //   Message.MediaPlaneToMobileLoginResponse.toString(),
      //   setLineColorFromTeamId
      // );
    };
  }, [lineColor, lineOpacity, lineWidth, inNetworkingManager]);

  // Function for starting the drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current || !canvasRect.current) {
      return;
    }

    // Reseting all the info
    if (canvasRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    if (storageAvailable("localStorage")) {
      localStorage.removeItem(UserInputKey);
    }

    let x = ('touches' in e)
      ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX - canvasRect.current.left 
      : (e.nativeEvent as MouseEvent).offsetX;
    let y = ('touches' in e)
      ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY - canvasRect.current.top
      : (e.nativeEvent as MouseEvent).offsetY;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  // Function for ending the drawing
  const endDrawing = () => {
    ctxRef.current?.closePath();
    setIsDrawing(false);

    drawEndFunction();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current || !canvasRect.current) {
      return;
    }

    let x = ('touches' in e)
      ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX - canvasRect.current.left
      : (e.nativeEvent as MouseEvent).offsetX;
    let y = ('touches' in e)
      ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY - canvasRect.current.top
      : (e.nativeEvent as MouseEvent).offsetY;
    
    if (storageAvailable("localStorage")) {
      // If no user input exists create a new one
      if (!localStorage.getItem(UserInputKey)) {
        AddNewInput(x, y);
      }
      // If it exists append to existing data
      else {
        AppendNexInput(x, y);
      }
    }

    ctxRef.current.lineTo(x, y);   
    ctxRef.current.stroke();
  }; 

  return (
    <div className="draw-area">
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={endDrawing}
        onTouchMove={draw}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  );
};

export default DrawingWidget;
