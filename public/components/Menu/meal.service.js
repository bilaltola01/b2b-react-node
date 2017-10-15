import { Ajax } from '../../shared/ajax.utils';

import { Mapping } from  '../../shared/mapping.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

const SANDBOX_TOKEN = 'ACE563CA-FF89-4C7D-8DDF-35B5F11CFA21';
const TRANSLATION_ENV = 'sandbox';
const TRANSLATION_URL = 'https://' + TRANSLATION_ENV + '.strakertranslations.com/v3/translate';

//
// POST
//
export function postMeals (meals, newCatId) {
    console.log(meals);
    if (meals.length <= 0) {
        return removeMeals();
    }
    // Compare meals in the object to the meals in the DB
    let ids = meals.map(c => c.id);
    return Promise.all(meals.map((meal) => {
        return postMeal(meal, newCatId);
    }));
}

export function postMeal (meal, newCatId) {
    console.log(meal);

    if (meal.id) {
        delete meal.id;
    }

    meal.menuCategoryId = newCatId;

    return Ajax().post('/meal', {
        body: JSON.stringify(convertOpts(meal, false)),
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
export function updateMeals (meals) {
    if (meals.length <= 0) {
        return removeMeals();
    }
    // Compare meals in the object to the meals in the DB
    let ids = meals.map(c => c.id);
    return Promise.all(meals.map((meal) => {
        return updateMeal(meal);
    }));
}

export function updateMeal (meal) {
    if (!meal.id) {
        console.error('meal id is not specified!');
        return;
    }

    return Ajax().put('/meal', {
        body: JSON.stringify(convertOpts(meal, true)),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    });
}

function getMeals (ids) {
    return Ajax().get('/meal', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((cats) => {
        if (ids.length <= 0) {
            return cats;
        }

        return cats.filter((cat, index) => {
            return cat.MenuCategoryID === ids[index];
        });
    });
}


//
// TRANSLATE
//


export function getMealTranslations (ids) {
    return Ajax().get('/translate-meal', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let mealTranslations = res.obj;

        let mealIds = res.obj.map(meal => meal.MealID);

        // Get menu categories macthing menu id
        return Ajax().get('/meal', {
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
            }
        }).then((res) => {
            if (!res || !res.success) {
                return Promise.reject(res);
            }

            let meals = ids.reduce((acc, current) => {
                return acc.concat(res.obj.filter((meal) => {
                    return meal.MenuCategoryID === current;
                }));
            }, []);

            console.log(meals);

            let meals2 = meals.reduce((acc, current) => {
                return acc.concat(mealTranslations.reduce((acc_translation, curr_translation) => {
                    let t = curr_translation;
                    t.MenuCategoryID = current.MenuCategoryID;
                    return (curr_translation.MealID === current.MealID)
                        ? acc_translation.concat(t)
                        : acc_translation;
                }, []));
            }, []);

            console.log(meals2);

            return meals2;
        });
    });
}

export function translateMeals (langs, meals) {
    return Promise.all(meals.map((meal) => {
        return translateMeal(langs, meal);
    }));
}

export function translateMeal (langs, meal) {
    return Ajax().get('/meal', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let meals = res.obj;

        return meals.find((m) => {
            return m.Description === meal.description && m.Title === meal.title && m.MenuCategoryID === meal.menuCategoryId;
        }).MealID;
    }).then((id) => {
        console.log(id);
        if (!id) {
            console.error('Meal id is not specified!');
            return;
        }

        let propsToTranslate = Object.keys(meal).filter((key) => {
            return (key === 'title' || key === 'description') && (meal[key] && meal[key].length > 0);
        }).map((key) => {
            return {
                key: key,
                value: meal[key]
            };
        });

        console.log('props to translate!!');
        console.log(propsToTranslate);

        return Promise.all(langs.map((lang) => {
            console.log(lang);
            return propsToTranslate.map((prop) => {
                return Ajax().post('/translate-meal', {
                    body: JSON.stringify(convertForTranslation(lang, {type: 'meal', id: id, prop: prop})),
                    headers: {
                        "content-type": "application/json",
                        "cache-control": "no-cache",
                        "x-access-token": StorageManagerInstance.read('token')
                    }
                });
            });
        }));
    });
}


function convertForTranslation (lang, obj) {
    switch (obj.type) {
        case 'meal':
        console.log({obj: {
                    mealId: obj.id,
                    key: obj.prop.key,
                    title: 'Meal ' + obj.id + ', translation: ' + obj.prop.key,
                    sl: 'English',
                    tl: lang.title || lang.name,
                    payload: obj.prop.value
                }});
            return {
                obj: {
                    mealId: obj.id,
                    key: obj.prop.key,
                    title: 'Meal ' + obj.id + ', translation: ' + obj.prop.key,
                    sl: 'English',
                    tl: lang.title || lang.name,
                    payload: obj.prop.value
                }
            };
    }
}


//
// REMOVE
//
export function removeMeals () {

}

export function removeMeal () {

}


function convertOpts (meal, isUpdate) {
    console.log(meal);
/*
    if (!meal.id) {
        console.error('The menu id to update is not specified!');
        return;
    }
*/
    let id = meal.id;
    let obj = Object.keys(meal).reduce((acc, current) => {
        let matchingKeys = [];
        for (let key of Mapping.getTableMap('meal').keys()) {
            if (current === key) {
                matchingKeys.push(key);
            }
        }

        console.log(Mapping.getTableMap('meal').keys());
        console.log(matchingKeys);
        console.log(current);

        if (matchingKeys.length > 0) {
            acc[Mapping.getDBString('meal', current)] = meal[current];
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


