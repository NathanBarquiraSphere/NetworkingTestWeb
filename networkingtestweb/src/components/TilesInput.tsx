import React, { useState } from "react";
import { NetworkingManager } from "./../networking/NetworkingManager";
import {
  Flex,
  Grid,
  GridItem,
  Spacer,
  Box,
  HStack,
  Button,
  ButtonGroup,
  SimpleGrid,
  Center,
} from "@chakra-ui/react";

import {
  ArrowUpIcon,
  ArrowBackIcon,
  CloseIcon,
  AddIcon,
  CheckIcon,
  MinusIcon,
} from "@chakra-ui/icons";

import SvgArrow from "../assets/Icons/arrow.tsx";
import Svgtick from "../assets/Icons/tick.tsx";
import SvgCircle from "../assets/Icons/circle.tsx";
import Svgtriangle from "../assets/Icons/triangle.tsx";
import SvgLightning from "../assets/Icons/lightning.tsx";
import SvgBow from "../assets/Icons/bow.tsx";
import { useSpring, animated } from "react-spring";
import { Opacity } from "@mui/icons-material";
import { Fade } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

const Icons = [
  <SvgArrow />,
  <SvgBow />,
  <Svgtick />,
  <Svgtriangle />,
  <SvgLightning />,
  <SvgCircle />,
];

interface TilesInputProps {
  inNetworkingManager: NetworkingManager | null;
}

const TilesInput = ({ inNetworkingManager }: TilesInputProps) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  async function DelayAction() {
    await delay(200);
    setSelectedIndex(-1);
  }

  const handleButtonClick = (index: number) => {
    setSelectedIndex(index);
    inNetworkingManager?.sendShapeRequest(index);
    console.log("selected index = ", index);
    DelayAction();
  };

  const animate = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    // reset: false,
    // reverse: false,
    delay: 200,
    // config: { duration: 3000 },
  });

  // react method for sending index...
  useEffect(() => {
    return () => {
      inNetworkingManager?.sendShapeRequest(selectedIndex);
    };
  }, []);

  return (
    <>
      <SimpleGrid columns={2} spacing={10} mt="2%" pb="15%">
        {Icons.map((Icon, index) => (
          <Box
            key={index}
            bg={selectedIndex === index ? "teal" : "white"}
            height="150px"
            borderRadius="md"
            onClick={() => handleButtonClick(index)}
          >
            {Icon}
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
};

export default TilesInput;
