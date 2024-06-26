import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../app/services/authService';
import { SignupParams } from '../../../app/services/authService/signup';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../app/hooks/useAuth';

const schema = z.object({
  name: z.string().nonempty('Nome é obrigatório!'),
  email: z
    .string()
    .nonempty('E-mail é obrigatório.')
    .email('Informe um E-mail válido.'),
  password: z
    .string()
    .nonempty('Senha é obrigatório')
    .min(8, 'Senha deve conter pelo menos 8 dígitos.'),
});

type FormData = {
  name: string;
  email: string;
  password: string;
};

//type FormData = z.infer<typeof schema>;

export const useRegisterController = () => {
  const {
    handleSubmit: hookFormHandleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { isPending: isLoading, mutateAsync } = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (data: SignupParams) => {
      return authService.signup(data);
    },
  });

  const { signin } = useAuth();

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      const { accessToken } = await mutateAsync(data); //Retorno da mutation Function
      signin(accessToken);
    } catch {
      toast.error('Ocorreu o erro ao criar sua conta!');
    }
  });

  return { handleSubmit, register, errors, isLoading };
};
