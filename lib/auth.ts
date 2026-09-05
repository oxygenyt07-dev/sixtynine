import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { serverSupabase } from './supabase';

export const LOCAL_ADMIN_COOKIE = 'sixtynine_admin';

export function localAdminToken(username: string, password: string) {
	return createHash('sha256').update(`${username}:${password}:${process.env.ADMIN_PASSWORD || 'pass 1'}`).digest('hex');
}

function validLocalToken(value: string | undefined) {
	if (!value) return false;
	const expected = localAdminToken(process.env.ADMIN_USERNAME || 'user 1', process.env.ADMIN_PASSWORD || 'pass 1');
	return value.length === expected.length && timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export async function requireAdmin(){
	const supabase=await serverSupabase();
	if(!supabase){
		const localSession=(await cookies()).get(LOCAL_ADMIN_COOKIE)?.value;
		return validLocalToken(localSession)?{email:'local-admin'}:null;
	}
	const {data:{user}}=await supabase.auth.getUser();
	if(!user||user.email!==process.env.ADMIN_EMAIL)return null;
	return user;
}
