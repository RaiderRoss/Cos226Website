"use client";
import { useState, useEffect } from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Image } from "@nextui-org/react";
import { Slider } from "@nextui-org/slider";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import CodeBlock from '../../components/CodeBlock';
export default function Practical6Page() {
  const [option, setOption] = useState(0);
  const [operation, setOperation] = useState(0);
  const [contention, setContention] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  useEffect(() => {
    const audioInstance = new Audio('/modal/sound.mp3');
    setAudio(audioInstance);
    return () => {
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
  const nodeSnippit = `
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class node {
  private String value;
  public final Lock lock;
  public int key;
  public node next;

  public node(String value) {
    lock = new ReentrantLock();
    this.value = value;
    this.key = value.hashCode();
    this.next = null;
  }

  public String getValue() {
    return value;
  }
}
`;
  const baseSet = `
  public abstract class baseSet {
    public abstract boolean add(String element);
    public abstract boolean remove(String element);
    public abstract boolean contains(String element);
    public String toString() {
        return "baseSet";
    }
}
  `
  const coarseDirt = `
  import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class coarseDirt extends baseSet {
    private node headNode;
    private Lock lock = new ReentrantLock();

    public coarseDirt() {
        headNode = new node("");
        headNode.next = new node("\uffff");
    }

    public boolean add(String element) {
        node pred, curr;
        int key = element.hashCode();
        lock.lock();
        try {
            pred = headNode;
            curr = headNode.next;
            while (curr.next!=null && curr.key < key) {
                pred = curr;
                curr = curr.next;
            }
            if (key == curr.key)
                return false;
            else {
                node node = new node(element);
                node.next = curr;
                pred.next = node;
                return true;
            }
        } finally {
            lock.unlock();
        }
    }

    public boolean remove(String element) {
        node pred, curr;
        int key = element.hashCode();
        lock.lock();
        try {
            pred = headNode;
            curr = headNode.next;
            while (curr.next!=null && curr.key < key) {
                pred = curr;
                curr = curr.next;
            }
            if (key == curr.key) {
                pred.next = curr.next;
                return true;
            } else
                return false;
        } finally {
            lock.unlock();
        }
    }
    
    public boolean contains(String element) {
        node curr;
        int key = element.hashCode();
        lock.lock();
        try {
            curr = headNode.next;
            while (curr.next!=null && curr.key < key) {
                curr = curr.next;
            }
            return key == curr.key;
        } finally {
            lock.unlock();
        }
    }
    public String toString() {
        return "Coarse Grained";
    }
}

  `
  const fineSet = `
  
public class fineSet extends baseSet {

    private node headNode;

    public fineSet() {
        headNode = new node("");
        headNode.next = new node("\uffff");
    }

    public boolean add(String element) {
        int key = element.hashCode();
        headNode.lock.lock();
        node pred = headNode;
        try {
            node curr = headNode.next;
            curr.lock.lock();
            try {
                while (curr.next != null && curr.key < key) {
                    pred.lock.unlock();
                    pred = curr;
                    curr = curr.next;
                    curr.lock.lock();
                }
                if (curr.key == key) {
                    return false;
                }
                node newNode = new node(element);
                newNode.next = curr;
                pred.next = newNode;
                return true;
            } finally {
                curr.lock.unlock();
            }
        } finally {
            pred.lock.unlock();
        }
    }

    public boolean remove(String element) {
        int key = element.hashCode();
        node pred, curr;
        headNode.lock.lock();
        pred = headNode;
        try {
            curr = headNode.next;
            curr.lock.lock();
            try {
                while (curr.next != null && curr.key < key) {
                    pred.lock.unlock();
                    pred = curr;
                    curr = curr.next;
                    curr.lock.lock();
                }
                if (curr.key == key) {
                    pred.next = curr.next;
                    return true;
                }
                return false;
            } finally {
                curr.lock.unlock();
            }
        } finally {
            pred.lock.unlock();
        }
    }

    public boolean contains(String element) {
        int key = element.hashCode();
        headNode.lock.lock();
        node curr = headNode;
        try {
            while (curr.next != null && curr.key < key) {
                node pred = curr;
                curr = curr.next;
                pred.lock.unlock();
                curr.lock.lock();
            }
            return curr.key == key;
        } finally {
            curr.lock.unlock();
        }

    }

    public String toString() {
        return "Fine Grained";

    }
}

  `
  const hopefulSet = `
  
public class hopefuleSet extends baseSet {

    private node headNode;

    public hopefuleSet() {
        headNode = new node("");
        headNode.next = new node("\uffff");
    }

    private boolean validate(node pred, node curr) {
        node node = headNode;
        while (node.key <= pred.key) {
            if (node == pred) {
                return pred.next == curr;
            }
            node = node.next;
        }
        return false;
    }

    public boolean add(String element) {
        int key = element.hashCode();
        while (true) {
            node pred = headNode;
            node curr = pred.next;
            while (curr.key < key) {
                pred = curr;
                curr = curr.next;
            }
            pred.lock.lock();
            curr.lock.lock();
            try {
                if (validate(pred, curr)) {
                    if (curr.key == key) {
                        return false;
                    } else {
                        node node = new node(element);
                        node.next = curr;
                        pred.next = node;
                        return true;
                    }
                }
            } finally {
                pred.lock.unlock();
                curr.lock.unlock();
            }
        }
    }

    public boolean remove(String element) {
        int key = element.hashCode();
        while (true) {
            node pred = headNode;
            node curr = pred.next;
            while (curr.key < key) {
                pred = curr;
                curr = curr.next;
            }
            pred.lock.lock();
            curr.lock.lock();
            try {
                if (validate(pred, curr)) {
                    if (curr.key == key) {
                        pred.next = curr.next;
                        return true;
                    } else {
                        return false;
                    }
                }
            } finally {
                pred.lock.unlock();
                curr.lock.unlock();
            }
        }
    }

    public boolean contains(String element) {
        int key = element.hashCode();
        while (true) {
            node pred = headNode;
            node curr = headNode.next;
            while (curr.key < key) {
                pred = curr;
                curr = curr.next;
            }
            pred.lock.lock();
            curr.lock.lock();

            try {
                if (validate(pred, curr)) {
                    return (curr.key == key);
                }
            } finally {
                pred.lock.unlock();
                curr.lock.unlock();
            }
        }
    }

    public String toString() {
        return "Optimistic";
    }

}

  `

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
          <Divider className="my-4" />
          <p className="font-semibold">The Arena: Contention Types</p>
          <p>To understand how threads behaved under different conditions, I set up the experiments like a gladiator tournament—throwing my threads into increasingly chaotic arenas. Some were pitted against light contention, where few resources were shared, and the race for control was mild. Others were plunged into the fiery pits of heavy contention, where every thread clawed at the same limited resources, eager to claim dominance.</p>
          <Divider className="my-4" />
          <p className="font-semibold">The Results: Plots of Chaos</p>
          <p>Once the tests had run their course, the battlefield lay strewn with the wreckage of threads—some victorious, others starved and deadlocked, their operations never completed. But from this destruction emerged data—valuable insights into the costs of contention, the performance of different synchronization methods, and the limits of concurrency.</p>
        </AccordionItem>
        <AccordionItem key="4" aria-label="Chapter 3" title="Chapter 3: The Aftermath - Dissecting the Results">
          <p>Introduction: Lessons from the Battlefield</p>
          <ul>
            <li>Brief recap of the synchronization methods and the experiments conducted.</li>
            <li>Overview of key insights gained from Chapter 2s plots and performance results.</li>
            <li>Purpose of this chapter: to analyze the data in depth, explain trends, and draw conclusions.</li>
          </ul>

          <Divider className="my-4" />


          <p className="font-semibold">Section 1: Running at 100 operations</p>

          <p className="font-semibold">High Contention</p>
          <ul>
            <li>Type of Operation Add Only: Results and analysis</li>
            <li>•All synchronization method perform equall</li>
            <li>Type of Operation Add and Remove: Results and analysis</li>
            <li>•The synchronization methods all peform abit worse with spikes in optimistic</li>
            <li>Type of Operation Add and Contains: Results and analysis</li>
            <li>•The synchronization methods all peform abit worse</li>
            <li>Type of Operation Add and Remove and Contains: Results and analysis</li>
          </ul>

          <p className="font-semibold">Medium Contention</p>
          <ul>
            <li>Type of Operation Add Only: Results and analysis</li>
            <li>•The synchronization methods all peform abit worse with a spike in optimistic at 21 threads</li>
            <li>Type of Operation Add and Remove: Results and analysis</li>
            <li>•The synchronization methods all peform abit worse</li>
            <li>Type of Operation Add and Contains: Results and analysis</li>
            <li>•The synchronization methods all peform abit worse</li>
            <li>Type of Operation Add and Remove and Contains: Results and analysis</li>
            <li>•The synchronization methods all peform abit worse with spikes in fine grained</li>
          </ul>

          <p className="font-semibold">Low Contention</p>
          <ul>
            <li>•The synchronization methods all peform equally independant of the type of operation</li>
          </ul>

          <p className="font-semibold">Conclusion with 100 operations they do not have a big enough impact to change the results</p>
          <Divider className="my-4" />

          <p className="font-semibold">Section 2: Running at 500 operations</p>

          <p className="font-semibold">High Contention</p>
          <ul>
            <li>Type of Operation Add Only: Results and analysis</li>
            <li>•Fine grained performs abit worse than the rest</li>
            <li>Type of Operation Add and Remove: Results and analysis</li>
            <li>•Lots of spikes in optimistic with fine grained beign the worst</li>
            <li>Type of Operation Add and Contains: Results and analysis</li>
            <li>•Fine grained synchronization just dies with added contains method</li>
            <li>Type of Operation Add and Remove and Contains: Results and analysis</li>
            <li>•Big variation in optimistic synchronization and fine grained still performs poorly</li>
          </ul>

          <p className="font-semibold">Medium Contention</p>
          <ul>
            <li>•Same as high contention but massive variation in fine grained synchronization method</li>
          </ul>

          <p className="font-semibold">Low Contention</p>
          <ul>
            <li>•Same results as medium and high contention combined</li>
          </ul>
          <p className="font-semibold">Conclusion with 500 operations fine grained suffers from calling the contains method</p>
          <Divider className="my-4" />

          <p className="font-semibold">Section 3: Running at 1000 operations</p>

          <p className="font-semibold">High Contention</p>
          <ul>
            <li>Type of Operation Add Only: Results and analysis</li>
            <li>•Fine grained performs the worst with optimistic and coarse grained behaving equally</li>
            <li>Type of Operation Add and Remove: Results and analysis</li>
            <li>•Optimistic has massive variations in the results </li>
            <li>Type of Operation Add and Contains: Results and analysis</li>
            <li>•Fine grained is clearly the looser with optimistic in second and coarse is the winner</li>
            <li>Type of Operation Add and Remove and Contains: Results and analysis</li>
            <li>•Optimistic gets absolutely wrecked in this scenario with fine grained in second place</li>
          </ul>

          <p className="font-semibold">Medium Contention</p>
          <ul>
            <li>•Same results as high contention</li>
          </ul>

          <p className="font-semibold">Low Contention</p>
          <ul>
            <li>•Same results as medium and high contention</li>
          </ul>
          <p className="font-semibold">Conclusion with 1000 operations with add and remove and contains optimistic suffers because of its validation method since there are much more elements to go through</p>


          <Divider className="my-4" />

          <p><strong>Conclusion: Navigating the Future of Concurrency</strong></p>
          <ul>
            <li>Recap of key findings from the results.</li>
            <li>Clearly coarse grained synchronization is the best of all and the others vary depending on their scenario</li>
          </ul>
        </AccordionItem>


        <AccordionItem key="5" aria-label="Chapter 4" title="Chapter 4: References - A Comedy of Errors">
          <p>Introduction: The Land of Misfit References</p>
          <p>Welcome, dear reader, to the grand finale of our journey through the chaotic world of concurrency! This chapter is not just a list of boring references—oh no, it’s a delightful romp through the land of misfit references, where textbooks and lecture slides go to party after a hard day of educating the masses. Grab your popcorn, and let’s dive into this ridiculousness!</p>

          <p className="font-semibold">1. Lecture Slides: The Silent Heroes</p>
          <p>First up, we have our beloved lecture slides. Those poor souls that are thrust into the spotlight each semester, only to be forgotten in the dusty archives of academia. They are the introverts of the academic world—full of knowledge but too shy to speak up.</p>
          <ul>
            <li><strong>Title:</strong> Concurrency and Synchronization</li>
            <li><strong>Author:</strong> The one who shall not be named (because they’re probably regretting this semester already).</li>
            <li><strong>Date:</strong> Whenever caffeine levels were dangerously high.</li>
            <li><strong>Description:</strong> A glorious mix of bullet points, diagrams that look like they were drawn by a toddler, and enough jargon to make your head spin.</li>
          </ul>

          <p className="font-semibold">2. Textbook: The Heavyweight of Boredom</p>
          <p>Next, we have the textbook—that doorstop of knowledge that is thicker than a brick. You know, the one you pretend to read while actually scrolling through memes on your phone.</p>
          <ul>
            <li><strong>Title:</strong> The Art of Multiprocessor Programming</li>
            <li><strong>Authors:</strong> Nir Shavit and Maurice Herlihy (the dynamic duo of concurrency).</li>
            <li><strong>Year:</strong> Written in a time when dinosaurs roamed the Earth, or at least before you were born.</li>
            <li><strong>Description:</strong> A classic text that covers everything from locking mechanisms to memory models. Warning: may cause spontaneous naps during late-night cramming sessions.</li>
          </ul>
        </AccordionItem>
        <AccordionItem key="6" aria-label="Chapter 5" title="Chapter 5: Code Examples">
          <p>Welcome to the practical side of our concurrency journey! In this chapter, we will dive into code snippets that illustrate the concepts discussed in previous chapters. Whether you are a seasoned developer or just starting out, these examples will help solidify your understanding of concurrent systems.</p>

          <Divider className="my-4" />

          <p className="font-semibold">Node class</p>
          <CodeBlock code={nodeSnippit} />
          <Divider className="my-4" />
          <p className="font-semibold">Base Set</p>
          <CodeBlock code={baseSet} />
          <Divider className="my-4" />
          <p className="font-semibold">Coarse dirt</p>
          <CodeBlock code={coarseDirt} />
          <Divider className="my-4" />
          <p className="font-semibold">Fine set</p>
          <CodeBlock code={fineSet} />
          <Divider className="my-4" />
          <p className="font-semibold">Hopeful set</p>
          <CodeBlock code={hopefulSet} />
          <Divider className="my-4" />
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
                  alt="Doggo"
                  src={"./modal/doge.gif"}
                />

              </ModalHeader>

              <ModalBody>
                <Image
                  isBlurred
                  width={800}
                  height={400}
                  alt="Rickroll"
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
            alt="Results"
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
