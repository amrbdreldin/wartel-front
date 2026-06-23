"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("fixed bottom-20 sm:bottom-6 end-6 z-50 transition-opacity duration-300", isVisible ? "opacity-100" : "opacity-0 pointer-events-none")}>
      <Button
        onClick={scrollToTop}
        size="icon"
        className="h-12 w-12 rounded-full gradient-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6" />
      </Button>
    </div>
  );
}
