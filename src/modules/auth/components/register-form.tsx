import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRegisterMutation } from "../hooks/useRegister";
import { storageKeys } from "@/shared/config/storage-keys";
import { useAuthStore } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome inválido'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha inválida'),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { changeAuthStatus } = useAuthStore()
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: registerUser, isPending } = useRegisterMutation((data: { token: string }) => {
    sessionStorage.setItem(storageKeys.ACCESS_TOKEN, data.token);
    changeAuthStatus(true);
  })

  return (
    <section className='flex flex-col justify-center items-center h-screen gap-10'>
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle>Cadastrar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => registerUser(data))} className="space-y-4">
            <div className='flex flex-col gap-2'>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" type="text" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              Cadastrar
            </Button>
            <Button type='button' variant='ghost' className="w-full" onClick={() => navigate('/sign-in')}>
              Já tem conta? Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
} 