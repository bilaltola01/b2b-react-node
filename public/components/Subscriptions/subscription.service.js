import { Ajax } from '../../shared/ajax.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

export function getDigitalMenuPlans () {
  return Ajax().get('/plans/digital-menu', {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "x-access-token": StorageManagerInstance.read('token')
    }
  }).then((res) => {
    if (!res || !res.success) {
      return Promise.reject(res);
    }

    let plan = res.obj;

    return plan;
  });
}