import { Ajax } from '../../shared/ajax.utils';

import { Mapping } from  '../../shared/mapping.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

//
// POST
//

export function postMenuLanguages (nextId, langs) {
    // Compare menu categories in the object to the categories in the DB
    let ids = langs.map(c => c.id)
    //let languages = getMenuLanguages(ids);
    return Promise.all(langs.map((lang) => {
        return postMenuLanguage(nextId, lang);
    }));
}

export function postMenuLanguage (nextId, lang) {
    if (!lang.id) {
        console.error('Menu language id is not specified!');
        return;
    }

    return Ajax().post('/menu-language', {
        body: JSON.stringify({
            obj: {
                MenuID: nextId,
                BranchLanguageID: lang.id,
            }
        }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    });
}

//
// UPDATE
//
export function updateMenuLanguages (menuId, langs) {
    // Compare menu categories in the object to the categories in the DB
    let ids = langs.map(c => c.id)
    //let languages = getMenuLanguages(ids);
    return Promise.all(langs.map((lang) => {
        return updateMenuLanguage(lang);
    }));
}

export function updateMenuLanguage (lang) {
    if (!lang.id) {
        console.error('Menu language id is not specified!');
        return;
    }

    // Get the branchlanguage ID then
    return getMenuLanguage(lang.id).then((menuLanguage) => {
        return Ajax().put('/menu-language', {
            body: JSON.stringify({
                id: lang.id,
                updates: {
                    BranchLanguageID: menuLanguage.BranchLanguageID
                }
            }),
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
            }
        });
    });
}

function getMenuLanguage (id) {
    if (!id) {
        return Promise.resolve();
    }

    return new Promise(resolve => {
        console.log(StorageManagerInstance.read('token'));
        Ajax().get('/menu-language', {
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
            }
        }).then((languages) => {
            console.log(languages);
            if (languages.obj && languages.obj.length > 0) {
                resolve(languages.obj.find((lang) => {
                    return lang.MenuLanguageID === id;
                }));
            }
        }).catch((err) => {
            console.error(err);
        });
    });
}


//
// REMOVE
//
export function removeMenuLanguages () {

}

export function removeMenuLanguage () {

}



