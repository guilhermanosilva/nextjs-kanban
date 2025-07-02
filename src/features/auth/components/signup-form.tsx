'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { signup } from '@/features/auth/actions/auth-actions'
import { type SignupForm as SignupFormType, signupSchema } from '@/features/auth/schemas/signup-schema'
import { authMessages } from '@/lib/constants/auth-messages'

export function SignupForm() {
  const form = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: SignupFormType) {
    const errorCode = await signup(data)

    if (errorCode) {
      const message = authMessages[errorCode] || 'Ocorreu um erro inesperado, por favor tente novamente.'
      toast.error(message)
      return
    }

    toast.success('Cadastrado com sucesso.', {
      duration: 10000,
      description: 'Clique no link enviado para seu e-mail para confirmar o cadastro.',
    })
  }

  return (
    <Form {...form}>
      <form className="w-lg space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha:</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full mt-6" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
    </Form>
  )
}
