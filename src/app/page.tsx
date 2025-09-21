import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return <p>Hello {data.user?.email}</p>
}