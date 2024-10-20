import Pocketbase from 'pocketbase';
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers';


const PB_URL = 'https://pocket.leaselogic.app';

export async function initPocketbaseFromCookie() {
  const pb = new Pocketbase(PB_URL);

  // load state from cookie, won't refresh auth, middleware handles that.
  pb.authStore.loadFromCookie(cookies().get('pb_auth')?.value  || '');
  
  return pb;
}

export async function initPocketBaseFromRequest(request: NextRequest) {
    const pb = new Pocketbase(PB_URL);
  
    // load the store data from the request cookie string
    pb.authStore.loadFromCookie(request?.cookies.get('pb_auth')?.value || '');
  
    // send back the default 'pb_auth' cookie to the client with the latest store state
    pb.authStore.onChange(() => {
      request.cookies.set('pb_auth', pb.authStore.exportToCookie());
    });
  
    try {
      // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh();
      }
    } catch (error) {
      // clear the auth store on failed refresh
      pb.authStore.clear();
      console.error('Failed to refresh auth:', error);
    }
  
    return pb
  }