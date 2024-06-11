import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="p-5 mt-5 flex justify-center items-center right-5">
      <SignUp path="/sign-up" />
    </div>
  )
}