import { Ajax } from '../../shared/ajax.utils';

import { Mapping } from  '../../shared/mapping.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

import * as Meal from './meal.service';

//
// POST
//


export function postMenuBranch (menuBranch) {

    return Ajax().post('/menu-branch', {
        body: JSON.stringify(menuBranch),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then(res => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let id = res.obj[0];

        return Promise.resolve(id);
    });
}

export function removeMenuBranch (menuBranch) {
    return Ajax().delete('/menu-branch', {
        body: JSON.stringify(menuBranch),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    });
}
