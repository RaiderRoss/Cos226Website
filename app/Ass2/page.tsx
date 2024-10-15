"use client";
import { useState, useEffect } from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Image } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import CodeBlock from '../../components/CodeBlock';

export default function Ass2Page() {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hasBeenOpened, setHasBeenOpened] = useState(false);


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
      <Modal
        size="5xl"
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#6b3b49]/70 backdrop-opacity-10",
          base: "border-[#6b3b49] bg-[#733939] dark:bg-[#733939] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#6b3b49]",
          footer: "border-t-[1px] border-[#6b3b49]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">No RickRoll this time


              </ModalHeader>

              <ModalBody>
                <video width="1000" height="800" autoPlay>
                  <source src="https://i.imgur.com/YWYV6Fd.mp4" type="video/mp4" />
                  <track kind="captions" srcLang="en" label="English" default />
                  Your browser does not support the video tag.
                </video>




              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#5e1a1a] shadow-lg shadow-red-950/20" onPress={() => {

                  onClose();
                  setHasBeenOpened(true);
                }}>
                  AGAIN?!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
