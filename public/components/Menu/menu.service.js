import { Ajax } from '../../shared/ajax.utils';

import { Mapping } from  '../../shared/mapping.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

import * as MenuCategory from './menu-category.service';
import * as MenuLanguage from './menu-language.service';
import * as Meal from './meal.service';


export function updateMenu (opts) {
    if (opts.id) {
        return MenuCategory.updateMenuCategories(opts.categories)
            .then(MenuLanguage.updateMenuLanguages(opts.id, opts.languages))
            .then(Ajax().put('/menu', {
              body: JSON.stringify(convertOpts(opts, true)),
              headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
              }
            }));
    } else {
        return Ajax().get('/menu', {
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
            }
        }).then(res => {
            console.log(res);
            if (!res || !res.success) {
                return Promise.reject(res);
            }

            let menus = res.obj;
            let ids = menus.map(menu => menu.MenuID);
            let nextID = Math.max(...ids) + 1;

            console.log(ids);
            console.log(nextID);

            return nextID;
        }).then((id) => {
            return MenuCategory.postMenuCategories(id, opts.categories)
                .then(MenuLanguage.postMenuLanguages(id, opts.languages))
                .then(res => {
                    let obj = opts;
                    return Promise.all(opts.branches.map(branch => {
                        obj.branchId = branch.BranchID;
                        return postMenu(obj);
                    }))
                }).then(ids => {
                    console.log('last modif');
                    console.log([].concat.apply([], ids));
                    return [].concat.apply([], ids);
                });
        });
    }
}

function postMenu (obj) {
    return Ajax().post('/menu', {
        body: JSON.stringify(convertOpts(obj, false)),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    });
}


export function getMenus () {
    let menus;
    return Ajax().get('/menu', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        menus = res.obj;

        let ids = res.obj.map(menu => menu.MenuID).filter((id, i, self) => {
            return self.indexOf(id) === i;
        });

        console.log(menus);
        console.log(ids);

        return Promise.all(ids.map((id) => {
            return MenuCategory.getMenuCategory(id);
        }));
    }).then((res) => {
        console.log(res);

        let categories = (res && res.length > 0) ? res.reduce((acc, current) => {
            return (current.categories && current.categories.length > 0) ? acc.concat([current]) : acc;
        }, []) : null;

        let finalMenus = categories.map(cat => {
            let matchingMenu = (menus && menus.length > 0) ? menus.find(menu => {
                return parseInt(cat.id, 10) === parseInt(menu.MenuID, 10);
            }) : null;

            if (matchingMenu) {
                let newMenu = cat;
                newMenu.price = matchingMenu.Price;
                newMenu.title = matchingMenu.Title;
                newMenu.description = matchingMenu.Description;

                return newMenu;
            }

            return cat;
        });

        console.log(finalMenus);

        return finalMenus;
    });
}


//
// TRANSLATE
//

export function getMenuTranslations () {
    return Ajax().get('/translate-menu', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let ids = res.obj.map(menu => menu.MenuID).filter((id, i, self) => {
            return self.indexOf(id) === i;
        });

        console.log(ids);

        return Promise.all(ids.map((id) => {
            return getMenuTranslation(id, res.obj);
        }));
    });
}

export function getMenuTranslation (id, translations) {
    let menuCategoryTranslations;
    let menuTranslations = translations;
    let mealTranslations;

    console.log(menuTranslations);

    return MenuCategory.getMenuCategoryTranslations([id]).then((res) => {
        console.log(res);

        menuCategoryTranslations = res;

        return Promise.all(res.map((cat) => {
            return Meal.getMealTranslations([cat.MenuCategoryID]);
        }));
    }).then((res) => {
        console.log(res);

        mealTranslations = res;

        let menu = menuTranslations.filter((menuTranslation) => {
            return menuTranslation.MenuID === id;
        }).reduce((acc, menuTranslation) => {
            acc['original' + menuTranslation.PropKey] = menuTranslation.OriginalText;
            acc[menuTranslation.PropKey] = menuTranslation.Text;
            return acc;
        }, {
            // Generate random id here
            id: 987248947
        });

        menu.categories = menuCategoryTranslations.map((cat) => {
            let finalCat = cat;
            finalCat.meals = Array.prototype.concat(...mealTranslations).filter((meal, index) => {
                return meal.MenuCategoryID === cat.MenuCategoryID;
            });
            return finalCat;
        });

        console.log(menu);

        return menu;
    });
}

export function translateMenu (opts, mode) {
    console.log(opts);

    let propsToTranslate = Object.keys(opts).filter((key) => {
        return (key === 'title' || key === 'description') && (opts[key] && opts[key].length > 0);
    }).map((key) => {
        return {
            key: key,
            value: opts[key]
        };
    });

    return Ajax().get('/menu', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        console.log(res);

        let menuId = res.obj.find((menu) => {
            return opts.description === menu.Description && opts.title === menu.Title && parseInt(opts.price, 10) === parseInt(menu.Price, 10);
        }).MenuID;

        // Convert to correct syntax
        opts.languages = opts.languages.map(lang => {
            return {
                code: lang.Code,
                codeFull: lang.CodeFull,
                date: lang.Date,
                dateUpdated: lang.DateUpdated,
                flagId: lang.FlagID,
                id: lang.LanguageID,
                name: lang.Name,
                title: lang.Title
            };
        });

        return MenuCategory.translateMenuCategories(menuId, opts.languages, opts.categories)
            .then((res) => {
                console.log('translation request finished');
                console.log(res);

                return Promise.all(opts.languages.map((lang) => {
                    return propsToTranslate.map((prop) => {
                        return Ajax().post('/translate-menu', {
                            body: JSON.stringify(convertForTranslation(lang, {type: 'menu', id: menuId, prop: prop})),
                            headers: {
                                "content-type": "application/json",
                                "cache-control": "no-cache",
                                "x-access-token": StorageManagerInstance.read('token')
                            }
                        });
                    });
                }));
            });
    });
}

function convertForTranslation (lang, obj) {
    switch (obj.type) {
        case 'menu':
        console.log({
                obj: {
                    menuId: obj.id,
                    key: obj.prop.key,
                    title: 'Menu ' + obj.id + ', translation: ' + obj.prop.key,
                    sl: 'English',
                    tl: lang.title || lang.name,
                    payload: obj.prop.value
                }
        });
            return {
                obj: {
                    menuId: obj.id,
                    key: obj.prop.key,
                    title: 'Menu ' + obj.id + ', translation: ' + obj.prop.key,
                    sl: 'English',
                    tl: lang.title || lang.name,
                    payload: obj.prop.value
                }
            };
    }
}

export function deleteMenu (menu) {
    console.log('deletion!!!');
    console.log(menu);

    return new Promise((resolve, reject) => {
        Ajax().delete('/menu', {
            body: JSON.stringify({id: menu.id}),
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
            }
        }).then(res => {
            if (!res || !res.success) {
                reject(res);
            }

            resolve(res.obj);
        }).catch(err => {
            reject(err);
        });
    });
}


function convertOpts (opts, isUpdate) {
    console.log(opts);

/*
    if (!opts.id) {
        console.error('The menu id to update is not specified!');
        return;
    }
    */

    let id = opts.id;
    let obj = Object.keys(opts).reduce((acc, current) => {
        let matchingKeys = [];
        for (let key of Mapping.getTableMap('menu').keys()) {
            if (current === key) {
                matchingKeys.push(key);
            }
        }

        if (matchingKeys.length > 0) {
            acc[Mapping.getDBString('menu', current)] = opts[current];
        }
        return acc;
    }, {});
    //

    console.log({id: id, updates: obj});

    return (isUpdate) ? {
        id: id,
        updates: obj
    } : {
        obj: obj
    };
}

