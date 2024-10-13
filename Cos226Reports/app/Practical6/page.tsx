"use client";
import { useState } from "react";
import { title } from "@/components/primitives";
import { Image } from "@nextui-org/react";
import { Slider } from "@nextui-org/slider";

export default function Practical6Page() {
  const [option, setOption] = useState(0);
  const [operation, setOperation] = useState(0);
  const [contention, setContention] = useState(0);

  const getImageSrc = () => {
    const folder = option === 0 ? "100" : option === 1 ? "500" : "1000";
    const level = contention === 0 ? "high" : contention === 1 ? "medium" : "low";
    const op = operation === 0 ? "addOnly" : operation === 1 ? "addAndContains" : operation === 2 ? "addAndRemove" : "addAndRemoveAndContains";
    console.log(`../${folder}/${op}/combined_${level}_scenarios.png`);
    return `../${folder}Operations/${op}/combined_${level}_scenarios.png`;
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className={title()}>This is the page for<br /> practical 6 plots</h1>
      <br />
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
    </div>
  );
}
