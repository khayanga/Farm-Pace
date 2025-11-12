import SensorForm from "@/components/sensors/SensorForm";
import SensorTable from "@/components/sensors/SensorTable";
import db from "@/lib/prisma"; 

export const dynamic = "force-dynamic"; 

export default async function Page() {
  const farms = await db.farm.findMany({
    select: { id: true, name: true, code: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="p-6 space-y-8">
      <SensorForm farms={farms} />
      <SensorTable />
    </main>
  );
}
