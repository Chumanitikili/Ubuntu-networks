import { useForm as useHookForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function useForm<T extends z.ZodType>(
  schema: T,
  options?: Omit<UseFormProps<z.infer<T>>, 'resolver'>
) {
  return useHookForm<z.infer<T>>({
    ...options,
    resolver: zodResolver(schema),
  });
}

// Example usage:
/*
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

function LoginForm() {
  const form = useForm(formSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}
      <input type="password" {...form.register('password')} />
      {form.formState.errors.password && (
        <span>{form.formState.errors.password.message}</span>
      )}
      <button type="submit">Login</button>
    </form>
  );
}
*/ 