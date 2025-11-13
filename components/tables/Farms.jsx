import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";

export default function Farms({ farms, onEdit, onDelete }) {
  const router = useRouter();
  return (
    <Card className="p-4 mb-6">
      <div className="w-full">
        <h1 className="font-bold tracking-wider">Your farms</h1>
        <Table>
          <TableCaption>Your registered farms</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>GPS</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {farms.length > 0 ? (
              farms.map((farm) => (
                <TableRow key={farm.id}>
                  <TableCell className="font-medium">{farm.name}</TableCell>
                  <TableCell>{farm.location}</TableCell>
                  <TableCell>{farm.gps}</TableCell>
                  <TableCell>{farm.code}</TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => onEdit(farm)}>
                          Edit
                        </DropdownMenuItem>
                        


                        {/* <DropdownMenuItem
                          onClick={() => onDelete(farm.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No farms registered yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
