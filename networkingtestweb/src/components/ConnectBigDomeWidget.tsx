import React, { useState, useEffect } from "react";
import { NetworkingManager } from "./../networking/NetworkingManager";
import { Button, HStack, ButtonGroup } from "@chakra-ui/react";
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from "@chakra-ui/react";

interface ConnectBigDomeWidgetProps {
  connectFunction: (address: string) => void;
}

const ConnectWidget = ({ connectFunction }: ConnectBigDomeWidgetProps) => {

  const tryConnectToBigDome = () => {
    const fullAddress = "wss://10.232.64.22:3004";
    connectFunction(fullAddress);
  };

  return (
    <section className="ipcon">
      <div>
        <div>
          <HStack spacing={4}>
            {/* <Editable
              defaultValue="Enter IP Address"
              bg="white"
              onChange={handleSetAddress}
              width="200px"
            >
              <EditablePreview />
              <EditableInput />
            </Editable> */}
            <Button style={{width: '365px'}} colorScheme="teal" onClick={tryConnectToBigDome}>
              Connect To Big Dome
            </Button>
          </HStack>
        </div>
      </div>
    </section>
  );
};

export default ConnectWidget;
