import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Home from './src/screens/home'; 

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}> 
      <Home />
    </QueryClientProvider>
  ); // o provider deixa usar o react query no home
}

// configuração do react query para a aplicação