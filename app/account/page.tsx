import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Presentation } from "lucide-react";

export default function AccountHomePage() {
  return (
    <div className="max-w-full w-full mx-auto" dir="rtl">
      <Card className="p-8 md:p-14 text-center flex flex-col items-center justify-center border-dashed">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-5 text-primary">
          <Presentation className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold mb-2">فعلاً اینجا خبری نیست!</h2>
        <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
          همین حالا می‌تونی اولین قدمت رو برداری. اگر مطمئن نیستی از کجا شروع کنی، این لینک‌ها کمکت
          می‌کنند.
        </p>
        {/* <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
            شروع یادگیری با دوره‌ها
          </Button>
          <Button variant="outline" className="px-6">
            مشاوره شروع برنامه نویسی
          </Button>
        </div> */}
      </Card>
    </div>
  );
}
