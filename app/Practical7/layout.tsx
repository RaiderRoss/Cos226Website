export default function Practical7Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
    <div
      className="fixed inset-0 z-0 bg-auto"
      style={{
        backgroundImage: "url('/images/stack-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)"
        }}
      />
      <div className="absolute inset-0 backdrop-blur-sm"></div>
    </div>
    <div className="relative z-20 inline-block max-w-lg text-center justify-center">
      {children}
    </div>
  </section>
  );
}
