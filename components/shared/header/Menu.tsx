import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import ModeToggler from "./ModeToggler";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./UserButton";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggler />
        <Button variant="ghost" size="sm">
          <Link href="/cart" className="flex items-center">
            <ShoppingCart className="mr-1" />
            Cart
          </Link>
        </Button>
        <UserButton />
        
      </nav>

      {/* Mobile Toggler */}

      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <EllipsisVertical />
          </SheetTrigger>

          <SheetContent className="flex flex-col items-start p-4">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggler />
            <Button variant="ghost" size="sm">
              <Link href="/cart" className="flex items-center">
                <ShoppingCart className="mr-1" />
                Cart
              </Link>
            </Button>
              <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
