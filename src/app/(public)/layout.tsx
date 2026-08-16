import Navbar from "@/components/layout/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex-1 overflow-y-auto no-scrollbar py-4 px-8">
        {children}
      </main>
    </>
  );
}
