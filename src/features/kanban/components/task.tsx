"use client";

import React from "react";
import { PencilIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Task() {
  return (
    <div className="bg-background flex flex-col gap-2 rounded-md border p-2">
      <header className="flex items-center justify-between">
        <span className="text-sm">Titulo</span>
        <Button variant="link" className="size-5 hover:opacity-70">
          <PencilIcon />
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-1">
        <Badge variant="secondary" size="xxs">
          Fronte
        </Badge>
        <Badge variant="secondary" size="xxs">
          Badge
        </Badge>
        <Badge variant="secondary" size="xxs">
          Badge
        </Badge>
        <Badge variant="secondary" size="xxs">
          Badge
        </Badge>
      </div>

      <div>
        <span className="text-xs opacity-70">Descrição</span>
      </div>
    </div>
  );
}
