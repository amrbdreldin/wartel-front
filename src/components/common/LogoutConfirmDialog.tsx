"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutConfirmDialog({ open, onOpenChange }: LogoutConfirmDialogProps) {
  const t = useTranslations();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <LogOut className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl">
            {t("auth.logoutConfirmTitle") || "Confirm Logout"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("auth.logoutConfirmDesc") || "Are you sure you want to log out of your account?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-3 sm:justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex-1"
          >
            {t("common.logout") || t("auth.logout")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
