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
          backdrop: "bg-[#292f46]/70 backdrop-opacity-10",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">No RickRoll this time


              </ModalHeader>

              <ModalBody>
                <iframe
                  width="1000"
                  height="800"
                  src="https://www.youtube.com/embed/QIlOd1VVuo8?autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen>
                </iframe>




              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20" onPress={() => {

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
