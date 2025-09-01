import { NextRequest } from 'next/server'
import { redirect, RedirectType } from 'next/navigation'

export async function GET(req: NextRequest){
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('query')
    redirect('/', RedirectType.push)
}
