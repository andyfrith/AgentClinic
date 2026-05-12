import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AilmentsNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-muted-foreground mb-4">Ailments Not Found</h1>
      <p className="text-muted-foreground mb-6">The ailments page could not be found.</p>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
