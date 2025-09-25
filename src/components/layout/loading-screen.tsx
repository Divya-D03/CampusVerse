import { LoaderCircle } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
      <p className="mt-4 text-lg font-headline">Loading CampusVerse...</p>
    </div>
  );
}
