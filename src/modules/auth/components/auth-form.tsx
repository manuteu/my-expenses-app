import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoginMutation } from "../hooks/useLogin";
import { storageKeys } from "@/shared/config/storage-keys";
import { useAuthStore } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha inválida'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export default function AuthForm() {
  const { changeAuthStatus } = useAuthStore()
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLoginMutation((data) => {
    sessionStorage.setItem(storageKeys.ACCESS_TOKEN, data.token);
    changeAuthStatus(true);
  })

  return (
    <section className='flex flex-col justify-center items-center h-screen gap-10'>
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
            <div className='flex flex-col gap-2'>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              Acessar
            </Button>
            <Button type='button' variant='ghost' className="w-full" onClick={() => navigate('/')}>
              Cadastrar Conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
