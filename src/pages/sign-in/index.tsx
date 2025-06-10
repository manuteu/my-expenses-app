import AuthForm from "@/modules/auth/components/auth-form";
import { ModeToggle } from "@/widgets/toggle-theme";

export default function SignIn() {
  return (
    <main className="bg-background">
      <AuthForm />
      <div className="fixed bottom-6 right-6">
        <ModeToggle />
      </div>
    </main>
  )
}
