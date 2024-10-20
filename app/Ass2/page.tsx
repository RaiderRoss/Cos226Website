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
    const BSomethingNode = `
import java.util.ArrayList;
import java.lang.reflect.Method;
public class BSomethingNode {

    public Method data;
    public BSomethingNode parent;
    public ArrayList<BSomethingNode> children;
    String name;

    public BSomethingNode(Method data, BSomethingNode parent, String name) {
        this.data = data;
        this.parent = parent;
        this.children = new ArrayList<>();
        this.name = name;
    }
}
`;
    const Queue = `
public class Queue<T> {
    private Node<T> head;
    private Node<T> tail;
    private int size;

    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data) {
            this.data = data;
            this.next = null;
        }
    }

    public Queue() {
        head = null;
        tail = null;
        size = 0;
    }

    public synchronized int size() {
        return size;
    }

    public synchronized void append(T data) {
        Node<T> newNode = new Node<>(data);
        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            tail = newNode;
        }
        size++;
        notifyAll();
    }

    public synchronized T deQueue() {
        while (isEmpty()) {
            try {
                wait();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        size--;
        T data = head.data;
        head = head.next;
        if (head == null) {
            tail = null;
        }
        return data;
    }

    public synchronized boolean isEmpty() {
        return head == null;
    }
}

`;
    const BasicTree = `
import java.util.ArrayList;
import java.lang.reflect.Method;
public class BasicBTree<T> {
    public ArrayList<BSomethingNode> root;

    public BasicBTree() {
        root = new ArrayList<>();
    }

    public void insert(Method data, String parent, String name) {
        if (parent == "") {
            root.add(new BSomethingNode(data, null, name));
        }
        BSomethingNode parentNode = getParent(root, parent);
        if (parentNode != null) {
            parentNode.children.add(new BSomethingNode(data, parentNode, name));
        }
    }

    public BSomethingNode getParent(ArrayList<BSomethingNode> node, String parent) {
        for (BSomethingNode n : node) {
            if (n.name.equals(parent)) {
                return n;
            }
            BSomethingNode result = getParent(n.children, parent);
            if (result != null) {
                return result;
            }
        }
        return null;
    }

    public void print() {
        for (BSomethingNode node : root) {
            printHelper(node, "", true);
        }
    }

    private void printHelper(BSomethingNode node, String prefix, boolean isTail) {
        System.out.println(prefix + (isTail ? "└── " : "├── ") + node.name);
        for (int i = 0; i < node.children.size() - 1; i++) {
            printHelper(node.children.get(i), prefix + (isTail ? "    " : "│   "), false);
        }
        if (node.children.size() > 0) {
            printHelper(node.children.get(node.children.size() - 1), prefix + (isTail ? "    " : "│   "), true);
        }
    }
}

`;
    const Test = `
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface Test {
    String description() default "No description";
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface DependsOn {
    String dependency() default "No dependency";
}   
`
    const TestRunner = `

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Time;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;

public class TestRunner {
    static Path path = Paths.get("data.csv");

    public static void main(String[] args) throws IllegalAccessException, InvocationTargetException, IOException {
        Files.delete(path);
        Files.write(path, "SequentialOrParrallel,Time Taken,Number of Threads".getBytes(),
                StandardOpenOption.CREATE);
        for (int i = 0; i < 10; i++) {
            int[] numThreads = { 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 };
            for (int numThread : numThreads) {           
                ParallelTestRunner(numThread);
            }
            SequentialTestRunner();
        }
    }

    public static void SequentialTestRunner() throws IOException, IllegalAccessException, InvocationTargetException {
        TestingFrameWork testInstance = new TestingFrameWork();
        System.out.println("Running Sequential Tests");
        Method[] methods = TestingFrameWork.class.getDeclaredMethods();
        Time startTime = new Time(System.currentTimeMillis());
        for (Method method : methods) {
            if (method.isAnnotationPresent(Test.class)) {
                method.invoke(testInstance);
            }
        }
        testInstance.displayResults();
        Time endTime = new Time(System.currentTimeMillis());
        Files.write(path, ("\nSequential," + (endTime.getTime() - startTime.getTime()) + ",").getBytes(),
                StandardOpenOption.APPEND);
        System.out.println("Time taken: " + (endTime.getTime() - startTime.getTime()) + "ms");
    }

    public static void ParallelTestRunner(int numThreads) throws IOException {
        SwimmingPool pool = new SwimmingPool(numThreads);
        TestingFrameWork testInstance = new TestingFrameWork();

        BasicBTree<Method> bst = new BasicBTree<>();
        System.out.println("Running Concurrent Tests");
        Method[] methods = TestingFrameWork.class.getDeclaredMethods();
        for (Method method : methods) {
            if (method.isAnnotationPresent(Test.class)) {
                buildTree(method, bst);
            }
        }
        bst.print();
        buildPool(false, bst, pool);
        Time startTime = new Time(System.currentTimeMillis());
        pool.start();
        pool.shutdown();
        testInstance.displayResults();
        Time endTime = new Time(System.currentTimeMillis());
        Files.write(path, ("\nParralell," + (endTime.getTime() - startTime.getTime()) + "," + numThreads).getBytes(),
                StandardOpenOption.APPEND);
        System.out.println("Time taken: " + (endTime.getTime() - startTime.getTime()) + "ms");
    }

    public static void buildPool(boolean isSequential, BasicBTree tree, SwimmingPool pool) {
        for (Object obj : tree.root) {
            BSomethingNode node = (BSomethingNode) obj;
            if (!node.children.isEmpty()) {
                buildPoolHelper(isSequential, node, pool);
            } else {
                if (isSequential) {
                    pool.scheduleSequentialTask(() -> {
                        try {
                            node.data.invoke(new TestingFrameWork());
                        } catch (IllegalAccessException | InvocationTargetException e) {
                            e.printStackTrace();
                        }
                    });
                } else {
                    pool.scheduleTask(() -> {
                        try {
                            node.data.invoke(new TestingFrameWork());
                        } catch (IllegalAccessException | InvocationTargetException e) {
                            e.printStackTrace();
                        }
                    });
                }
                System.out.println("Checking node " + node.name);
            }
        }
    }

    public static void buildPoolHelper(boolean isSequential, BSomethingNode node, SwimmingPool pool) {
        pool.scheduleSequentialTask(() -> {
            try {
                node.data.invoke(new TestingFrameWork());
            } catch (IllegalAccessException | InvocationTargetException e) {
                e.printStackTrace();
            }
        });
        if (!node.children.isEmpty()) {
            for (BSomethingNode child : node.children) {
                buildPoolHelper(isSequential, child, pool);
            }
        }
    }

    public static void buildTree(Method method, BasicBTree<Method> bst) {
        String parent = "";
        if (method.isAnnotationPresent(DependsOn.class)) {
            DependsOn dependsOn = method.getAnnotation(DependsOn.class);
            parent = dependsOn.dependency();
        }
        bst.insert(method, parent, method.getName());
    }
}

`
    const TestingFrameWork = `

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;
import java.util.Stack;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/////////////////////////////////////////////////

public class TestingFrameWork {

    private static int passCount = 0;
    private static int failCount = 0;

    public String getTestNumber(String test) {
        return test.split(":")[0];
    }

    void printPassedTests(String message) {
        System.out.println("\u001B[32mPassed " + message);
        System.out.print("\u001B[0m");
    }

    void printFailedTests(String message) {
        System.out.println("\u001B[31mFailed " + message);
        System.out.print("\u001B[0m");
    }
    void displayResults() {
        System.out.println("\u001B[34m=====================================\u001B[0m");
        System.out.println("Total Tests: " + (passCount + failCount));
        System.out.println("\u001B[92mPassed: " + passCount);
        System.out.println("\u001B[31mFailed: " + failCount);
        System.out.println("\u001B[34m=====================================\u001B[0m");
        passCount = 0;
        failCount = 0;
    }

    public void assertEquals(Object actual, Object expected, String message) {
        if (Objects.equals(actual, expected)) {
            printPassedTests(getTestNumber(message));
            passCount++;
        } else {
            printFailedTests(getTestNumber(message) + " | Expected: " + expected + ", Actual: " + actual);
            failCount++;
        }
    }

    public void assertTrue(boolean condition, String message) {
        if (condition) {
            printPassedTests(getTestNumber(message));
            passCount++;
        } else {
            printFailedTests(getTestNumber(message));
            failCount++;
        }
    }

    public void assertFalse(boolean condition, String message) {
        if (!condition) {
            printPassedTests(getTestNumber(message));
            passCount++;
        } else {
            printFailedTests(getTestNumber(message));
            failCount++;
        }
    }
    @Test(description = "Checking if two numbers are equal")
    public void test1() {
        int num1 = 15;
        int num2 = 15;
        assertEquals(num1, num2, "Test 1: num1 should equal num2");
    }

    @Test(description = "Checking if the sum of two numbers equals a target")
    public void test2() {
        int num1 = 5;
        int num2 = 10;
        int target = 15;
        assertEquals(num1 + num2, target, "Test 2: Sum of num1 and num2 should equal target");
    }

    @Test(description = "Checking if subtraction gives the correct result")
    public void test3() {
        int num1 = 20;
        int num2 = 5;
        int expected = 15;
        assertEquals(num1 - num2, expected, "Test 3: num1 minus num2 should equal " + expected);
    }

    @Test(description = "Checking if multiplication gives the correct result")
    public void test4() {
        int num1 = 3;
        int num2 = 7;
        int expected = 21;
        assertEquals(num1 * num2, expected, "Test 4: num1 multiplied by num2 should equal " + expected);
    }

    @Test(description = "Checking if division gives the correct result")
    public void test5() {
        int num1 = 100;
        int num2 = 20;
        int expected = 5;
        assertEquals(num1 / num2, expected, "Test 5: num1 divided by num2 should equal " + expected);
    }

    @Test(description = "Checking if numbers are not equal")
    public void test6() {
        int num1 = 8;
        int num2 = 9;
        assertTrue(num1 != num2, "Test 6: num1 should not equal num2");
    }

    @Test(description = "Checking if greater than condition is true")
    public void test7() {
        int num1 = 12;
        int num2 = 8;
        assertTrue(num1 > num2, "Test 7: num1 should be greater than num2");
    }

    @Test(description = "Checking if less than condition is true")
    public void test8() {
        int num1 = 5;
        int num2 = 20;
        assertTrue(num1 < num2, "Test 8: num1 should be less than num2");
    }

    @Test(description = "Checking if sum is correct with negative numbers")
    public void test9() {
        int num1 = -5;
        int num2 = -10;
        int expected = -15;
        assertEquals(num1 + num2, expected, "Test 9: Sum of num1 and num2 should equal " + expected);
    }

    @Test(description = "Checking if multiplication by zero works")
    public void test10() {
        int num1 = 50;
        int num2 = 0;
        int expected = 0;
        assertEquals(num1 * num2, expected, "Test 10: Multiplication by zero should equal " + expected);
    }

    @Test(description = "Checking division by 1")
    public void test11() {
        int num1 = 78;
        int expected = 78;
        assertEquals(num1 / 1, expected, "Test 11: Division by 1 should return the same number");
    }

    @Test(description = "Checking modulus operation")
    public void test12() {
        int num1 = 25;
        int num2 = 7;
        int expected = 4;
        assertEquals(num1 % num2, expected, "Test 12: num1 modulus num2 should equal " + expected);
    }

    @Test(description = "Checking if sum of 0 and any number equals the number")
    public void test13() {
        int num1 = 0;
        int num2 = 12;
        assertEquals(num1 + num2, num2, "Test 13: Sum of 0 and num2 should equal num2");
    }

    @Test(description = "Checking subtraction with negative numbers")
    public void test14() {
        int num1 = -30;
        int num2 = -10;
        int expected = -20;
        assertEquals(num1 - num2, expected, "Test 14: num1 minus num2 should equal " + expected);
    }

    @Test(description = "Checking multiplication with negative numbers")
    public void test15() {
        int num1 = -4;
        int num2 = 6;
        int expected = -24;
        assertEquals(num1 * num2, expected, "Test 15: num1 multiplied by num2 should equal " + expected);
    }

    @Test(description = "Checking for non-equality between negative and positive")
    public void test16() {
        int num1 = -10;
        int num2 = 10;
        assertTrue(num1 != num2, "Test 16: num1 should not equal num2");
    }

    @Test(description = "Checking if a number equals itself")
    public void test17() {
        int num1 = 42;
        assertTrue(num1 == num1, "Test 17: num1 should equal itself");
    }

    @Test(description = "Checking if sum of same numbers is double")
    public void test18() {
        int num1 = 22;
        assertEquals(num1 + num1, num1 * 2, "Test 18: Sum of num1 and num1 should equal num1 multiplied by 2");
    }

    @Test(description = "Checking if a number is divisible by itself")
    public void test19() {
        int num1 = 14;
        int expected = 1;
        assertEquals(num1 / num1, expected, "Test 19: num1 divided by itself should equal " + expected);
    }

    @Test(description = "Checking if two equal negative numbers are the same")
    public void test20() {
        int num1 = -13;
        int num2 = -13;
        assertEquals(num1, num2, "Test 20: num1 should equal num2");
    }

    @Test(description = "Checking multiplication with negative numbers is positive")
    public void test21() {
        int num1 = -4;
        int num2 = -6;
        assertTrue((num1 * num2) > 0, "Test 21: Multiplication of num1 and num2 should be positive");
    }

    @Test(description = "Checking if two lists are the same with different orders")
    public void test22() {
        ArrayList<Integer> list1 = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6));
        ArrayList<Integer> list2 = new ArrayList<>(Arrays.asList(6, 5, 4, 3, 2, 1));
        Collections.sort(list2);
        assertEquals(list1, list2, "Test 22: list1 should be equal to sorted list2");
    }

    @Test(description = "Checking if two sets are the same")
    public void test23() {
        Set<Integer> set1 = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));
        Set<Integer> set2 = new HashSet<>(Arrays.asList(5, 4, 3, 2, 1));
        assertEquals(set1, set2, "Test 23: set1 should be equal to set2");
    }

    @Test(description = "Checking if two sets are different")
    public void test24() {
        Set<Integer> set1 = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));
        Set<Integer> set2 = new HashSet<>(Arrays.asList(1, 2, 3, 6, 7));
        assertFalse(set1.equals(set2), "Test 24: set1 should not be equal to set2");
    }

    @Test(description = "Checking if a map contains a specific key-value pair")
    public void test25() {
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 1);
        map.put("banana", 2);
        map.put("orange", 3);

        boolean containsKey = map.containsKey("banana");
        boolean correctValue = map.get("banana") == 2;
        assertTrue(containsKey && correctValue, "Test 25: Map should contain key 'banana' with value 2");
    }

    @Test(description = "Checking if two hashmaps are equal")
    public void test26() {
        Map<String, Integer> map1 = new HashMap<>();
        map1.put("one", 1);
        map1.put("two", 2);
        map1.put("three", 3);

        Map<String, Integer> map2 = new HashMap<>();
        map2.put("one", 1);
        map2.put("two", 2);
        map2.put("three", 3);

        assertEquals(map1.equals(map2), true, "Test 26: Checking if two hashmaps are equal");
    }

    @Test(description = "Checking if two hashmaps are different")
    public void test27() {
        Map<String, Integer> map1 = new HashMap<>();
        map1.put("one", 1);
        map1.put("two", 2);
        map1.put("three", 3);

        Map<String, Integer> map2 = new HashMap<>();
        map2.put("one", 1);
        map2.put("two", 2);
        map2.put("four", 4);

        assertEquals(map1.equals(map2), false, "Test 27: Checking if two hashmaps are different");
    }

    @Test(description = "Checking if a list contains specific elements")
    public void test28() {
        ArrayList<Integer> list = new ArrayList<>(Arrays.asList(10, 20, 30, 40, 50));
        assertEquals(list.contains(30) && list.contains(50), true, "Test 28: Checking if a list contains specific elements");
    }

    @Test(description = "Checking if a set contains all elements from another set")
    public void test29() {
        Set<Integer> set1 = new HashSet<>(Arrays.asList(10, 20, 30, 40, 50));
        Set<Integer> set2 = new HashSet<>(Arrays.asList(30, 40, 50));

        assertEquals(set1.containsAll(set2), true, "Test 29: Checking if a set contains all elements from another set");
    }

    @Test(description = "Checking if the sum of map values equals a target")
    public void test30() {
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 2);
        map.put("banana", 3);
        map.put("orange", 5);

        int sum = map.values().stream().mapToInt(Integer::intValue).sum();
        assertEquals(sum == 10, true, "Test 30: Checking if the sum of map values equals a target");
    }

    @Test(description = "Checking if two linked lists are equal")
    public void test31() {
        LinkedList<String> list1 = new LinkedList<>(Arrays.asList("a", "b", "c"));
        LinkedList<String> list2 = new LinkedList<>(Arrays.asList("a", "b", "c"));

        assertEquals(list1.equals(list2), true, "Test 31: Checking if two linked lists are equal");
    }

    @Test(description = "Checking if two linked lists are different")
    public void test32() {
        LinkedList<String> list1 = new LinkedList<>(Arrays.asList("a", "b", "c"));
        LinkedList<String> list2 = new LinkedList<>(Arrays.asList("c", "b", "a"));

        assertEquals(list1.equals(list2), false, "Test 32: Checking if two linked lists are different");
    }

    @Test(description = "Checking if a map contains a certain number of entries")
    public void test33() {
        Map<String, Integer> map = new HashMap<>();
        map.put("x", 10);
        map.put("y", 20);
        map.put("z", 30);

        assertEquals(map.size() == 3, true, "Test 33: Checking if a map contains a certain number of entries");
    }

    @Test(description = "Checking if map's keyset matches a set of expected keys")
    public void test34() {
        Map<String, Integer> map = new HashMap<>();
        map.put("alpha", 1);
        map.put("beta", 2);
        map.put("gamma", 3);

        Set<String> expectedKeys = new HashSet<>(Arrays.asList("alpha", "beta", "gamma"));
        assertEquals(map.keySet().equals(expectedKeys), true, "Test 34: Checking if map's keyset matches a set of expected keys");
    }

    @Test(description = "Checking if a queue maintains order")
    public void test35() {
        Queue<String> queue = new LinkedList<>();
        queue.add("first");
        queue.add("second");
        queue.add("third");

        assertEquals(queue.peek().equals("first"), true, "Test 35: Checking if a queue maintains order");
    }

    @Test(description = "Checking if popping a stack returns the correct element")
    public void test36() {
        Stack<Integer> stack = new Stack<>();
        stack.push(10);
        stack.push(20);
        stack.push(30);

        assertEquals(stack.pop() == 30, true, "Test 36: Checking if popping a stack returns the correct element");
    }

    @Test(description = "Checking if a set intersection is correct")
    public void test37() {
        Set<String> set1 = new HashSet<>(Arrays.asList("dog", "cat", "fish"));
        Set<String> set2 = new HashSet<>(Arrays.asList("fish", "bird", "cat"));

        set1.retainAll(set2);
        assertEquals(set1.equals(new HashSet<>(Arrays.asList("cat", "fish"))), true, "Test 37: Checking if a set intersection is correct");
    }

    @Test(description = "Checking if a priority queue orders numbers correctly")
    public void test38() {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        pq.add(20);
        pq.add(5);
        pq.add(15);

        assertEquals(pq.poll() == 5 && pq.poll() == 15 && pq.poll() == 20, true, "Test 38: Checking if a priority queue orders numbers correctly");
    }

    @Test(description = "Checking if a map contains specific key-value pair after removal")
    public void test39() {
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 1);
        map.put("banana", 2);
        map.put("cherry", 3);
        map.remove("banana");

        assertEquals(!map.containsKey("banana") && map.get("apple") == 1, true, "Test 39: Checking if a map contains specific key-value pair after removal");
    }

    @Test(description = "Checking if stack is empty after pops")
    public void test40() {
        Stack<Integer> stack = new Stack<>();
        stack.push(10);
        stack.push(20);
        stack.pop();
        stack.pop();
        assertEquals(stack.isEmpty(), true, "Test 40: Checking if stack is empty after pops");
    }

    @Test(description = "Writing to a file")
    public void test41() {
        String content = "This is a test content.";
        Path path = Path.of("testfile.txt");

        try {
            Files.writeString(path, content, StandardOpenOption.CREATE);
            assertTrue(Files.exists(path), "Test 41: File should exist after writing.");
        } catch (IOException e) {
            System.out.println("Test 41 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Reading from a file")
    @DependsOn(dependency = "test41")
    public void test42() {
        Path path = Path.of("testfile.txt");
        String content;

        try {
            content = Files.readString(path);
            assertTrue(content != null, "Test 42: Content should not be null.");
        } catch (IOException e) {
            System.out.println("Test 42 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Checking if the content read from the file is correct")
    @DependsOn(dependency = "test42")
    public void test43() {
        Path path = Path.of("testfile.txt");
        String expectedContent = "This is a test content.";
        String content;
        try {
            content = Files.readString(path);
            assertEquals(content, expectedContent, "Test 43: Content should match the expected value.");
        } catch (IOException e) {
            System.out.println("Test 43 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Counting number of words in the file")
    @DependsOn(dependency = "test43")
    public void test44() {
        Path path = Path.of("testfile.txt");
        String content;

        try {
            content = Files.readString(path);
            int wordCount = content.split("\\s+").length;
            assertEquals(wordCount, 5, "Test 44: Expected word count should be 5.");
        } catch (IOException e) {
            System.out.println("Test 44 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Appending to a file")
    @DependsOn(dependency = "test41")
    public void test45() {
        String additionalContent = " Appending this line.";
        Path path = Path.of("testfile.txt");

        try {
            Files.writeString(path, additionalContent, StandardOpenOption.APPEND);
            assertTrue(Files.exists(path), "Test 45: File should still exist after appending.");
        } catch (IOException e) {
            System.out.println("Test 45 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Reading the appended content from the file")
    @DependsOn(dependency = "test45")
    public void test46() {
        Path path = Path.of("testfile.txt");
        String content;

        try {
            content = Files.readString(path);
            assertTrue(content.contains("Appending this line."), "Test 46: Appended content should be present.");
        } catch (IOException e) {
            System.out.println("Test 46 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Checking total character count in the file")
    @DependsOn(dependency = "test46")
    public void test47() {
        Path path = Path.of("testfile.txt");
        String content;

        try {
            content = Files.readString(path);
            int charCount = content.length();
            assertEquals(charCount, 44, "Test 47: Expected character count should be 44.");
        } catch (IOException e) {
            System.out.println("Test 47 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Checking if file exists")
    @DependsOn(dependency = "test41")
    public void test48() {
        Path path = Path.of("testfile.txt");

        assertTrue(Files.exists(path), "Test 48: File should exist.");
    }

    @Test(description = "Deleting the file")
    @DependsOn(dependency = "test48")
    public void test49() {
        Path path = Path.of("testfile.txt");

        try {
            Files.deleteIfExists(path);
            assertFalse(Files.exists(path), "Test 49: File should be deleted.");
        } catch (IOException e) {
            System.out.println("Test 49 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Checking if file deletion was successful")
    @DependsOn(dependency = "test49")
    public void test50() {
        Path path = Path.of("testfile.txt");

        assertFalse(Files.exists(path), "Test 50: File should not exist after deletion.");
    }

    @Test(description = "Creating a directory")
    public void test51() {
        Path dirPath = Path.of("testDirectory");

        try {
            Files.createDirectory(dirPath);
            assertTrue(Files.exists(dirPath), "Test 51: Directory should exist after creation.");
        } catch (IOException e) {
            System.out.println("Test 51 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Writing to a file in the newly created directory")
    @DependsOn(dependency = "test51")
    public void test52() {
        String content = "This is content in a directory.";
        Path path = Path.of("testDirectory/testfile.txt");

        try {
            Files.writeString(path, content, StandardOpenOption.CREATE);
            assertTrue(Files.exists(path), "Test 52: File should exist in the directory after writing.");
        } catch (IOException e) {
            System.out.println("Test 52 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Reading from the file in the directory")
    @DependsOn(dependency = "test52")
    public void test53() {
        Path path = Path.of("testDirectory/testfile.txt");
        String content;

        try {
            content = Files.readString(path);
            assertTrue(content != null, "Test 53: Content should not be null.");
        } catch (IOException e) {
            System.out.println("Test 53 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Checking if the content read from the file in the directory is correct")
    @DependsOn(dependency = "test53")
    public void test54() {
        Path path = Path.of("testDirectory/testfile.txt");
        String expectedContent = "This is content in a directory.";
        String content;

        try {
            content = Files.readString(path);
            assertEquals(content, expectedContent, "Test 54: Content should match the expected value.");
        } catch (IOException e) {
            System.out.println("Test 54 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Deleting the directory and its contents")
    @DependsOn(dependency = "test54")
    public void test55() {
        Path dirPath = Path.of("testDirectory");

        try {
            Files.walk(dirPath)
                    .sorted(Collections.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            System.out.println("Test 55: Failed to delete " + path + ": " + e.getMessage());
                        }
                    });
            assertFalse(Files.exists(dirPath), "Test 55: Directory should be deleted.");
        } catch (IOException e) {
            System.out.println("Test 55 failed: " + e.getMessage());
            failCount++;
        }
    }

    @Test(description = "Checking if the directory deletion was successful")
    @DependsOn(dependency = "test55")
    public void test56() {
        Path dirPath = Path.of("testDirectory");

        assertFalse(Files.exists(dirPath), "Test 56: Directory should not exist after deletion.");
    }

    @Test(description = "Validating complex palindrome check with Unicode characters")
    public void test57() {
        String str = "A man, a plan, a canal: Panamá";
        String cleaned = str.replaceAll("[\\W_]", "").toLowerCase();
        String reversed = new StringBuilder(cleaned).reverse().toString();
        boolean isPalindrome = cleaned.equals(reversed);
        assertFalse(isPalindrome, "Test 57: Palindrome check failed.");
    }

    @Test(description = "Testing recursive string permutation generation")
    public void test58() {
        String str = "ABC";
        List<String> permutations = generatePermutations(str);
        List<String> expected = Arrays.asList("ABC", "ACB", "BAC", "BCA", "CAB", "CBA");
        boolean isValid = permutations.size() == expected.size() && permutations.containsAll(expected);
        assertTrue(isValid, "Test 58: Permutation generation failed.");
    }

    @Test(description = "Validating anagram detection with case insensitivity and ignoring spaces")
    public void test59() {
        String str1 = "Listen";
        String str2 = "Silent";
        boolean isAnagram = areAnagrams(str1, str2);
        assertTrue(isAnagram, "Test 59: The strings are not anagrams.");
    }

    @Test(description = "Testing substring search using KMP algorithm for efficiency")
    public void test60() {
        String text = "This is a test text for testing the KMP algorithm.";
        String pattern = "testing";
        int index = kmpSearch(text, pattern);
        boolean isFound = index != -1;
        assertTrue(isFound, "Test 60: Pattern not found using KMP search.");
    }

    @Test(description = "Validating complex string manipulation: reversing words in a sentence")
    public void test61() {
        String sentence = "Java programming is fun";
        String reversed = reverseWords(sentence);
        assertEquals(reversed, "fun is programming Java", "Test 61: The words in the sentence were not reversed correctly.");
    }

    @Test(description = "Testing efficient substring extraction using regex groups")
    public void test62() {
        String str = "User: JohnDoe, Age: 30, Email: john.doe@example.com";
        Pattern pattern = Pattern.compile("User: (\\w+), Age: (\\d+), Email: ([\\w.]+@\\w+\\.\\w+)");
        Matcher matcher = pattern.matcher(str);
        if (matcher.find()) {
            String user = matcher.group(1);
            String age = matcher.group(2);
            String email = matcher.group(3);
            boolean isCorrect = user.equals("JohnDoe") && age.equals("30") && email.equals("john.doe@example.com");
            assertTrue(isCorrect, "Test 62: Extracted details do not match expected values.");
        } else {
            assertFalse(false, "Test 62: Extracted details do not match expected values.");
        }
    }

    @Test(description = "Validating index retrieval using binary search on sorted string array")
    public void test63() {
        String[] sortedArray = {"Apple", "Banana", "Cherry", "Date", "Elderberry"};
        String target = "Cherry";
        int index = Arrays.binarySearch(sortedArray, target);
        assertEquals(index, 2, "Test 63: Binary search did not return the correct index.");
    }

    @Test(description = "Testing efficient search for last occurrence using streams")
    public void test64() {
        String str = "abracadabra";
        int lastIndex = str.lastIndexOf('a');
        assertEquals(lastIndex, 10, "Test 64: Last index of character 'a' is incorrect.");
    }

    @Test(description = "Validating character frequency count in a string")
    public void test65() {
        String str = "Hello, World!";
        Map<Character, Integer> frequency = getCharacterFrequency(str);
        boolean isCorrect = frequency.get('l') == 3 && frequency.get('o') == 2;
        assertTrue(isCorrect, "Test 65: Character frequency does not match expected values.");
    }

    @Test(description = "Testing concatenation of multiple strings with delimiters")
    public void test66() {
        List<String> strings = Arrays.asList("Java", "is", "a", "powerful", "language");
        String result = String.join(" ", strings);
        assertEquals(result, "Java is a powerful language", "Test 66: Concatenated string does not match expected value.");
    }

    @Test(description = "Validating case-insensitive pattern matching using regex")
    public void test67() {
        String str = "Hello World!";
        Pattern pattern = Pattern.compile("hello", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(str);
        boolean isMatch = matcher.find();
        assertTrue(isMatch, "Test 67: Pattern did not match in a case-insensitive manner.");
    }

    @Test(description = "Testing comprehensive string trimming including internal spaces")
    public void test68() {
        String str = "   \tHello,\n World!   ";
        String trimmed = str.trim().replaceAll("\\s+", " ");
        assertEquals(trimmed, "Hello, World!", "Test 68: Trimming and replacing internal spaces failed.");
    }

    @Test(description = "Validating deep string equality with different object references")
    public void test69() {
        String str1 = "Test";
        String str2 = "Test";
        boolean isEqual = str1.equals(str2);
        assertTrue(isEqual, "Test 69: Strings are not equal in content or incorrectly reference the same object.");
    }

    @Test(description = "Testing case-insensitive string sorting")
    public void test70() {
        List<String> list = Arrays.asList("banana", "Apple", "cherry");
        list.sort(String.CASE_INSENSITIVE_ORDER);
        boolean isSorted = list.equals(Arrays.asList("Apple", "banana", "cherry"));
        assertTrue(isSorted, "Test 70: List is not sorted in case-insensitive order.");
    }

    @Test(description = "Validating complex string replacement with multiple occurrences")
    public void test71() {
        String str = "The rain in Spain stays mainly in the plain.";
        String replaced = str.replaceAll("ain", "XXX");
        assertEquals(replaced, "The rXXX in SpXXX stays mXXXly in the plXXX.", "Test 71: String replacement did not occur as expected.");
    }

    @Test(description = "Testing complex string splitting with multiple delimiters")
    public void test72() {
        String str = "apple;banana, cherry|date";
        String[] fruits = str.split("[;,|]");
        boolean isCorrect = fruits.length == 4 && fruits[1].equals("banana") && fruits[2].trim().equals("cherry");
        assertTrue(isCorrect, "Test 72: String splitting did not handle multiple delimiters correctly.");
    }

    @Test(description = "Validating complex string formatting with multiple placeholders")
    public void test73() {
        String formatted = String.format("Name: %s, Age: %d, Email: %s", "John Doe", 30, "john.doe@example.com");
        assertEquals(formatted, "Name: John Doe, Age: 30, Email: john.doe@example.com", "Test 73: String formatting did not produce the expected output.");
    }

    @Test(description = "Testing addition and multiplication of multiple numbers using streams")
    public void test74() {
        int[] numbers = {5, 10, 15};
        int sum = Arrays.stream(numbers).sum();
        int product = Arrays.stream(numbers).reduce(1, (a, b) -> a * b);
        boolean isCorrect = sum == 30 && product == 750;
        assertTrue(isCorrect, "Test 74: Sum or product of numbers is incorrect.");
    }

    @Test(description = "Validating average calculation with dynamic input and precision")
    public void test75() {
        double[] numbers = {20.5, 30.5, 25.0};
        double sum = Arrays.stream(numbers).sum();
        double average = sum / numbers.length;
        assertTrue(Math.abs(average - 25.3333) < 0.0001, "Test 75: Average calculation is incorrect.");
    }

    @Test(description = "Testing average calculation with large dataset")
    public void test76() {
        int[] numbers = new int[1000];
        Arrays.fill(numbers, 50);
        double sum = Arrays.stream(numbers).sum();
        double average = sum / numbers.length;
        assertEquals(average, 50.0, "Test 76: Average calculation for large dataset is incorrect.");
    }

    @Test(description = "Validating standard deviation with population formula")
    public void test77() {
        double[] numbers = {10, 12, 23, 23, 16, 23, 21, 16};
        double mean = Arrays.stream(numbers).average().orElse(0.0);
        double sumSquaredDifferences = Arrays.stream(numbers)
                .map(num -> Math.pow(num - mean, 2))
                .sum();
        double standardDeviation = Math.sqrt(sumSquaredDifferences / numbers.length);
        assertFalse(Math.abs(standardDeviation - 4.0) < 0.0001, "Test 77: Standard deviation calculation is incorrect.");
    }

    @Test(description = "Testing maximum value in a large unsorted array using parallel streams")
    public void test78() {
        int[] numbers = {10, 5, 20, 3, 15, 100, 50, 75};
        int max = Arrays.stream(numbers).parallel().max().orElse(Integer.MIN_VALUE);
        assertEquals(max, 100, "Test 78: Maximum value in the array is incorrect.");
    }

    @Test(description = "Validating minimum value in a large unsorted array using parallel streams")
    public void test79() {
        int[] numbers = {10, 5, 20, 3, 15, -10, 50, 75};
        int min = Arrays.stream(numbers).parallel().min().orElse(Integer.MAX_VALUE);
        assertEquals(min, -10, "Test 79: Minimum value in the array is incorrect.");
    }

    @Test(description = "Testing addition with large negative and positive numbers")
    public void test80() {
        long num1 = -5000000L;
        long num2 = 5000000L;
        long sum = num1 + num2;
        assertEquals(sum, 0L, "Test 80: Sum of large negative and positive numbers is incorrect.");
    }

    @Test(description = "Validating average calculation with mixed positive and negative numbers")
    public void test81() {
        int[] numbers = {-10, 20, -30, 40};
        double sum = Arrays.stream(numbers).sum();
        double average = sum / numbers.length;
        assertTrue(Math.abs(average - 5.0) < 0.0001, "Test 81: Average with mixed numbers is incorrect.");
    }

    @Test(description = "Testing maximum value with all negative numbers using streams")
    public void test82() {
        int[] numbers = {-1, -2, -3, -4, -5};
        int max = Arrays.stream(numbers).max().orElse(Integer.MIN_VALUE);
        assertEquals(max, -1, "Test 82: Maximum value with all negative numbers is incorrect.");
    }

    @Test(description = "Validating minimum value with all negative numbers using streams")
    public void test83() {
        int[] numbers = {-1, -2, -3, -4, -5};
        int min = Arrays.stream(numbers).min().orElse(Integer.MAX_VALUE);
        assertEquals(min, -5, "Test 83: Minimum value with all negative numbers is incorrect.");
    }

    @Test(description = "Testing average calculation with decimal precision")
    public void test84() {
        double[] numbers = {2.5, 3.5, 4.5, 5.5};
        double sum = Arrays.stream(numbers).sum();
        double average = sum / numbers.length;
        assertTrue(Math.abs(average - 4.0) < 0.0001, "Test 84: Average with decimal numbers is incorrect.");
    }

    @Test(description = "Validating standard deviation with high precision decimal numbers")
    public void test85() {
        double[] numbers = {1.0, 2.0, 3.0, 4.0, 5.0};
        double mean = Arrays.stream(numbers).average().orElse(0.0);
        double sumSquaredDifferences = Arrays.stream(numbers)
                .map(num -> Math.pow(num - mean, 2))
                .sum();
        double standardDeviation = Math.sqrt(sumSquaredDifferences / numbers.length);
        assertTrue(Math.abs(standardDeviation - 1.4142) < 0.0001, "Test 85: Standard deviation with decimal numbers is incorrect.");
    }

    @Test(description = "Validating even number detection with multiple conditions")
    public void test86() {
        int num = 1024;
        boolean isEven = (num % 2 == 0) && (num > 0) && (num % 4 == 0);
        assertTrue(isEven, "Test 86: Number does not meet all even conditions.");
    }

    @Test(description = "Testing odd number detection with prime check")
    public void test87() {
        int num = 7;
        boolean isOdd = num % 2 != 0;
        boolean isPrime = isPrime(num);
        assertTrue(isOdd && isPrime, "Test 87: Number is not odd or not prime.");
    }

    @Test(description = "Validating complex factorial calculation with memoization")
    public void test88() {
        int num = 10;
        long factorial = computeFactorial(num, new HashMap<>());
        assertEquals(factorial, 3628800L, "Test 88: Factorial calculation is incorrect.");
    }

    private List<String> generatePermutations(String str) {
        List<String> results = new ArrayList<>();
        permute("", str, results);
        return results;
    }

    private void permute(String prefix, String str, List<String> results) {
        int n = str.length();
        if (n == 0) {
            results.add(prefix);
        } else {
            for (int i = 0; i < n; i++) {
                permute(prefix + str.charAt(i), str.substring(0, i) + str.substring(i + 1, n), results);
            }
        }
    }

    private boolean areAnagrams(String str1, String str2) {
        String s1 = str1.replaceAll("\\s", "").toLowerCase();
        String s2 = str2.replaceAll("\\s", "").toLowerCase();
        char[] a1 = s1.toCharArray();
        char[] a2 = s2.toCharArray();
        Arrays.sort(a1);
        Arrays.sort(a2);
        return Arrays.equals(a1, a2);
    }

    private int kmpSearch(String text, String pattern) {
        int[] lps = computeLPSArray(pattern);
        int i = 0, j = 0;
        int N = text.length();
        int M = pattern.length();
        while (i < N) {
            if (pattern.charAt(j) == text.charAt(i)) {
                i++;
                j++;
            }
            if (j == M) {
                return i - j;
            } else if (i < N && pattern.charAt(j) != text.charAt(i)) {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        return -1;
    }

    private int[] computeLPSArray(String pattern) {
        int M = pattern.length();
        int[] lps = new int[M];
        int len = 0;
        int i = 1;
        lps[0] = 0;
        while (i < M) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    }

    private String reverseWords(String sentence) {
        String[] words = sentence.split("\\s+");
        Collections.reverse(Arrays.asList(words));
        return String.join(" ", words);
    }

    private Map<Character, Integer> getCharacterFrequency(String str) {
        Map<Character, Integer> frequency = new HashMap<>();
        for (char ch : str.toCharArray()) {
            frequency.put(ch, frequency.getOrDefault(ch, 0) + 1);
        }
        return frequency;
    }

    private boolean isPrime(int num) {
        if (num <= 1) {
            return false;
        }
        if (num <= 3) {
            return true;
        }
        if (num % 2 == 0 || num % 3 == 0) {
            return false;
        }
        for (int i = 5; i * i <= num; i += 6) {
            if (num % i == 0 || num % (i + 2) == 0) {
                return false;
            }
        }
        return true;
    }

    private long computeFactorial(int num, Map<Integer, Long> memo) {
        if (num == 0 || num == 1) {
            return 1;
        }
        if (memo.containsKey(num)) {
            return memo.get(num);
        }
        long result = num * computeFactorial(num - 1, memo);
        memo.put(num, result);
        return result;
    }
}
`
    const ThreadPool = `
public class SwimmingPool {
    private final Worker[] workers;
    private final SequentialWorker sequentialWorker;
    private final Queue<Runnable> taskQueue;
    private final Queue<Runnable> sequentialTaskQueue;
    private volatile boolean isRunning = false;
    
    public SwimmingPool(int poolSize) {
        taskQueue = new Queue<>();
        sequentialTaskQueue = new Queue<>();
        workers = new Worker[poolSize];
        for (int i = 0; i < poolSize; i++) {
            workers[i] = new Worker();
        }
        sequentialWorker = new SequentialWorker();
    }

    public void scheduleTask(Runnable task) {
        synchronized (taskQueue) {
            taskQueue.append(task);
            taskQueue.notify();
        }
    }

    public void scheduleSequentialTask(Runnable task) {
        synchronized (sequentialTaskQueue) {
            sequentialTaskQueue.append(task);
            sequentialTaskQueue.notify();
        }
    }

    public void start() {
        isRunning = true;
        sequentialWorker.start();
        for (Worker worker : workers) {
            worker.start();
        }
    }

    public void shutdown() {
        isRunning = false;
        synchronized (taskQueue) {
            taskQueue.notifyAll();
        }

        synchronized (sequentialTaskQueue) {
            sequentialTaskQueue.notifyAll();
        }
        waitForCompletion();
    }

    private void waitForCompletion() {
        for (Worker worker : workers) {
            try {
                worker.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        try {
            sequentialWorker.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private class Worker extends Thread {
        public void run() {
            while (isRunning || !taskQueue.isEmpty()) {
                Runnable task = null;
                synchronized (taskQueue) {
                    if (!taskQueue.isEmpty()) {
                        task = taskQueue.deQueue();
                    } else {
                        try {
                            taskQueue.wait();
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        }
                    }
                }
                if (task != null) {
                    try {
                        task.run();
                    } catch (RuntimeException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private class SequentialWorker extends Thread {
        public void run() {
            while (isRunning || !sequentialTaskQueue.isEmpty()) {
                Runnable task = null;
                synchronized (sequentialTaskQueue) {
                    if (!sequentialTaskQueue.isEmpty()) {
                        task = sequentialTaskQueue.deQueue();
                    } else {
                        try {
                            sequentialTaskQueue.wait();
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        }
                    }
                }
                if (task != null) {
                    try {
                        task.run();
                    } catch (RuntimeException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}
`
    const output = `
└── test1
    └── test2
└── test3
    ├── test4
    │   └── test5
    │       └── test6
    └── test7
        └── test8
            └── test9
└── test10
    └── test11
        └── test12
            └── test13
                └── test14
                    └── test15
└── test16
└── test17
└── test18
└── test19
└── test20
└── test21
└── test22
└── test23
└── test24
└── test25
└── test26
└── test27
└── test28
└── test29
└── test30
└── test31
└── test32
└── test33
└── test34
└── test35
└── test36
└── test37
└── test38
└── test39
└── test40
└── test41
    ├── test42
    │   └── test43
    │       └── test44
    ├── test45
    │   └── test46
    │       └── test47
    └── test48
        └── test49
            └── test50
└── test51
    └── test52
        └── test53
            └── test54
                └── test55
                    └── test56
└── test57
└── test58
└── test59
└── test60
└── test61
└── test62
└── test63
└── test64
└── test65
└── test66
└── test67
└── test68
└── test69
└── test70
└── test71
└── test72
└── test73
└── test74
└── test75
└── test76
└── test77
└── test78
└── test79
└── test80
└── test81
└── test82
└── test83
└── test84
└── test85
└── test86
└── test87
└── test88
`




    return (
        <div className="flex flex-col items-center text-start">
            <br />
            <Accordion defaultExpandedKeys={["1"]} selectionMode="multiple">
                <AccordionItem key="1" aria-label="User Info" title="Chapter 0: The Glorious Details You Didn't Ask For But Are Required">
                    <p>u23545080</p>
                    <p>Aidan McKenzie</p>
                </AccordionItem>


                <AccordionItem key="2" title="What Ridiculous Output Will This Code Produce Now?">
                    <Accordion selectionMode="multiple" >
                        <AccordionItem key="1" title="Testing">
                            <CodeBlock code={TestingFrameWork}
                                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `150%`, fontSize: '50%' }} />
                            <Divider className="my-4" />
                            <CodeBlock code={TestRunner}
                                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `170%`, fontSize: '70%' }} />
                        </AccordionItem>
                        <AccordionItem key="2" title="Annotations">
                            <CodeBlock code={Test}
                                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `100%` }} />
                        </AccordionItem>
                        <AccordionItem key="3" title="Data Structures">
                            <CodeBlock code={BSomethingNode}
                                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `150%` }} />
                            <Divider className="my-4" />
                            <CodeBlock code={BasicTree}
                                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `160%`, fontSize: '70%' }} />
                            <Divider className="my-4" />
                            <CodeBlock code={Queue}
                                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `100%` }} />
                        </AccordionItem>
                        <AccordionItem key="4" title="Thread Pool">
                            <CodeBlock
                                code={ThreadPool}
                                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `150%` }}
                            />
                        </AccordionItem>
                        <AccordionItem key="5" title="Example tree output">
                            <CodeBlock
                                code={output}
                                style={{ backgroundColor: '#282c34', color: 'white', padding: '20px', width: `65%` }}
                            />

                        </AccordionItem>
                    </Accordion>
                </AccordionItem>
                <AccordionItem key="3" aria-label="User Info" title="Explanation of the results">
                    <p>With the types of testing I did it contained too many sequential parts.
                        Which in this case were the dependency tests. This forced the tests to run sequentially.
                        Whereas the other tests were able to run in parallel.
                        <Divider className="my-4" />
                        In the results we can see that on the SingleRun the parrellel was significantly more unstable/slower
                        than the sequential.
                        <Divider className="my-4" />
                        For the MultipleRuns the parrellel and sequential performed similarly. The parrellel gained 
                        a slight advantage after 16 threads and this is due to the overhead of creating the threads.
                    </p>
                    
                </AccordionItem>
            </Accordion>
            {!isVideoVisible && (
                <Button onPress={onOpen} color="secondary">Show Results</Button>
            )
            }
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
                            width: '120%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 1,
                        }}
                    >
                        <source src="https://i.imgur.com/3NjCTPz.mp4" type="video/mp4" />
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
                        src={"/plots/SingleRun/parrallel_scenario.png"}
                    />
                    <br />
                    <Image
                        isBlurred
                        width={800}
                        height={400}
                        alt="Results"
                        src={"/plots/SingleRun/sequential_scenario.png"}
                    />
                    <br />
                    <Image
                        isBlurred
                        width={800}
                        height={400}
                        alt="Results"
                        src={"/plots/MultipleRuns/10/sequential_scenario.png"}
                    />
                    <br />
                    <Image
                        isBlurred
                        width={800}
                        height={400}
                        alt="Results"
                        src={"/plots/MultipleRuns/10/parrallel_scenario.png"}
                    />
                    <br />
                    <Image
                        isBlurred
                        width={800}
                        height={400}
                        alt="Results"
                        src={"/plots/MultipleRuns/25/sequential_scenario.png"}
                    />
                    <br />
                    <Image
                        isBlurred
                        width={800}
                        height={400}
                        alt="Results"
                        src={"/plots/MultipleRuns/25/parrallel_scenario.png"}
                    />
                    <br />
                </>
            )}
        </div>
    );
}
