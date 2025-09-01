import { NextRequest } from 'next/server'
import { redirect, RedirectType } from 'next/navigation'

export async function GET(req: NextRequest){
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code')
    // TODO: Logic to check this against initail state to protect agains xsr attacks
    const state = searchParams.get('state')
    redirect('/', RedirectType.push)
}
