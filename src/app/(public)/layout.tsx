import Navbar from "@/components/layout/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}