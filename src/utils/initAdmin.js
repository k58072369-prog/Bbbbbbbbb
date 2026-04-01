import { supabase } from '../supabaseClient'

export const initAdmin = async () => {
  try {
    // 1. Check if admin exists
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .single()

    if (adminProfile) return

    // 2. If not exists, create admin user
    const adminEmail = 'itqan319@gmail.com'
    const adminPass = 'adhammmm'

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPass,
    })

    if (signUpError) {
      // If user already exists in auth but not in profiles
      if (signUpError.message.includes('User already registered')) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPass,
        })
        
        if (signInData.user) {
          await createAdminProfile(signInData.user.id)
        }
      }
      return
    }

    if (authData.user) {
      await createAdminProfile(authData.user.id)
    }
  } catch (err) {
    console.error('Init Admin Error:', err)
  }
}

async function createAdminProfile(userId) {
  const { error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      name: 'Admin',
      phone: '01127416995',
      parent_phone: '01104156137',
      grade: 'تانية ثانوي',
      education_type: 'أزهر',
      role: 'admin'
    })
  
  if (insertError) console.error('Create Admin Profile Error:', insertError)
}
