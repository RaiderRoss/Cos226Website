import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { title,  } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Welcome to&nbsp;</span>
        <span className="bg-gradient-to-r from-blue-500 via-green-500 to-red-500 text-transparent bg-clip-text text-4xl">
          Cos226 Reports
        </span>

        <br />
        <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-transparent bg-clip-text text-3xl">
          Let's unravel the mysteries of threads and concurrency with a splash of fun!
        </span>
      </div>


      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by navigating to a <Code color="success">practical</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
