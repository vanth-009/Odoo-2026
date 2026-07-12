import Sidebar from "@/components/Sidebar";

export default function EnvironmentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#09090b]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pl-72 p-8">
        {children}
      </main>
    </div>
  );
}
