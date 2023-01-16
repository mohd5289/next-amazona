import '../styles/globals.css'
import { StoreProvider } from '../utils/Store'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
function MyApp({ Component, pageProps :{session,...pageProps}}) {
  return  (<SessionProvider session={session}><StoreProvider><PayPalScriptProvider deferLoading={true} options={{ "client-id": 'AacVWMVGgT9MFBE_1jiqPKI1WIF0aTmgmwBSd1z7XgSQXsw69RlajOZm8-JT3FEK45Nz_zA1E0DCIJf6' }}>
    {Component.auth?(<Auth><Component {...pageProps} /></Auth>):<Component{...pageProps}/>}</PayPalScriptProvider></StoreProvider></SessionProvider>)
}

function Auth({children}){
  const router = useRouter();
  const{status, data:session}= useSession({required:true, onUnauthenticated(){router.push('/unauthorized?message=login required')},})
if(status==='loading'){
  return<div>Loading...</div>
}
return children;
}
export default MyApp
