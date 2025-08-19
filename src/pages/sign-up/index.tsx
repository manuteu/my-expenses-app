import RegisterForm from "@/modules/auth/components/register-form";
import { ModeToggle } from "@/widgets/toggle-theme";

export default function SignUp() {
  return (
    <main className="bg-background">
      <RegisterForm />
      <div className="fixed bottom-6 right-6">
        <ModeToggle />
      </div>
    </main>
  )
} 