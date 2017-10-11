import { Ajax } from '../../shared/ajax.utils';

import { Mapping } from  '../../shared/mapping.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

import * as Meal from './meal.service';

//
// POST
//


export function postMenuCategories (nextId, cats) {
    return Promise.all(cats.map((cat) => {
        return Meal.postMeals(cat.meals).then((res) => {
            return postMenuCategory(nextId, cat);
        });
    }));
}


export function postMenuCategory (nextId, cat) {
    console.log(cat);

    cat.menuId = nextId;

    if (cat.MenuCategoryID) {
        delete cat.MenuCategoryID;
    }

    return Ajax().post('/menu-category', {
        body: JSON.stringify(convertOpts(cat, false)),
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
export function updateMenuCategories (cats) {
    if (cats.length <= 0) {
        return removeMenuCategories();
    }

    return Promise.all(cats.map((cat) => {
        return Meal.updateMeals(cat.meals).then((res) => {
            return updateMenuCategory(cat);
        });
    }));
}

export function updateMenuCategory (cat) {
    if (!cat.id) {
        console.error('Category id is not specified!');
        return;
    }

    return Ajax().put('/menu-category', {
        body: JSON.stringify(convertOpts(cat, true)),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    });
}

function getMenuCategories (ids) {
    return Ajax().get('/menu-category', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let cats = res.obj;

        if (ids.length <= 0) {
            return cats;
        }

        return cats.filter((cat, index) => {
            return cat.MenuCategoryID === ids[index];
        });
    });
}

export function getMenuCategory (id) {
    let categories;
    let meals;

    return Ajax().get('/menu-category', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let cats = res.obj;

        return cats.filter((cat, index) => {
            return cat.MenuID === id;
        });
    }).then((res) => {
        categories = res;

        return Ajax().get('/meal', {
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
            }
        });
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        meals = res.obj;

        return Ajax().get('/category-standard', {
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
            }
        });
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        console.log(res.obj);

        let cats = categories.reduce((acc, menucat) => {
            let tmp = res.obj.filter(cat => {
                return parseInt(cat.CategoryStandardID, 10) === parseInt(menucat.CategoryID, 10);
            }).map(cat => {
                let newCat = cat;
                newCat.MenuCategoryID = menucat.MenuCategoryID;
                return newCat;
            });
            return (tmp && tmp.length > 0) ? acc.concat(tmp) : acc;
        }, []);

        console.log(categories); // menu categories
        console.log(cats);
        console.log(meals);


        let returns = (cats && cats.length > 0) ? cats.map((cat) => {
            let tmpcat = {
                id: cat.CategoryStandardID,
                isCustom: false,
                title: cat.Title,
                description: cat.Description,
            };
            tmpcat.meals = meals.filter((meal) => {
                return cat.MenuCategoryID === meal.MenuCategoryID;
            }).map((meal) => {
                return {
                    id: meal.MealID,
                    title: meal.Title,
                    description: meal.Description,
                    price: parseFloat(meal.Price) || null,
                    enableDetails: meal.enableDetails,
                    detail: {}
                };
            });
            return tmpcat;
        }) : null;

        console.log(returns);
        return {
            id: id,
            categories: returns
        };
    });
}


//
// TRANSLATE
//

export function getMenuCategoryTranslations (ids) {
    return Ajax().get('/translate-menu-category', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let menuCategoryTranslations = res.obj;

        let menuCategoriesIds = res.obj.map(menu => menu.MenuCategoryID);

        // Get menu categories macthing menu id
        return Ajax().get('/menu-category', {
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
            }
        }).then((res) => {
            if (!res || !res.success) {
                return Promise.reject(res);
            }

            let menucats = res.obj;

            let menuCategories = ids.reduce((acc, current) => {
                return acc.concat(res.obj.filter((cat) => {
                    return cat.MenuID === current;
                }));
            }, []);

            console.log(menuCategories);

            let menuCategories2 = menuCategories.reduce((acc, current) => {
                return acc.concat(menuCategoryTranslations.reduce((acc_translation, curr_translation) => {
                    let t = curr_translation;
                    t.MenuID = current.MenuID;
                    return (curr_translation.MenuCategoryID === current.MenuCategoryID)
                        ? acc_translation.concat(t)
                        : acc_translation;
                }, []));
            }, []);

            console.log(menuCategories2);

            

            return menuCategories2;
        });
    });
}

export function translateMenuCategories (langs, categories) {
    return Promise.all(categories.map((cat) => {
        return Meal.translateMeals(langs, cat.meals).then((res) => {
            return translateMenuCategory(langs, cat);
        });
    }));
}

export function translateMenuCategory (langs, cat) {
    if (!cat.id) {
        console.error('Category id is not specified!');
        return;
    }

    let propsToTranslate = Object.keys(cat).filter((key) => {
        return (key === 'title') && (cat[key] && cat[key].length > 0);
    }).map((key) => {
        return {
            key: key,
            value: cat[key]
        };
    });

    return Promise.all(langs.map((lang) => {
        return propsToTranslate.map((prop) => {
            return Ajax().post('/translate-menu-category', {
                body: JSON.stringify(convertForTranslation(lang, {type: 'category', id: cat.id, prop: prop})),
                headers: {
                    "content-type": "application/json",
                    "cache-control": "no-cache",
                    "x-access-token": StorageManagerInstance.read('token')
                }
            });
        });
    }));
}


//
// REMOVE
//
export function removeMenuCategories () {

}

export function removeMenuCategory () {

}


function convertForTranslation (lang, obj) {
    switch (obj.type) {
        case 'category':
        console.log({obj: {
                    categoryId: obj.id,
                    key: obj.prop.key,
                    title: 'Menu Category ' + obj.id + ', translation: ' + obj.prop.key,
                    sl: 'English',
                    tl: lang.title || lang.name,
                    payload: obj.prop.value
                }});
            return {
                obj: {
                    categoryId: obj.id,
                    key: obj.prop.key,
                    title: 'Menu Category ' + obj.id + ', translation: ' + obj.prop.key,
                    sl: 'English',
                    tl: lang.title || lang.name,
                    payload: obj.prop.value
                }
            };
    }
}

function convertFromDB (cat) {
    console.log(cat);
    console.log(Mapping.getTableMap('menucategory'));
    return Object.keys(cat).map((key) => {
        let obj = {};
        let newKey = Mapping.getKeyFromValue(Mapping.getTableMap('menucategory'), key);
        console.log(newKey);
        obj[newKey] = cat[key];
        return obj;
    });
}


function convertOpts (cat, isUpdate) {
    console.log(cat);

    if (!cat.id) {
        console.error('The menu category id to update is not specified!');
        return;
    }

    let id = cat.id;
    let obj = Object.keys(cat).reduce((acc, current) => {
        let matchingKeys = [];
        for (let key of Mapping.getTableMap('menucategory').keys()) {
            if (current === key) {
                matchingKeys.push(key);
            }
        }

        if (matchingKeys.length > 0) {
            acc[Mapping.getDBString('menucategory', current)] = cat[current];
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



