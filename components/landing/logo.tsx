import { University } from "lucide-react";

type Props = {};

const Logo = (props: Props) => {
  return (
    <a href="/" className="flex items-center mr-2 ">
      <University />

      <div className="text-2xl my-1 px-2 rounded-3xl border-[#bcbcbc] ">لوگو</div>
    </a>
  );
};

export default Logo;
