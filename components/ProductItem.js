import Link from 'next/link'
import React from 'react'

function ProductItem({product,addToCartHandler}) {
    return (<div className='card'>
        <Link href={`/product/${product.slug}`}><a><img src={product.image} alt={product.name} className="rounded shadow"></img></a></Link>
   <div className='flex flex-col items-center justify-center'><Link href={`/product/${product.slug}`}>
   <h2 className='text-lg'>{product.name}</h2>
   </Link></div>
   <div className='flex flex-col items-center justify-center p-5'>
   <p className='mb-2'>{product.brand}</p>
   <p>${product.price}</p>
   <button className='primary-button' type='button' onClick={()=>addToCartHandler(product)}>
    Add to cart
   </button>
   </div>
    </div>
        
    )
}

export default ProductItem
