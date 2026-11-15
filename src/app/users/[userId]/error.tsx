"use client";

import { AlertCircleIcon } from "lucide-react";
import { useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function UserError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-start justify-center p-8">
      <Alert variant="destructive" role="alert" className="max-w-md">
        <AlertCircleIcon />
        <AlertTitle>Couldn&apos;t load this user&apos;s posts</AlertTitle>
        <AlertDescription>
          <p>Check your connection, then try again.</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => retry()}
          >
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
