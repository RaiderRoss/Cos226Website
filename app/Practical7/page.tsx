"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { useState, useEffect } from "react";
import { Image } from "@nextui-org/react";
import { Slider } from "@nextui-org/slider";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import CodeBlock from '../../components/CodeBlock';
import { Divider } from "@nextui-org/react";
export default function Practical7Page() {
  const [option, setOption] = useState(0);
  const [operation, setOperation] = useState(0);
  const [contention, setContention] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const getImageSrc = () => {
    const folder = option === 0 ? "50" : option === 1 ? "100" : option === 2 ? "500" : "1000";
    const level = contention === 0 ? "high" : contention === 1 ? "medium" : "low";
    const op = operation === 0 ? "push" : operation === 1 ? "pushAndPop" : "push";
    return `../Prac7Plots/${folder}Operations/${op}/combined_${level}_scenarios.png`;
  };
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
  const node = `public class Node {
    int data;
    Node next;
    Node(int data) {
        this.data = data;
        this.next = null;
    }
}
`
  const woahHandler = `
import java.util.Random;

public class woahHandler {
    final int minith, maxith;
    int limb;

    public woahHandler(int MIN_DELAY, int MAX_DELAY) {
        minith = MIN_DELAY;
        maxith = MAX_DELAY;

        limb = maxith;
    }

    public void backoff() {
        Random rand = new Random();
        int delay = rand.nextInt(limb);
        limb = Math.min(maxith, 2 * limb);
        try {
            Thread.sleep(0, delay);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
`
  const stack = `
public interface Stack {
    public void push(int value);
    public int pop();
}
`
  const blockingStack = `
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class BlockingStack implements Stack {
    private Node head;
    Lock lock = new ReentrantLock();

    public BlockingStack() {
        this.head = null;
    }

    public void push(int data) {
        lock.lock();
        try {
            Node newNode = new Node(data);
            newNode.next = head;
            head = newNode;
        } finally {
            lock.unlock();
        }
    }

    public int pop() {
        lock.lock();
        try {
            if (head == null) {
                return 0;
            }
            Node temp = head;
            head = head.next;
            return temp.data;
        } finally {
            lock.unlock();
        }
    }

    public String toString(){
        return "BlockingStack";
    }
}
`
  const lockFreeExchanger = `
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicStampedReference;
import java.util.concurrent.TimeoutException;

public class LockFreeExchanger {
    static final int EMPTY = 1;
    static final int WAITING = 2;
    static final int BUSY = 3;
    AtomicStampedReference<Integer> slot = new AtomicStampedReference<>(null, 0);

    public Integer exchange(Integer value, long timeout, TimeUnit unit) throws TimeoutException {
        long nanos = unit.toNanos(timeout);
        long timeBound = System.nanoTime() + nanos;
        int[] stampHolder = { EMPTY };
        while (true) {
            if (System.nanoTime() > timeBound) {
                throw new TimeoutException();
            }
       
            Integer yrItem = slot.get(stampHolder);
            int stamp = stampHolder[0];
            switch (stamp) {
                case EMPTY:
                    if (slot.compareAndSet(yrItem, value, EMPTY, WAITING)) {
                        while (System.nanoTime() < timeBound) {
                            yrItem = slot.get(stampHolder);
                            if (stampHolder[0] == BUSY) {
                                slot.set(null, EMPTY);
                                return yrItem;
                            }
                        }
                        if (slot.compareAndSet(value, null, WAITING, EMPTY)) {
                            throw new TimeoutException();
                        } else {
                            yrItem = slot.get(stampHolder);
                            slot.set(null, EMPTY);
                            return yrItem;
                        }
                    }

                    break;
                case WAITING:
                    if (slot.compareAndSet(yrItem, value, WAITING, BUSY))
                        return yrItem;
                    break;
                case BUSY:
                    break;
                default: // impossible or is it?
            }
        }
    }
}
`
  const lockFreeStack = `
import java.util.concurrent.atomic.AtomicReference;

public class LockFreeStack implements Stack {
    AtomicReference<Node> top = new AtomicReference<Node>(null);
    static final int MIN_DELAY = 2;
    static final int MAX_DELAY = 64;
    woahHandler backoff = new woahHandler(MIN_DELAY, MAX_DELAY);

    protected boolean tryPush(Node node) {
        Node oldTop = top.get();
        node.next = oldTop;
        return (top.compareAndSet(oldTop, node));
    }

    public void push(int value) {
        Node node = new Node(value);
        while (true) {
            if (tryPush(node)) {
                return;
            } else {
                backoff.backoff();
            }
        }
    }

    protected Integer tryPop() {
        Node oldTop = top.get();
        if(oldTop == null){
            throw new IllegalStateException("Stack is empty");
        }
        Node newTop = oldTop.next;
        if (top.compareAndSet(oldTop, newTop)) {
            return oldTop.data;
        } else {
            return null;
        }
    }

    public int pop() {
        while (true) {
            Integer returnData;
            try {
                returnData = tryPop();
            } catch (IllegalStateException e) {
                return 0;
            }
            if (returnData != null) {
                return returnData;
            } else {
                backoff.backoff();
            }
        }
    }
    public String toString(){
        return "LockFreeStack";
    }
}

`
  const eliminationArray = `
import java.util.Random;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.TimeUnit;

public class EliminationArray {
    private static final long duration = 2l;
    LockFreeExchanger[] exchanger;
    Random random;

    public EliminationArray(int capacity) {
        exchanger = (LockFreeExchanger[]) new LockFreeExchanger[capacity];
        for (int i = 0; i < capacity; i++) {
            exchanger[i] = new LockFreeExchanger();
        }
        random = new Random();
    }

    public Integer visit(Integer value, int range) throws TimeoutException {
        Integer slot = random.nextInt(range);
        return exchanger[slot].exchange(value, duration, TimeUnit.MILLISECONDS);
    }
}
`
  const rangePolicy = `
public class RangePolicy {
    int range = 1;

    void recordEliminationSuccess() {
        range += 5;
    }

    void recordEliminationTimeout() {
        if (range > 5) {
            range -= 5;
        }
    }

    int getRange() {
        return range;
    }
}
`
  const eleminationBackoffStack = `
import java.util.concurrent.TimeoutException;

public class EliminationBackoffStack extends LockFreeStack {

    static final int capacity = 10;

    EliminationArray eliminationArray = new EliminationArray(capacity);
    static ThreadLocal<RangePolicy> policy = new ThreadLocal<RangePolicy>() {
        protected synchronized RangePolicy initialValue() {
            return new RangePolicy();
        }
    };

    public void push(int value) {
        RangePolicy rangePolicy = policy.get();
        Node node = new Node(value);
        while (true) {
            if (tryPush(node)) {
                return;
            } else
                try {
                    Integer otherValue = eliminationArray.visit(value, rangePolicy.getRange());
                    if (otherValue == null) {
                        rangePolicy.recordEliminationSuccess();
                        return;
                    }
                } catch (TimeoutException ex) {
                    rangePolicy.recordEliminationTimeout();
                }
        }
    }

    public int pop()  {
        RangePolicy rangePolicy = policy.get();
        while (true) {
            Integer returnData;
            try {
                returnData = tryPop();
            } catch (IllegalStateException e) {
                return 0;
            }
            if (returnData != null) {
                return returnData;
            } else
                try {
                    Integer otherValue = eliminationArray.visit(null, rangePolicy.getRange());
                    if (otherValue != null) {
                        rangePolicy.recordEliminationSuccess();
                        return otherValue;
                    }
                } catch (TimeoutException ex) {
                    rangePolicy.recordEliminationTimeout();
                }
        }
    }
    public String toString(){
        return "EliminationBackoffStack";
    }
}
`
  const test = `

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class Main {

    static final int numOperations = 500;
    static Path path = Paths.get("data.csv");
    static Random random = new Random(235);

    public static void main(String[] args) throws IOException, InterruptedException {
        Files.delete(path);
        Files.write(path, "stackType,Number of Threads,Time Taken".getBytes(),
                StandardOpenOption.CREATE);
        for (int i = 0; i < 5; i++) {
            testHigh();
            testMedium();
            testLow();
        }
    }

    public static void testHigh() throws IOException, InterruptedException {
        testHighBlocking(new BlockingStack());
        System.out.println("High contention test completed for BlockingStack");
        testHighFree(new LockFreeStack());
        System.out.println("High contention test completed for LockFreeStack");
        testHighElimincation(new EliminationBackoffStack());
        System.out.println("High contention test completed for EliminationBackoffStack");
        System.out.println("High contention test completed");
    }

    public static void testMedium() throws IOException, InterruptedException {
        testMediumBlocking(new BlockingStack());
        System.out.println("Medium contention test completed for BlockingStack");
        testMediumFree(new LockFreeStack());
        System.out.println("Medium contention test completed for LockFreeStack");
        testMediumElimincation(new EliminationBackoffStack());
        System.out.println("Medium contention test completed for EliminationBackoffStack");
        System.out.println("Medium contention test completed");
    }

    public static void testLow() throws IOException, InterruptedException {
        testLowBlocking(new BlockingStack());
        System.out.println("Low contention test completed for BlockingStack");
        testLowFree(new LockFreeStack());
        System.out.println("Low contention test completed for LockFreeStack");
        testLowElimincation(new EliminationBackoffStack());
        System.out.println("Low contention test completed for EliminationBackoffStack");
        System.out.println("Low contention test completed");
    }

    public static void testHighBlocking(Stack BlockingGrained) throws IOException, InterruptedException {
        for (int warmup = 0; warmup < 5; warmup++) {
            highContention(BlockingGrained, 1);
        }
        for (int numThreads = 1; numThreads <= 32; numThreads += 2) {
            long startTime = System.nanoTime();
            highContention(BlockingGrained, numThreads);
            long endTime = System.nanoTime();
            long timeElapsed = endTime - startTime;
            Files.write(path,
                    ("\n" + BlockingGrained.toString() + " high" + "," + numThreads + ","
                            + TimeUnit.NANOSECONDS.toMicros(timeElapsed))
                            .getBytes(),
                    StandardOpenOption.APPEND);
        }
    }

    public static void testHighFree(Stack FreeGrained) throws IOException, InterruptedException {
        for (int warmup = 0; warmup < 5; warmup++) {
            highContention(FreeGrained, 1);
        }

        for (int numThreads = 1; numThreads <= 32; numThreads += 2) {
            long startTime = System.nanoTime();
            highContention(FreeGrained, numThreads);
            long endTime = System.nanoTime();
            long timeElapsed = endTime - startTime;
            Files.write(path,
                    ("\n" + FreeGrained.toString() + " high" + "," + numThreads + ","
                            + TimeUnit.NANOSECONDS.toMicros(timeElapsed))
                            .getBytes(),
                    StandardOpenOption.APPEND);
        }
    }

    public static void testHighElimincation(Stack Elimincation) throws IOException, InterruptedException {
        for (int warmup = 1; warmup < 5; warmup++) {
            highContention(Elimincation, 1);
        }
        for (int numThreads = 1; numThreads <= 32; numThreads += 2) {
            long startTime = System.nanoTime();
            highContention(Elimincation, numThreads);
            long endTime = System.nanoTime();
            long timeElapsed = endTime - startTime;
            Files.write(path,
                    ("\n" + Elimincation.toString() + " high" + "," + numThreads + ","
                            + TimeUnit.NANOSECONDS.toMicros(timeElapsed))
                            .getBytes(),
                    StandardOpenOption.APPEND);
        }
    }

    public static void testMediumBlocking(Stack BlockingGrained) throws IOException, InterruptedException {
        for (int warmup = 0; warmup < 5; warmup++) {
            mediumContention(BlockingGrained, 1);
        }

        for (int numThreads = 1; numThreads <= 32; numThreads += 2) {
            long startTime = System.nanoTime();
            mediumContention(BlockingGrained, numThreads);
            long endTime = System.nanoTime();
            long timeElapsed = endTime - startTime;
            Files.write(path,
                    ("\n" + BlockingGrained.toString() + " medium" + "," + numThreads + ","
                            + (TimeUnit.NANOSECONDS.toMicros(timeElapsed) - TimeUnit.MILLISECONDS.toMicros(10)))
                            .getBytes(),
                    StandardOpenOption.APPEND);
        }

    }

    public static void testMediumFree(Stack FreeGrained) throws IOException, InterruptedException {
        for (int warmup = 0; warmup < 5; warmup++) {
            mediumContention(FreeGrained, 1);
        }

        for (int numThreads = 1; numThreads <= 32; numThreads += 2) {
            long startTime = System.nanoTime();
            mediumContention(FreeGrained, numThreads);
            long endTime = System.nanoTime();
            long timeElapsed = endTime - startTime;
            Files.write(path,
                    ("\n" + FreeGrained.toString() + " medium" + "," + numThreads + ","
                            + (TimeUnit.NANOSECONDS.toMicros(timeElapsed) - TimeUnit.MILLISECONDS.toMicros(10)))
                            .getBytes(),
                    StandardOpenOption.APPEND);
        }

    }

    public static void testMediumElimincation(Stack Elimincation) throws IOException, InterruptedException {
        for (int warmup = 0; warmup < 5; warmup++) {
            mediumContention(Elimincation, 1);
        }

        for (int numThreads = 1; numThreads <= 32; numThreads += 2) {
            long startTime = System.nanoTime();
            mediumContention(Elimincation, numThreads);
            long endTime = System.nanoTime();
            long timeElapsed = endTime - startTime;
            Files.write(path,
                    ("\n" + Elimincation.toString() + " medium" + "," + numThreads + ","
                            + (TimeUnit.NANOSECONDS.toMicros(timeElapsed) - TimeUnit.MILLISECONDS.toMicros(10)))
                            .getBytes(),
                    StandardOpenOption.APPEND);
        }

    }

    public static void testLowBlocking(Stack BlockingGrained) throws IOException, InterruptedException {
        for (int warmup = 0; warmup < 5; warmup++) {
            lowContention(BlockingGrained, 1);
        }

        for (int numThreads = 1; numThreads <= 32; numThreads += 2) {
            long startTime = System.nanoTime();
            lowContention(BlockingGrained, numThreads);
            long endTime = System.nanoTime();
            long timeElapsed = endTime - startTime;
            Files.write(path,
                    ("\n" + BlockingGrained.toString() + " low" + "," + numThreads + ","
                            + (TimeUnit.NANOSECONDS.toMicros(timeElapsed) - TimeUnit.MILLISECONDS.toMicros(20)))
                            .getBytes(),
                    StandardOpenOption.APPEND);
        }

    }

    public static void testLowFree(Stack FreeGrained) throws IOException, InterruptedException {
        for (int warmup = 0; warmup < 5; warmup++) {
            lowContention(FreeGrained, 1);
        }

        for (int numThreads = 1; numThreads <= 32; numThreads += 2) {
            long startTime = System.nanoTime();
            lowContention(FreeGrained, numThreads);
            long endTime = System.nanoTime();
            long timeElapsed = endTime - startTime;
            Files.write(path,
                    ("\n" + FreeGrained.toString() + " low" + "," + numThreads + ","
                            + (TimeUnit.NANOSECONDS.toMicros(timeElapsed) - TimeUnit.MILLISECONDS.toMicros(20)))
                            .getBytes(),
                    StandardOpenOption.APPEND);
        }

    }

    public static void testLowElimincation(Stack Elimincation) throws IOException, InterruptedException {
        for (int warmup = 0; warmup < 5; warmup++) {
            lowContention(Elimincation, 1);
        }

        for (int numThreads = 1; numThreads <= 32; numThreads += 2) {
            long startTime = System.nanoTime();
            lowContention(Elimincation, numThreads);
            long endTime = System.nanoTime();
            long timeElapsed = endTime - startTime;

            Files.write(path,
                    ("\n" + Elimincation.toString() + " low" + "," + numThreads + ","
                            + (TimeUnit.NANOSECONDS.toMicros(timeElapsed) - TimeUnit.MILLISECONDS.toMicros(20)))
                            .getBytes(),
                    StandardOpenOption.APPEND);
        }

    }

    public static int getRandom() {
        return 100 + random.nextInt(900);
    }

    public static void highContention(Stack stack, int numberOfThreads) throws IOException, InterruptedException {
        Thread[] threads = new Thread[numberOfThreads];
        for (int i = 0; i < numberOfThreads; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < numOperations; j++) {
                    int value = getRandom();
                    Boolean push = random.nextBoolean();
                    if (push) {
                        stack.push(value);
                    } else {
                       stack.pop();
                    }
                }
            });
            threads[i].start();
        }
        for (Thread thread : threads) {
            thread.join();
        }
    }

    public static void mediumContention(Stack stack, int numberOfThreads) throws IOException, InterruptedException {
        Thread[] threads = new Thread[numberOfThreads];

        for (int i = 0; i < numberOfThreads; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < numOperations; j++) {
                    int value = getRandom();
                    if (random.nextBoolean()) {
                        stack.push(value);
                    } else {
                        stack.pop();
                    }
                }
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    // Do nothing
                }
            });
            threads[i].start();
        }
        for (Thread thread : threads) {
            thread.join();
        }

    }

    public static void lowContention(Stack stack, int numberOfThreads) throws IOException, InterruptedException {
        Thread[] threads = new Thread[numberOfThreads];
        for (int i = 0; i < numberOfThreads; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < numOperations; j++) {
                    int value = getRandom();
                    if (random.nextBoolean()) {
                        stack.push(value);
                    } else {
                        stack.pop();
                    }
                }
                try {
                    Thread.sleep(20);
                } catch (InterruptedException e) {
                    // Do nothing
                }
            });
            threads[i].start();
        }
        for (Thread thread : threads) {
            thread.join();
        }
    }

}
`
  return (
    <div className="flex flex-col items-center text-start">
      <Accordion defaultExpandedKeys={["1"]} selectionMode="multiple">
        <AccordionItem key="1" aria-label="User Info" title="Chapter 0: Details">
          <p>u23545080</p>
          <p>Aidan McKenzie</p>
        </AccordionItem>
        <AccordionItem key="2" title="What Ridiculous Output Will This Code Produce Now?">
          <Accordion selectionMode="multiple" >
            <AccordionItem key="1" title="Testing">
              <CodeBlock code={test}
                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `150%`, fontSize: '60%' }} />
            </AccordionItem>
            <AccordionItem key="2" title="Basic node and stack">
              <CodeBlock code={node}
                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `80%` }} />
              <Divider className="my-4" />
              <CodeBlock code={stack}
                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `80%` }} />
            </AccordionItem>
            <AccordionItem key="3" title="Helper classes">
              <CodeBlock code={woahHandler}
                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `150%` }} />
              <Divider className="my-4" />
              <CodeBlock code={lockFreeExchanger}
                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `160%`, fontSize: '70%' }} />
              <Divider className="my-4" />
              <CodeBlock code={eliminationArray}
                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `100%` }} />
              <Divider className="my-4" />
              <CodeBlock code={rangePolicy}
                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `100%` }} />
            </AccordionItem>
            <AccordionItem key="4" title="Stack implimentations">
              <CodeBlock
                code={blockingStack}
                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `150%` }}
              />
              <Divider className="my-4" />
              <CodeBlock
                code={lockFreeStack}
                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `150%` }}
              />
              <Divider className="my-4" />
              <CodeBlock
                code={eleminationBackoffStack}
                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `150%` }}
              />
            </AccordionItem>
          </Accordion>
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
              <ModalHeader className="flex flex-col gap-1">
                I’m really going to miss you all so much! 😔
                To Zane and Keanu, thank you both for everything. You’ve been with me since COS 110, guiding me through the challenges and dumb edge cases.
                You’ve been more than just tutors you have been amazing friends too, always there with patience, wisdom, and just the right amount of tough love
                when I needed it. I genuinely don’t know how I would have made it this far without you two by my side.
                And to all the other tutors I’ve had along the way—each of you has made such a huge impact.
                I hope you all go on to do Honours because the passion and dedication you bring to your work is 
                something that more students should experience. 
                I want you to know how much I appreciate the time, energy, and care, you have put into helping us succeed.
                Thank you all for making my journey unforgettable. I’m so grateful to have had such an amazing support system, and I’ll carry 
                everything you taught me forward into the future.
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
                  You know I had to do it one last time
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
          <Slider
            label="Select number of options"
            size="sm"
            showSteps={true}
            hideValue={true}
            step={1}
            maxValue={3}
            minValue={0}
            marks={[
              {
                value: 0,
                label: "50",
              },
              {
                value: 1,
                label: "100",
              },
              {
                value: 2,
                label: "500",
              },
              {
                value: 3,
                label: "1000",
              }
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
            maxValue={1}
            minValue={0}
            marks={[
              {
                value: 0,
                label: "push",
              },
              {
                value: 1,
                label: "push/pop",
              }
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
