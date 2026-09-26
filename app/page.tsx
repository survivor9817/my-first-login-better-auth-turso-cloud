import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans  ">
      سلام
      <Button
        nativeButton={false}
        render={<Link href="/sign-in">ورود / ثبت‌نام</Link>}
        variant={"unstyled"}
        className="h-11 border-2 border-[#bcbcbc] hover:bg-[#ddd] px-4 transition-colors duration-200 ease-in-out text-sm"
      />
    </div>
  );
}
