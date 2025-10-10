import CartTable from '@/components/shared/cart/CartTable';
import { getMyCart } from '@/lib/actions/cart.actions'


export const dynamic = 'force-dynamic';
const CartPage = async() => {

    const cart = await getMyCart();
  return (
    <div>
        <CartTable cart={cart} />
    </div>
  )
}

export default CartPage