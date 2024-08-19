import React, { useState } from "react";
import { HStack, Grid, GridItem, ButtonGroup, Button } from "@chakra-ui/react";

interface Props {
  Names: string[];
  onSelect: (index: number) => void;
}

const InputSelect = ({ Names, onSelect }: Props) => {
  const [selectIndex, setSelectedIndex] = useState(1);
  return (
    <HStack spacing={4} justifyContent="space-evenly">
      <ButtonGroup isAttached variant="outline">
        {Names.map((Name, index) => (
          <Button
            key={index}
            colorScheme="teal"
            width="110px"
            onClick={() => onSelect(index)}
          >
            {Name}
          </Button>
        ))}
      </ButtonGroup>
    </HStack>
  );
};

export default InputSelect;
