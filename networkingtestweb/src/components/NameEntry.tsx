import React, { useState, useEffect } from "react";
import { NetworkingManager } from "./../networking/NetworkingManager";
import { Button, HStack, ButtonGroup } from "@chakra-ui/react";
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from "@chakra-ui/react";

interface NameEntryProps {
  inNetworkingManager: NetworkingManager | null;
}

const NameEntry = ({ inNetworkingManager }: NameEntryProps) => {
  const [name, setName] = useState("");

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const sendNameRequest = () => {
    inNetworkingManager?.sendPlayerNameRequest(name);
  };

  return (
    <section className="ipcon">
      <div>
        <div>
          <HStack spacing={4}>
            // Click the text to edit
            {/* <Editable
              defaultValue="Enter Full Name"
              bg="white"
              onChange={handleNameChange}
              width="200px"
            >
              <EditablePreview />
              <EditableInput />
            </Editable> */}
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter Name"
            />
            <Button colorScheme="teal" onClick={sendNameRequest}>
              Send Name
            </Button>
          </HStack>
        </div>
      </div>
    </section>
  );
};

export default NameEntry;
