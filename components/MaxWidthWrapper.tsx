import { classMerge } from "@/lib/utilityfunctions";

interface IProps {
  className?: string;
  children: React.ReactNode;
}
export default function MaxWidthWrapper({ className, children }: IProps) {
  return(
    <div className={classMerge("mx-auto w-full max-w-screen-xl px-2.5 md:px20", className)}>
      {children}
    </div>
  )
}