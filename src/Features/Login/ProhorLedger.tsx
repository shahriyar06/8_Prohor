export default function OrbitRings() {
  return (
    <div className="relative w-full h-[390px] flex items-center justify-center">
      <div
        className="absolute w-72 h-72 rounded-full border-[3px] opacity-90"
        style={{ borderColor: "#8b5cf6", top: "10%", left: "8%" }}
      />
      <div
        className="absolute w-56 h-56 rounded-full border-[3px] opacity-80"
        style={{ borderColor: "#14b8a6", top: "42%", left: "38%" }}
      />
      <div
        className="absolute w-40 h-40 rounded-full"
        style={{
          background: "linear-gradient(135deg, #8b5cf6, #14b8a6)",
          top: "20%",
          left: "48%",
          filter: "blur(0.5px)",
          opacity: 0.9,
        }}
      />
      <div
        className="absolute w-24 h-24 rounded-full border-2 opacity-40"
        style={{ borderColor: "#a78bfa", bottom: "12%", left: "20%" }}
      />
      {/* Soft ambient glow behind everything */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
      />
    </div>
  );
}