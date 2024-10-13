"use client";
import { useState, useEffect, use } from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Image } from "@nextui-org/react";
import { Slider } from "@nextui-org/slider";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

export default function Practical6Page() {
  const [option, setOption] = useState(0);
  const [operation, setOperation] = useState(0);
  const [contention, setContention] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); // Initialize audio as null
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  useEffect(() => {
    // Create the Audio instance in useEffect to avoid server-side issues
    const audioInstance = new Audio('/modal/sound.mp3');
    setAudio(audioInstance);

    return () => {
      // Cleanup audio instance if needed
      audioInstance.pause();
      audioInstance.src = '';
    };
  }, []);

  useEffect(() => {
    if (isOpen && audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  }, [isOpen, audio]);

  const getImageSrc = () => {
    const folder = option === 0 ? "100" : option === 1 ? "500" : "1000";
    const level = contention === 0 ? "high" : contention === 1 ? "medium" : "low";
    const op = operation === 0 ? "addOnly" : operation === 1 ? "addAndContains" : operation === 2 ? "addAndRemove" : "addAndRemoveAndContains";
    return `../${folder}Operations/${op}/combined_${level}_scenarios.png`;
  };

  return (
    <div className="flex flex-col items-center text-start">
      <br />
      <Accordion defaultExpandedKeys={["1"]} selectionMode="multiple">
        <AccordionItem key="1" aria-label="User Info" title="Chapter 0: Details">
          <p>u23545080</p>
          <p>Aidan McKenzie</p>
        </AccordionItem>

        <AccordionItem key="2" aria-label="Chapter 1" title="Chapter 1: The Dawn of Threads">
          <p>In the beginning, there was one lone process, working tirelessly, step after sequential step, in a monotonous, predictable rhythm. It knew nothing of concurrency, of the tangled webs that could be spun by parallel threads of execution. Its world was simple, straightforward—a single path to follow.</p>
          <p>But as the demand grew, so did the complexity. One process could no longer bear the burden alone. It needed help—reinforcements. And so, from the depths of the CPU, threads emerged. These threads, both fragile and powerful, promised efficiency, speed, and synchronization. But they also came with danger: the looming spectre of race conditions, deadlocks, and starvation, ready to devour any who dared tread recklessly in this newfound world.</p>
          <p>Now, the time has come to explore this perilous terrain, where operations occur not one after the other, but in parallel—each a ticking bomb of potential chaos. The following report will journey through the intricacies of concurrent systems, where many threads fight for control, and only the well-coordinated survive.</p>
          <p>Welcome to the battlefield of concurrency.</p>
        </AccordionItem>

        <AccordionItem key="3" aria-label="Chapter 2" title="Chapter 2: The Trials of Synchronization">
          <p>The battlefield had been set. The lone process was no more—replaced by a legion of threads, each vying for control, each a potential ally or enemy depending on how they were synchronized. The promise of speed and efficiency beckoned, but only for those threads that played by the rules of coordination. And so, the tests began.</p>
          <p className="font-semibold">The Arena: Contention Types</p>
          <p>To understand how threads behaved under different conditions, I set up the experiments like a gladiator tournament—throwing my threads into increasingly chaotic arenas. Some were pitted against light contention, where few resources were shared, and the race for control was mild. Others were plunged into the fiery pits of heavy contention, where every thread clawed at the same limited resources, eager to claim dominance.</p>
          <p className="font-semibold">The Results: Plots of Chaos</p>
          <p>Once the tests had run their course, the battlefield lay strewn with the wreckage of threads—some victorious, others starved and deadlocked, their operations never completed. But from this destruction emerged data—valuable insights into the costs of contention, the performance of different synchronization methods, and the limits of concurrency.</p>
        </AccordionItem>

        <AccordionItem key="4" aria-label="Chapter 3" title="Chapter 3: The Aftermath - Dissecting the Results">
          <p>Introduction: Lessons from the Battlefield</p>
          <ul>
            <li>Brief recap of the synchronization methods and the experiments conducted.</li>
            <li>Overview of key insights gained from Chapter 2's plots and performance results.</li>
            <li>Purpose of this chapter: to analyze the data in depth, explain trends, and draw conclusions.</li>
          </ul>

          <p className="font-semibold">Section 1: Fine-Grained Synchronization - Precision at a Price</p>
          <ol>
            <li><strong>Key Observations:</strong>
              <ul>
                <li>Summary of performance trends from the Fine-Grained Synchronization plot.</li>
                <li>Notable inflection points where performance begins to degrade.</li>
              </ul>
            </li>
            <li><strong>Analysis:</strong>
              <ul>
                <li>Breakdown of overhead costs due to excessive locking and unlocking.</li>
                <li>Examination of how thread contention impacts the performance at higher thread counts.</li>
              </ul>
            </li>
            <li><strong>Strengths & Weaknesses:</strong>
              <ul>
                <li>Situations where fine-grained locking is optimal (e.g., low contention environments).</li>
                <li>Cases where complexity becomes its downfall.</li>
              </ul>
            </li>
          </ol>

          <p className="font-semibold">Section 2: Coarse-Grained Synchronization - The Sledgehammer Approach</p>
          <ol>
            <li><strong>Key Observations:</strong>
              <ul>
                <li>Performance curve under coarse-grained locking.</li>
                <li>Discussion on the sharp performance drop as thread count increases.</li>
              </ul>
            </li>
            <li><strong>Analysis:</strong>
              <ul>
                <li>Exploration of how the single lock becomes a bottleneck.</li>
                <li>Correlation between thread contention and diminishing returns.</li>
              </ul>
            </li>
            <li><strong>Strengths & Weaknesses:</strong>
              <ul>
                <li>Where coarse-grained locking performs surprisingly well (e.g., high contention).</li>
                <li>Situations where its simplicity leads to excessive waiting and reduced efficiency.</li>
              </ul>
            </li>
          </ol>

          <p className="font-semibold">Section 3: Optimistic Synchronization - High Risk, High Reward</p>
          <ol>
            <li><strong>Key Observations:</strong>
              <ul>
                <li>Early performance improvements and the sudden spikes in execution time as contention increases.</li>
                <li>Explanation of the retry mechanism and its cost.</li>
              </ul>
            </li>
            <li><strong>Analysis:</strong>
              <ul>
                <li>Evaluation of why optimistic synchronization succeeds in light contention but struggles under heavy loads.</li>
                <li>Discussion on the penalty of frequent retries.</li>
              </ul>
            </li>
            <li><strong>Strengths & Weaknesses:</strong>
              <ul>
                <li>Scenarios where optimistic synchronization shines (e.g., minimal contention).</li>
                <li>Its downfall when contention grows, and threads begin to collide frequently.</li>
              </ul>
            </li>
          </ol>

          <p className="font-semibold">Section 4: Comparative Analysis Across Contention Levels</p>
          <ol>
            <li><strong>Light Contention:</strong>
              <ul>
                <li>Analysis of the best-performing strategy under minimal resource sharing.</li>
                <li>Why fine-grained and optimistic approaches lead the pack.</li>
              </ul>
            </li>
            <li><strong>Medium Contention:</strong>
              <ul>
                <li>Observations on performance shifts.</li>
                <li>How contention levels start exposing weaknesses in both fine-grained and optimistic approaches.</li>
              </ul>
            </li>
            <li><strong>Heavy Contention:</strong>
              <ul>
                <li>Breakdown of why coarse-grained synchronization, despite its flaws, performed relatively better in high-contention scenarios.</li>
                <li>Further examination of fine-grained locking's collapse under extreme loads.</li>
                <li>Optimistic synchronization’s frequent retries leading to catastrophic performance degradation.</li>
              </ul>
            </li>
          </ol>

          <p><strong>Conclusion: Navigating the Future of Concurrency</strong></p>
          <ul>
            <li>Recap of key findings from the results.</li>
            <li>Final thoughts on the balance between concurrency gains and the overhead of managing synchronization.</li>
            <li>A look ahead to future challenges, such as deadlocks, race conditions, and starvation, to be tackled in the next chapter.</li>
          </ul>
        </AccordionItem>

        <AccordionItem key="5" aria-label="Chapter 4" title="Chapter 4: References - A Comedy of Errors">
          <p>Introduction: The Land of Misfit References</p>
          <p>Welcome, dear reader, to the grand finale of our journey through the chaotic world of concurrency! This chapter is not just a list of boring references—oh no, it’s a delightful romp through the land of misfit references, where textbooks and lecture slides go to party after a hard day of educating the masses. Grab your popcorn, and let’s dive into this ridiculousness!</p>

          <p className="font-semibold">1. Lecture Slides: The Silent Heroes</p>
          <p>First up, we have our beloved lecture slides. Those poor souls that are thrust into the spotlight each semester, only to be forgotten in the dusty archives of academia. They are the introverts of the academic world—full of knowledge but too shy to speak up.</p>
          <ul>
            <li><strong>Title:</strong> "Concurrency and Synchronization"</li>
            <li><strong>Author:</strong> The one who shall not be named (because they’re probably regretting this semester already).</li>
            <li><strong>Date:</strong> Whenever caffeine levels were dangerously high.</li>
            <li><strong>Description:</strong> A glorious mix of bullet points, diagrams that look like they were drawn by a toddler, and enough jargon to make your head spin.</li>
          </ul>

          <p className="font-semibold">2. Textbook: The Heavyweight of Boredom</p>
          <p>Next, we have the textbook—that doorstop of knowledge that is thicker than a brick. You know, the one you pretend to read while actually scrolling through memes on your phone.</p>
          <ul>
            <li><strong>Title:</strong> "The Art of Multiprocessor Programming"</li>
            <li><strong>Authors:</strong> Nir Shavit and Maurice Herlihy (the dynamic duo of concurrency).</li>
            <li><strong>Year:</strong> Written in a time when dinosaurs roamed the Earth, or at least before you were born.</li>
            <li><strong>Description:</strong> A classic text that covers everything from locking mechanisms to memory models. Warning: may cause spontaneous naps during late-night cramming sessions.</li>
          </ul>
        </AccordionItem>
      </Accordion>
      <Button onPress={onOpen} color="secondary">Show Results</Button>
      <Modal
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
              <ModalHeader className="flex flex-col gap-1">What did you want lil bro
                <Image
                  isBlurred
                  width={50}
                  height={50}
                  alt="NextUI hero Image with delay"
                  src={"./modal/doge.gif"}
                />
              </ModalHeader>

              <ModalBody>
                <Image
                  isBlurred
                  width={800}
                  height={400}
                  alt="NextUI hero Image with delay"
                  src={"./modal/rickroll.gif"}
                />
              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20" onPress={() => {
                  audio?.pause();
                  onClose();
                  setHasBeenOpened(true);
                }}>
                  Hahha you fell for that but fr just close to see results
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
            alt="NextUI hero Image with delay"
            src={getImageSrc()}
          />
          <br />
          <br />
          <Slider
            label="Select number of options"
            size="sm"
            showSteps={true}
            hideValue={true}
            step={1}
            maxValue={2}
            minValue={0}
            marks={[
              {
                value: 0,
                label: "100",
              },
              {
                value: 1,
                label: "500",
              },
              {
                value: 2,
                label: "1000",
              },
            ]}
            defaultValue={0}
            onChange={(value) => setOption(Array.isArray(value) ? value[0] : value)}
            className="max-w-md"
          />
          <br />
          <br />
          <Slider
            label="Select operation"
            size="sm"
            showSteps={true}
            hideValue={true}
            step={1}
            maxValue={3}
            minValue={0}
            marks={[
              {
                value: 0,
                label: "add",
              },
              {
                value: 1,
                label: "add/contains",
              },
              {
                value: 2,
                label: "add/remove",
              },
              {
                value: 3,
                label: "add/remove/contains",
              },
            ]}
            defaultValue={0}
            onChange={(value) => setOperation(Array.isArray(value) ? value[0] : value)}
            className="max-w-md"
          />
          <br />
          <br />
          <Slider
            label="Select contention level"
            size="sm"
            showSteps={true}
            hideValue={true}
            step={1}
            maxValue={2}
            minValue={0}
            marks={[
              {
                value: 0,
                label: "High",
              },
              {
                value: 1,
                label: "Medium",
              },
              {
                value: 2,
                label: "Low",
              },
            ]}
            defaultValue={0}
            onChange={(value) => setContention(Array.isArray(value) ? value[0] : value)}
            className="max-w-md"
          />
        </>
      )}
    </div>
  );
}