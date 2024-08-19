import React, { useState, useEffect } from "react";
import { NetworkingManager } from "./../networking/NetworkingManager";
import { Button, HStack, ButtonGroup } from "@chakra-ui/react";
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from "@chakra-ui/react";

interface ConnectWidgetProps {
  connectFunction: (address: string) => void;
}

const ConnectWidget = ({ connectFunction }: ConnectWidgetProps) => {
  const [address, setAddress] = useState("");

  const handleSetAddress = (event: any) => {
    setAddress(event.target.value);
  };

  const tryConnect = () => {
    const fullAddress = "wss://" + address + ":3004";
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
            <input
              type="text"
              value={address}
              onChange={handleSetAddress}
              placeholder="Enter ip address here"
            />
            <Button colorScheme="teal" onClick={tryConnect}>
              Connect To Server
            </Button>
          </HStack>
        </div>
      </div>
    </section>
  );
};

export default ConnectWidget;
