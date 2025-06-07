import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Label } from './components/ui/label'
import { Input } from './components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha inválida'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

function App() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <section className='flex flex-col justify-center items-center h-screen gap-10'>
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => console.log(data))} className="space-y-4">
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

            <Button type="submit" className="w-full" disabled={false}>
              {/* {false ? <Spinner size="sm" className='border-secondary border-t-transparent' /> : 'Acessar'} */}
              Acessar
            </Button>

            <Button type='button' variant='ghost' className="w-full" onClick={() => console.log('go to register page') }>
              Cadastrar Conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default App
