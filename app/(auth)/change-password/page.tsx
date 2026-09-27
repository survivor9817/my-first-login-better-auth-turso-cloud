import ChangePasswordForm from "@/components/auth/change-password/change-password-form";

const page = async () => {
  // const session = await auth.api.getSession({ headers: await headers() });
  // if (session) {
  //   redirect("/"); // redirect to change password section. or maybe not
  // }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10">
      <ChangePasswordForm />
    </div>
  );
};

export default page;
