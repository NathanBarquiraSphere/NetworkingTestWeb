import React, { useState, useEffect, useRef } from "react";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  MenuButton,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { grey } from "@mui/material/colors";

function NavMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button
        as={IconButton}
        icon={<HamburgerIcon />}
        variant="outline"
        onClick={onOpen}
        color={"teal"}
        bg={"black"}
        borderColor={"teal"}
      ></Button>
      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={"teal"}>
          <DrawerCloseButton />
          <DrawerHeader>Navigate to</DrawerHeader>

          <DrawerBody>
            <ul>
              <li>Connection</li>
              <li>Enter Name</li>
              <li>Game</li>
            </ul>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NavMenu;
