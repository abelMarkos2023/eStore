import { APP_NAME, SENDER_EMAIL } from '@/lib/constants';
import { Torder } from '@/lib/types';
import {Resend} from 'resend'
import PurchaseReciept from './PurchaseReciept';


const resend = new Resend(process.env.RESEND_API_KEY as string);
export async function sendPurchaseRecieptEmail({order}:{order:Torder}) {

    await resend.emails.send({
        from: `${APP_NAME} <${SENDER_EMAIL}>`,
        to:order.user.email,
        subject: `Your Purchase Receipt from ${APP_NAME}`,
        react: PurchaseReciept({order})
    })
}