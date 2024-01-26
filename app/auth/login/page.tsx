

import { getServerSession } from 'next-auth';
import Form from './Form';
import { redirect } from 'next/navigation';

const Login = async () => {

  const currentsession = await getServerSession();

  if(currentsession){
    redirect('/');
  }

  return (
    <Form />
  )

}

export default Login