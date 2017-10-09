import { Ajax } from '../../shared/ajax.utils';

import { Mapping } from  '../../shared/mapping.utils';
import { StorageManagerInstance } from  '../../shared/storage.utils';

import * as ImageService from '../Image/image.service';

function hasContactImages (contacts) {
    if (!contacts || contacts.length <= 0) {
        return false;
    }

    let res = !!contacts.reduce((acc, contact) => {
        return (contact.ImagePath) ? ++acc : acc;
    }, 0);

    return res;
}

export function updateBranches (branches) {
    if (!branches || branches.length <= 0) {
        const err = 'No branches specified for branches update!';
        console.error(err);
        return Promise.reject(err);
    }

    return Promise.all(branches.map(branch => {
        return updateBranch(branch);
    })).then(res => {
        console.log('promise all');
        console.log(res);

        if (!res) {
            return Promise.reject(res);
        }

        return Promise.resolve(res);
    }).catch(err => {
        console.error(err);
        return Promise.reject(err);
    });
}

export function updateBranch (branch) {
    console.log(branch);

    return new Promise((resolve, reject) => {
        const updateOrCreateBranch = (branch) => {
            return new Promise((resolve, reject) => {
                (branch.BranchID) ? Ajax().put('/branch', {
                    body: JSON.stringify({id: branch.BranchID, updates: branch}), // data: {file: file, url: url}
                    headers: {
                        "content-type": "application/json",
                        "cache-control": "no-cache",
                        "x-access-token": StorageManagerInstance.read('token')
                    }
                }).then(res => {
                    console.log('UPDATE!!');
                    console.log(res);
                    if (!res || !res.success) {
                        reject(res);
                    }

                    resolve(res.obj);
                }) : Ajax().post('/branch', {
                    body: JSON.stringify({obj: branch}), // data: {file: file, url: url}
                    headers: {
                        "content-type": "application/json",
                        "cache-control": "no-cache",
                        "x-access-token": StorageManagerInstance.read('token')
                    }
                }).then(res => {
                    console.log('NEW!!');
                    console.log(res);
                    if (!res || !res.success) {
                        reject(res);
                    }

                    resolve(res.obj);
                });
            });
        };

        const findImage = (res, arr, isContactImage) => {
            console.log('response from update images:');
            console.log(res);
            console.log('arr:');
            console.log(arr);
            console.log('propsHaveUppercase:');
            console.log(isContactImage);
            if (!res || res.length <= 0) {
                return arr;
            }

            let tmp = arr.map(image => {
                if (!image.newlyAdded && !isContactImage) {
                    return image;
                }

                const responseMatch = res.find(imageResponse => {
                    return imageResponse.bytes === image.file.size;
                });

                if (responseMatch) {
                    let obj;
                    if (isContactImage) {
                        obj = image;
                        obj.ImagePath = responseMatch.url;
                        obj.ImageAltDesc = '';
                    } else {
                        obj = image;
                        obj.imgPath = responseMatch.url;
                        obj.altDesc = '';
                    }
                    return obj;
                }

                return image;
            });

            console.log(tmp);

            return tmp;
        };

        let newImages = (branch.images && branch.images.length > 0) ? branch.images.filter(image => {
            return image.newlyAdded;
        }) : null;

        console.log(newImages);

        if (!newImages || newImages.length <= 0) {
            Ajax().put('/branch', {
                body: JSON.stringify({id: branch.BranchID, updates: branch}), // data: {file: file, url: url}
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

            return;
        }

        ImageService.updateBranchImages(newImages.map(image => {
            return {
                file: image.file,
                url: image.imgPath
            };
        })).then(resImages => {
            let newImages = findImage(resImages, branch.images, false);
            let newBranch = branch;
            newBranch.images = newImages;

            if (!hasContactImages(branch.contacts)) {
                console.log('DOESNT HAVE CONTACT IMAGES!!');
                updateOrCreateBranch(newBranch).then(res => {
                    resolve(res);
                });
            }

            console.log('HAS CONTACT IMAGES!!');
            console.log(branch.contacts);
            ImageService.updateContactImages(branch.contacts.map(contact => {
                return {
                    file: contact.file,
                    url: contact.ImagePath
                };
            })).then(resContacts => {
                console.log('RES CONTACT');
                console.log(resContacts);
                let newContacts = findImage(resContacts, branch.contacts, true);
                newBranch.contacts = newContacts;

                updateOrCreateBranch(newBranch).then(res => {
                    console.log('result from updateorcreatebranch -> contactimages');
                    console.log(res);
                    resolve(res);
                });
            }).catch(err => {
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
}

export function deleteBranch (branch) {
    console.log('deletion!!!');
    console.log(branch);
    return new Promise((resolve, reject) => {
        Ajax().delete('/branch', {
            body: JSON.stringify({id: branch.BranchID}),
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


function convertOpts (image, isUpdate) {
    console.log(image);

    let id = image.BranchID;
    let obj = Object.keys(image).reduce((acc, current) => {
        let matchingKeys = [];
        for (let key of Mapping.getTableMap('imageupload').keys()) {
            if (current === key) {
                matchingKeys.push(key);
            }
        }

        if (matchingKeys.length > 0) {
            acc[Mapping.getDBString('imageupload', current)] = image[current];
        }
        return acc;
    }, {});

    console.log({id: id, updates: obj});

    return (isUpdate) ? {
        id: id,
        updates: obj
    } : {
        obj: obj
    };
}

