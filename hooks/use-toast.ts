import { toast as sonnerToast } from "sonner";
import { ToastAction, type ToastProps } from "@/components/ui/toast"; // Import ToastProps from toast.tsx
import { VariantProps } from "class-variance-authority"; // Import VariantProps

type Toast = typeof sonnerToast;

interface CustomToastProps extends ToastProps, VariantProps<any> {
  title?: string;
  description?: string;
  action?: React.ReactElement<typeof ToastAction>;
}

export function useToast() {
  const toast = ({
    title,
    description,
    action,
    ...props
  }: CustomToastProps) => {
    return sonnerToast(title, {
      description,
      action,
      ...props,
    });
  };

  return {
    toast,
  };
}
