import { IdentitySection } from "./identity-section";
import { ContactSection } from "./contact-section";

export function Profile() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6" dir="rtl">
      <IdentitySection />
      <ContactSection />
    </div>
  );
}
