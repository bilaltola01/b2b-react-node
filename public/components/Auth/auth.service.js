import { Ajax } from '../../shared/ajax.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

export function auth (opts) {
    return Ajax().post('/auth', opts);
}

export function isAuthenticated () {
    return StorageManagerInstance.read('token');
}

export function getAuth () {
    let token = isAuthenticated();
    if (token) {
      return {
        authenticated: true,
        completed: true,
        token: token
      };
    }

    return {
        authenticated: false,
        completed: true
    };
}
