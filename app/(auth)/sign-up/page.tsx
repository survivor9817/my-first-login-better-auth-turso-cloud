import SignUpForm from "@/components/auth/sign-up/sign-up-form";

const page = async () => {
  // const session = await auth.api.getSession({ headers: await headers() });
  // if (session) {
  //   redirect("/");
  // }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10">
      <SignUpForm />
    </div>
  );
};

export default page;
