"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  withSidebarOffset?: boolean;
  className?: string;
}

export default function BackButton({
  onClick,
  label = "Volver",
  disabled = false,
  className,
}: BackButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn("gap-1.5 text-muted-foreground hover:text-foreground", className)}
    >
      <ChevronLeft className="size-4" />
      {label}
    </Button>
  );
}
