"use client";
import { useState, useEffect } from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Image } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import CodeBlock from '../../components/CodeBlock';

export default function Ass2Page() {


  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isVideoVisible, setVideoVisible] = useState(false);

  const onOpen = () => {
    setVideoVisible(true);
  };

  const handleVideoEnd = () => {
    setHasBeenOpened(true);
    setVideoVisible(false);
  };



  return (
    <div className="flex flex-col items-center text-start">
      <br />
      <Accordion defaultExpandedKeys={["1"]} selectionMode="multiple">
        <AccordionItem key="1" aria-label="User Info" title="Chapter 0: Details">
          <p>u23545080</p>
          <p>Aidan McKenzie</p>
        </AccordionItem>

        <AccordionItem key="2" title="What is the output of the following code?">
        </AccordionItem>

      </Accordion>
      <Button onPress={onOpen} color="secondary">Show Results</Button>
      {isVideoVisible && (
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        >
          <video
            autoPlay
            onEnded={handleVideoEnd}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          >
            <source src="https://i.imgur.com/Y3JEqNw.mp4" type="video/mp4" />
            <track kind="captions" srcLang="en" label="English" default />
            Your browser does not support the video tag.
          </video>
        </div>
      )}



      {hasBeenOpened && (
        <>
          <br />
          <Button color="danger" onPress={() => setHasBeenOpened(false)}>Hide Results</Button>
          <br />
          <Image
            isBlurred
            width={800}
            height={400}
            alt="Results"
            src={"/modal/results.png"}
          />

          <br />
        </>
      )}
    </div>
  );
}
