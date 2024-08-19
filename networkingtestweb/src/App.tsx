// App.js
import { useEffect, useRef, useState } from "react";
import React from "react";
// import Menu from "./components/Menu";
// import { flatbuffers } from 'flatbuffers';
import "./App.css";
import Gyroscope from "./components/Gyroscope";
import NameEntry from "./components/NameEntry";
import InputSelect from "./components/InputSelect";
import TilesInput from "./components/TilesInput";
import TapnSlashInput from "./components/TapnSlashInput";
import DrawInput from "./components/DrawInput";
import SuccessOverlay from "./components/SuccessOverlay";
import ScoreWidget from "./components/ScoreWidget";
import ConnectWidget from "./components/ConnectWidget";
import { NetworkingManager } from "./networking/NetworkingManager";
import { Message } from "./schema/wsschema/message";
import { TemplateManager } from "./Template/TemplateManager";
import { Result, Point, DollarRecognizer } from "./Template/Recognizer";
import {
  HStack,
  VStack,
  Grid,
  GridItem,
  ButtonGroup,
  Button,
  Box,
  Heading,
  Center,
  Spacer,
  Container,
} from "@chakra-ui/react";
import AddTemplateWidget from "./components/AddTemplate";
import DrawingWidget from "./components/DrawingWidget";
import RandomPlayerDataWidget from "./components/RandomPlayerDataWidget";
import NavMenu from "./components/NavMenu";
import ConnectBigDomeWidget from "./components/ConnectBigDomeWidget"

const UserInputKey = "UserInput";

function storageAvailable(type) {
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

const App = () => {
  const [drawResult, setDrawResult] = useState("No Match.");
  const [score, setScore] = useState(0);
  const [scoreText, setScoreText] = useState("Score: ");
  const [textColor, setTextColor] = useState("red.500");
  const [Recognizer] = useState<DollarRecognizer>(new DollarRecognizer());
  const templateManager = new TemplateManager();

  // networking stuff
  const [networkingManager, setNetworkingManager] =
    useState<NetworkingManager | null>(null);

  const HandleLineColor = (teamId: number) => {
    console.log("received teamid = ", teamId, " from event emit");
    switch (teamId) {
      case 0: {
        setTextColor("red.500");
        break;
      }
      case 1: {
        setTextColor("blue.500");
        break;
      }
      default: {
        setTextColor("yellow.500");
        break;
      }
    }
  };

  const setupNetworkingBindings = (inNetworkingManager: NetworkingManager) => {
    if (networkingManager) {
      // networkingManager.addListener(
      //   Message.MediaPlaneToMobileLoginResponse.toString(),
      //   HandleLineColor
      // );
      console.log("setup bindings");
    }
  };

  // networking function
  // to be passed in as a prop to a component
  const connectToServer = (address: string) => {
    const newNetworkingManager = new NetworkingManager(address);
    setupNetworkingBindings(newNetworkingManager);
    newNetworkingManager
      .connect()
      .then(() => {
        setNetworkingManager(newNetworkingManager);
      })
      .catch(() => {
        console.log("failed to connect");
      });
  };

  // Initialization when the component
  // mounts for the first time
  useEffect(() => {
    templateManager.LoadTemplates().then((result) => {
      for (let i = 0; i < result.length; i++) {
        Recognizer.AddGesture(result[i]);
      }
    });
  });

  // TODO maybe look into a more robust way to handle this...
  const ShapeToEnum = {
    Arrow: 0,
    Parenthesis: 1,
    Check: 2,
    Triangle: 3,
    Pigtail: 4,
    Circle: 5,
  };

  // Function for ending the drawing
  const endDrawing = () => {
    let pointArray = new Array();

    if (storageAvailable("localStorage")) {
      if (!localStorage.getItem(UserInputKey)) {
        return;
      }
      let existingInputString = localStorage.getItem(UserInputKey);

      let existingInputObj = JSON.parse(existingInputString);

      for (let i = 0; i < existingInputObj["Input"].length; i++) {
        let X = existingInputObj["Input"][i]["x"];
        let Y = existingInputObj["Input"][i]["y"];

        let newPoint = new Point(X, Y);
        pointArray.push(newPoint);
      }
    }

    let DrawResult = Recognizer.Recognize(pointArray, false);

    if (DrawResult.Score >= 0.5) {
      let enumResult = ShapeToEnum[DrawResult.Name];
      // sendShapeRequest(enumResult);
      networkingManager?.sendShapeRequest(enumResult);
      setDrawResult(DrawResult.Name);
    } else {
      setDrawResult("No Match.");
    }
  };

  const AddTemplate = (TemplateName: string) => {
    templateManager.SaveTemplate(TemplateName);
  };

  const AddScore = (x) => {
    setScore(score + x);
    setScoreText("Score: " + score);
  };

  const AddSetScore = () => {};

  const selectHandle = (index: number) => {
    setIndex(index);
  };
  const [_index, setIndex] = useState(0);
  const inputTypes = [
    <DrawingWidget drawEndFunction={endDrawing} inNetworkingManager={networkingManager} />,
    <TilesInput inNetworkingManager={networkingManager} />,
    <TapnSlashInput />,
  ];

  return (
    <Container className="App" maxW={"sm"}>
      <section className="ipcon">
        <Grid
          templateRows="repeat(4, 0.6fr)"
          templateColumns="repeat(5, 1fr)"
          templateAreas={`"Heading" "Connections" "InputSelect" "Main"`}
          gap={4}
          p={"10px"}
        >
          <GridItem rowSpan={1} colSpan={1} area="Heading" mt="1%">
            <NavMenu />
          </GridItem>
          <GridItem rowSpan={1} colStart={2} colEnd={5} area="Heading" mt="1%">
            <Center>
              <Heading color={textColor}>PreFE</Heading>
            </Center>
          </GridItem>

          <GridItem area="Connections" rowSpan={2} colSpan={5}>
            <VStack alignItems={"center"}>
              <Box>
                <ConnectWidget connectFunction={connectToServer} />
                <NameEntry inNetworkingManager={networkingManager} />
                {/* {<AddTemplateWidget AddTemplateFunction={AddTemplate} />} */}
                <ConnectBigDomeWidget connectFunction={connectToServer} />
              </Box>
            </VStack>
          </GridItem>

          <GridItem area="InputSelect" rowSpan={3} colSpan={5}>
            <VStack alignItems={"center"}>
              <InputSelect
                Names={["Draw", "Tiles", "Tap n Slash"]}
                onSelect={selectHandle}
              />
              <SuccessOverlay inNetworkingManager={networkingManager} />
              <span color={textColor} className="resultText">
                {drawResult}
              </span>
              <ScoreWidget inNetworkingManager={networkingManager} />
              <RandomPlayerDataWidget inNetworkingManager={networkingManager} />
            </VStack>
          </GridItem>

          <GridItem area="Main" maxH="600px" rowSpan={4} colSpan={5}>
            {inputTypes[_index]}
          </GridItem>
        </Grid>
      </section>
    </Container>
  );

  // <button type="button" onClick={AddSetScore}>Add Template</button>
};

export default App;
