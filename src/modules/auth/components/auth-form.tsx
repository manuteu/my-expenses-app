import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoginMutation } from "../hooks";
import { storageKeys } from "@/shared/config/storage-keys";

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha inválida'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export default function AuthForm() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLoginMutation((data) => {
    sessionStorage.setItem(storageKeys.ACCESS_TOKEN, data.token);
    console.log('success login')
    // changeAuthStatus(true);
    // router.push('/dashboard');

    // setUser(data.user);
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
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {/* {false ? <Spinner size="sm" className='border-secondary border-t-transparent' /> : 'Acessar'} */}
              Acessar
            </Button>

            <Button type='button' variant='ghost' className="w-full" onClick={() => console.log('go to register page')}>
              Cadastrar Conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
