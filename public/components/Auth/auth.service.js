import { Ajax } from '../../shared/ajax.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

export function auth (data, opts) {
    return new Promise((resolve, reject) => {
        if (!data.auth.Email || !data.auth.Pwd) {
            reject({
                success: false,
                error: 'Please enter a valid Email/Password',
            });

            return;
        }

        Ajax().post('/auth', opts).then(res => {
            if (!res || !res.success) {
                reject({
                    success: false,
                    error: err
                });
            }

            resolve(res);
        }).catch(err => {
            reject({
                success: false,
                error: err
            });
        });
    });
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
