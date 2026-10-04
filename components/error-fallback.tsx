type Props = {
  onRefetch: () => void;
  ErrorMsg?: string;
};

const ErrorFallback = ({ onRefetch, ErrorMsg = "خطا در بارگذاری" }: Props) => {
  return (
    <div className="flex justify-center items-center gap-2 text-sm">
      <span className="text-red-500">{ErrorMsg}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRefetch();
        }}
        className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors cursor-pointer"
      >
        تلاش مجدد ↻
      </button>
    </div>
  );
};

export default ErrorFallback;
