import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ForgotPasswordLinkProps {
  promptText?: string;
  actionText?: string;
  href?: string;
  className?: string;
}

const ForgotPasswordLink = ({
  promptText = "رمزت یادت رفته؟",
  actionText = "بازیابی کلمه عبور",
  href = "/forgot-password",
  className,
}: ForgotPasswordLinkProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-1.5 text-sm", className)}>
      <span className="text-muted-foreground">{promptText}</span>
      <Button
        render={<Link href={href} />}
        nativeButton={false}
        variant="link"
        className="h-auto p-0 text-sm font-bold underline underline-offset-2"
      >
        {actionText}
      </Button>
    </div>
  );
};

export default ForgotPasswordLink;
