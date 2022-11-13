import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout'

function LoginScreen() {
    const router = useRouter();
    const{
        handleSubmit,
        register,
        formState:{errors},
    }= useForm();
const submitHandler=({email,password})=>{
console.log(email,password)
}
    return (
        <Layout title="Login"><form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
            <h1 className='mb-4 text-xl'>Login</h1>
            <div className='mb-4'>
           
                <label htmlFor='email'>Email</label>
                <input type="email"  {...register('email',{required:'Please enter email',
                 pattern:{value:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message:'Please enter valid email address',}}, 
                   )}
                 className= "w-full" id="email" autofocus></input>
                   {errors.email && (<div className='text-red-500'>{errors.email.message}</div>)}
            </div>
            <div className='mb-4'>
            
                <label htmlFor='password'>Password</label>

                <input type="password" 
                 {...register('password',{required:'Please enter password',
                 minLength:{value:6,
                message:'password is more than 5 chars',}}, 
                   )}
                className= "w-full" id="password" autofocus></input>
           {errors.password && (<div className='text-red-500'>{errors.password.message}
            </div>)} </div>
            <div className='mb-4'>
                
                <button onClick={()=>router.push('login?redirect=/shipping')} className='primary-button'>Login</button>
            </div>
            <div className='mb-4'>
                Don&apos;t have an account? &nbsp;
                <Link href= "register"> Register</Link>
            </div>
            </form></Layout>
    )
}

export default LoginScreen