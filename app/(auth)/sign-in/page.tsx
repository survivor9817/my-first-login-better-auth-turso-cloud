import SignInForm from "@/components/auth/sign-in/sign-in-form";

const page = async () => {
  // const session = await auth.api.getSession({ headers: await headers() });
  // if (session) {
  //   redirect("/");
  // }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10">
      <SignInForm />
    </div>
  );
};

export default page;
