import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface ActionConfirmRef {
  show: () => void;
  hide: () => void;
}

interface ActionConfirmProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  withReason?: boolean;
  isRequireReason?: boolean;
  onConfirm?: (reason?: string) => void;
  onCancel?: () => void;
}

export const ActionConfirm = forwardRef<ActionConfirmRef, ActionConfirmProps>(
  (
    {
      title = "Xác nhận",
      message = "Bạn có chắc chắn muốn thực hiện hành động này?",
      confirmText = "Xác nhận",
      cancelText = "Hủy",
      variant = "default",
      withReason = false,
      isRequireReason = false,
      onConfirm,
      onCancel,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      show: () => setOpen(true),
      hide: () => setOpen(false),
    }));

    const handleConfirm = async () => {
      if (isRequireReason && !reason.trim()) return;
      setLoading(true);
      try {
        await onConfirm?.(withReason ? reason : undefined);
        setOpen(false);
        setReason("");
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      setOpen(false);
      setReason("");
      onCancel?.();
    };

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>

          {withReason && (
            <div className="space-y-2">
              <Label htmlFor="confirm-reason" className="text-xs font-medium">
                Lý do{" "}
                {isRequireReason && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="confirm-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do..."
                className="w-full"
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading} onClick={handleCancel}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              variant={variant}
              disabled={loading || (isRequireReason && !reason.trim())}
              onClick={handleConfirm}
            >
              {loading ? "Đang xử lý..." : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

ActionConfirm.displayName = "ActionConfirm";
