'use strict';

var $ = require('jquery');
var d3 = require('d3');

window.PageSupport = function() {
    $(document).ready(function() {
        initMenuAnimation();

        $('.content--table').on('click', '.display-tooltip, .icon--close', function(e){
            e.preventDefault();
            $(this).closest('td').find('.display-tooltip').toggleClass('status--active');
            $('#modal--target').toggleClass('hidden');
        });

        $('.content--table').on('click', '.tooltip, .icon--close', function(e){
            e.stopPropagation();
        });

        $('#modal--target').on('click', function(e){
            e.preventDefault();

            $('#modal--target').toggleClass('hidden');
            $('.display-tooltip.status--active').toggleClass('status--active');
        });

        $('.select--styled').on('click', function(e){
            $(this).toggleClass('active');
        });

        function initMenuAnimation() {
            $('.has-subnav').on('click', function () {

                if ($(this).hasClass('subnav-opened')) {
                    $('.has-subnav').removeClass('subnav-opened');
                } else {
                    $('.has-subnav').removeClass('subnav-opened');
                    $(this).addClass('subnav-opened'); 
                }
            });
        }
    });
};

window.EditMenu = function() {
    $(document).ready(function () {
        var addTitlePrice = $('#btn-add-title-price');
        var addLanguage = $('#btn-add-language');
        var addEntree = $('#btn-add-entree');
        var addMain = $('#btn-add-main');
        var addDessert = $('#btn-add-dessert');
        var finishStep1Edit = $('#step-1-finish-edit');

        var menuData, menus, storedMenus, currentMenu;
        var params = parseHash();
        var menu;

        if (params && params.menu && params.menu.length > 0) {
            storedMenus = localStorage.getItem("menus");
            console.log(storedMenus);
            if (storedMenus && storedMenus.length > 0) {
                menuData = JSON.parse(localStorage.getItem("menus"));

                // check if a menu with the hash as id exists

                currentMenu = menuData.find(function (menu) {
                    return menu.id === params.menu;
                });

                console.log(currentMenu);
                menu = currentMenu;

                if (currentMenu.price && currentMenu.title) {
                    // fill the forms with the menus from persistence layer
                    fillElements(currentMenu);
                }
            } else {
                $('#no-menus').removeClass('hidden');
            }
        }


        $('.select--styled').on('click', function (e) {
            $(this).toggleClass('active');
        });
        $('.select--options li').on('click', function (e) {
            $(this).parent().prev().text($(this).text()).attr('data-rel', $(this).attr('rel')).toggleClass('active');
        });

        function bindRemove ($el) {
            $($el).off('click');
            $($el).on('click', function () {
                if ($(this).parent().hasClass('language')) {
                    $(this).parent().remove();
                    removeLanguage($(this).parent().attr('id'));
                }

                if ($(this).parent().is('td')) {
                    $(this).parent().parent().remove();
                    removeMeal($(this).parent().parent().attr('id'));
                    removePreview($(this).parent().prev().prev().text());
                }
            });
        }

        function fillElements (data) {
            var arr = data;
            arr.parts = arr.parts.sort(function (a, b) {
                return a.order - b.order;
            });
            console.log(arr);
            fillForm(arr);
            fillPreview(arr);
        }

        function fillForm (data) {

            // Title
            $('#menu-title').val(data.title);

            // Price
            $('#menu-price').val(data.price);

            // All languages
            data.languages.forEach(function (lang) {
                $('#languages')
                    .append('<div id="' + lang.id + '" class="language content--label">\
                        <h3 class="label--key">' + lang.title + ':</h3><span class="label--value">' + lang.value + '</span>\
                        <span class="status status--issue remove display-tooltip">Issue</span>\
                        </div>');
            });

            // All parts (entree, main, dessert)
            $('.content--table tbody').each(function (i) {
                var $el = $(this);
                if (data.parts[i].meals.length > 0) {
                    data.parts[i].meals.forEach(function (meal) {
                        $el.prepend('<tr><td>' + meal.title + '</td><td></td><td><span class="status status--issue remove display-tooltip">Issue</span></td></tr>');
                    });
                }
            });
        }

        function fillPreview (data) {

            // Title
            addToPreview($('#menu-preview-title'), data.title);

            // Price
            addToPreview($('#menu-preview-price'), data.price);

            // All parts
            $('.flood-menu--meal').each(function (i) {
                var $el = $(this);
                console.log($el);
                console.log(data.parts);
                if (data.parts[i].meals.length > 0) {
                    data.parts[i].meals.forEach(function (meal) {
                        appendToPreview($el, '<p class="food-menu--text">' + meal.title + '</p>');
                    });
                }
            });
        }

        function parseHash () {
            var hashParams = {};
            var e,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^&;=]+)=?([^&;]*)/g,
                d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
                q = window.location.hash.substring(1);

            while (e = r.exec(q))
               hashParams[d(e[1])] = d(e[2]);

            return hashParams;
        }

        function generateId (title) {
            var str = title;
            return str.replace(/\W+/g, '-').toLowerCase();
        }

        function editMenuToStorage (menu) {
            var menus, storedMenus, arr;
            storedMenus = localStorage.getItem("menus");

            if (storedMenus && storedMenus.length > 0) {
                console.log(menu);
                arr = JSON.parse(storedMenus);
                console.log(arr);
                arr = arr.map(function (m) {
                    return m.id === params.menu ? menu : m;
                });
                menus = JSON.stringify(arr);
            } else {
                menus = JSON.stringify([menu]);
            }
            localStorage.setItem("menus", menus);
        }

        function addToPreview ($target, el) {
            $target.html(el);
        }

        function appendToPreview ($target, el) {
            $target.append(el);
        }

        function prependToPreview ($target, el) {
            $target.prepend(el);
        }

        function isLanguageAlreadyAdded (title) {
            var $languages = $('.language .label--value');

            if ($languages.length == 0) {
                return false;
            }

            return $languages.filter(function () {
                return $(this).text() === title;
            }).length > 0;
        }

        function addMeal (meal) {
            var part = menu.parts.find(function (part) {
                return part.title === meal.partTitle;
            });

            if (!part || part.length === 0) {
                menu.parts.push({
                    id: meal.id,
                    order: meal.order,
                    title: meal.partTitle,
                    meals: []
                });
            }

            menu.parts.find(function (part) {
                return part.title === meal.partTitle;
            }).meals.push(meal);
        }

        $('#menu-price, #menu-title').on('click', function () {
            if ($(this).hasClass('editable')) {
                $(this).css({
                    'border': '1px solid #DCE4EB',
                    'padding': '10px 15px'
                });
            }
        });


        finishStep1Edit.on('click', function () {
            // Add to localstorage 
            // TODO: use db instead
            if (menu.price && menu.title && menu.parts.length > 0) {
                menu.id = generateId(menu.title);
                console.log('abot to edit menu!!!');
                console.log(menu);
                editMenuToStorage(menu);
            }

            // go to step 2 (show popup asking for more info, etc... + confirmation menu has been added + redirect to list of menus if no extra info chosen)
        });

        addTitlePrice.on('click', function () {
            var title = $('#menu-title').val().trim();
            var price = $('#menu-price').val().trim();

            if (title.length > 0) {
                console.log('valid title');
                menu.title = title;
                $('#menu-title').css({
                    'margin': '0 0 10px 0;',
                    'padding': '0',
                    'border': '0 none',
                    'cursor': 'pointer'
                }).addClass('editable').val(menu.title);
                addToPreview($('#menu-preview-title'), menu.title);
            }

            if (price.length > 0) {
                console.log('valid price');
                menu.price = price;
                $('#menu-price').css({
                    'margin': '0 0 10px 0;',
                    'padding': '0',
                    'border': '0 none',
                    'cursor': 'pointer'
                }).addClass('editable').val(menu.price);
                addToPreview($('#menu-preview-price'), menu.price);
            }

        });

        addLanguage.on('click', function () {
            var $selected = $('#pick--language').next();
            var lang = $selected.text();
            var key, value, id;

            if (lang !== '' && lang !== 'Select a language to Add') {
                var isAdded = isLanguageAlreadyAdded(lang);
                console.log(isAdded);

                if (!isAdded) {
                    console.log('valid language');
                    key = $selected.attr('data-rel').split('-')[0].toUpperCase();
                    value = lang;
                    id = $selected.attr('data-rel');

                    menu.languages.push({
                        id: id,
                        title: key,
                        value: value
                    });
                    $('#languages').append('<div id="' + id + '" class="language content--label">\
                    <h3 class="label--key">' + key + ':</h3><span class="label--value">' + value + '</span>\
                    <span class="status remove status--issue display-tooltip">Issue</span>\
                    </div>');
                    bindRemove($('#' + id).find('.status--issue.remove'));
                }
            }
        });

        function removeLanguage (id) {
            menu.languages = menu.languages.reduce(function (acc, lang) {
                return lang.id !== id ? acc.concat(lang) : acc;
            }, []);
        }

        function removeMeal (id) {
            console.log(id);
            menu.parts = menu.parts.reduce(function (acc, part) {
                var res = part.meals.filter(function (meal) {
                    return meal.id !== id;
                });
                return acc.concat({
                    id: part.id,
                    order: part.order,
                    title: part.title,
                    meals: res,
                });
            }, []);
            console.log(menu.parts);
        }

        function removePreview (id) {
            $('.food-menu').find('.food-menu--text').each(function () {
                if ($(this).text() === id) {
                    $(this).remove();
                    break;
                }
            });
        }

        addEntree.on('click', function (e) {
            e.preventDefault();
            var entree = $('#input-add-entree').val();
            var id = generateId(entree);
            if (entree !== '' && entree !== 'Enter your entrée') {
                console.log(entree);

                addMeal({
                    order: 0,
                    id: id,
                    partTitle: 'Entrée',
                    title: entree,
                    hasTooltip: false,
                    tags: []
                });

                console.log($('#table-entrees tbody'));
                $('#table-entrees tbody').prepend('<tr id="' + id + '"><td>' + entree + '</td><td></td><td><span class="status status--issue remove display-tooltip">Issue</span></td></tr>');
                console.log($('#table-entrees tbody'));
                appendToPreview($('#menu-preview-entrees'), '<p class="food-menu--text">' + entree + '</p>');
                bindRemove($('#' + id).find('.status--issue.remove'));
            }
        });

        addMain.on('click', function (e) {
            e.preventDefault();
            var main = $('#input-add-main').val();
            var id = generateId(main);
            if (main !== '' && main !== 'Enter your main') {
                addMeal({
                    order: 1,
                    id: id,
                    partTitle: 'Main',
                    title: main,
                    hasTooltip: false,
                    tags: []
                });
                $('#table-mains tbody').prepend('<tr id="' + id + '"><td>' + main + '</td><td></td><td><span class="status status--issue remove display-tooltip">Issue</span></td></tr>');
                appendToPreview($('#menu-preview-mains'), '<p class="food-menu--text">' + main + '</p>');
                bindRemove($('#' + id).find('.status--issue.remove'));
            }
        });

        addDessert.on('click', function (e) {
            e.preventDefault();
            var dessert = $('#input-add-dessert').val();
            var id = generateId(dessert);
            if (dessert !== '' && dessert !== 'Enter your dessert') {
                addMeal({
                    order: 2,
                    id: id,
                    partTitle: 'Dessert',
                    title: dessert,
                    hasTooltip: false,
                    tags: []
                });
                $('#table-desserts tbody').prepend('<tr id="' + id + '"><td>' + dessert + '</td><td></td><td><span class="status status--issue remove display-tooltip">Issue</span></td></tr>');
                appendToPreview($('#menu-preview-desserts'), '<p class="food-menu--text">' + dessert + '</p>');
                bindRemove($('#' + id).find('.status--issue.remove'));
            }
        });
    });
};

window.GetMenus = function() {
    $(document).ready(function () {
        var menuData, menus, storedMenus;
        storedMenus = localStorage.getItem("menus");

        if (storedMenus && storedMenus.length > 0) {
            menuData = JSON.parse(localStorage.getItem("menus"));
            menus = constructMenus(menuData);

            $('#all-menus').html(menus);
        } else {
            $('#no-menus').removeClass('hidden');
        }

        function constructMenus (data) {
            return data.reduce(function (str, menu) {
                str += '<div class="content--module no-spacing clearfix grid--menu">';
                str += '<article class="content--container module--asset-tracking">';
                str += '<a href="edit-menu.html#menu=' + menu.id + '" class="menu--link">'
                str += '<h2 class="content--subtitle global-padding-wrapper">';
                str += menu.title;
                str += '</h2>';
                str += '<div class="food-menu"><h3 class="food-menu--title">' + menu.title + '</h3>';
                str += '<p class="food-menu--price">' + menu.price + '</p>';
                str += menu.parts.reduce(function (strParts, part) {
                    strParts += '<h4 class="food-menu--subtitle">' + part.title + '</h4>';
                    strParts += '<div class="food-menu--separator"></div>';
                    strParts += '<div class="flood-menu--meal">';
                    strParts += part.meals.reduce(function (strMeals, meal) {
                        strMeals += '<p class="food-menu--text">';
                        strMeals += meal.title;
                        strMeals += '</p>';
                        return strMeals;
                    }, '');
                    strParts += '</div>';
                    return strParts;
                }, '');
                str += '</div></a>';
                str += '</article>';
                str += '</div>';
                return str;
            }, '');
        }
    });
};

window.AddMenu = function() {
    $(document).ready(function () {
        var addTitlePrice = $('#btn-add-title-price');
        var addLanguage = $('#btn-add-language');
        var addEntree = $('#btn-add-entree');
        var addMain = $('#btn-add-main');
        var addDessert = $('#btn-add-dessert');
        var finishStep1 = $('#step-1-finish');

        //
        // Object containing the menu to be added
        //
        /*
            menu = {
                title: string,
                price: numnber,
                languages: [
                    {
                        isDefinedInGlobalSettings: bool,
                    },
                ],
                parts:  [
                    {
                        title: string,
                        meals: [
                            {
                                title: string,
                                hasTooltip: bool,
                                tags: ['gluten', 'vegan'],
                                extraInfo: {
                                    ...
                                }
                            }
                        ]
                    }
                ]
            }
        */
        var menu = {};
        menu.languages = [];
        menu.parts = [];

        $('.select--styled').on('click', function (e) {
            $(this).toggleClass('active');
        });
        $('.select--options li').on('click', function (e) {
            $(this).parent().prev().text($(this).text()).attr('data-rel', $(this).attr('rel')).toggleClass('active');
        });

        function bindRemove ($el) {
            $($el).on('click', function () {
                if ($(this).parent().hasClass('language')) {
                    $(this).parent().remove();
                    removeLanguage($(this).parent().attr('id'));
                }

                if ($(this).parent().is('td')) {
                    $(this).parent().parent().remove();
                    removeMeal($(this).parent().parent().attr('id'));
                    removePreview($(this).parent().prev().prev().text());
                }
            });
        }

        function generateId (title) {
            var str = title;
            return str.replace(/\W+/g, '-').toLowerCase();
        }

        function addMenuToStorage (menu) {
            var menus, storedMenus, arr;
            storedMenus = localStorage.getItem("menus");

            if (storedMenus && storedMenus.length > 0) {
                console.log(menu);
                arr = JSON.parse(storedMenus);
                console.log(arr);
                arr.push(menu);
                menus = JSON.stringify(arr);
            } else {
                menus = JSON.stringify([menu]);
            }
            localStorage.setItem("menus", menus);
        }

        function addToPreview ($target, el) {
            $target.html(el);
        }

        function appendToPreview ($target, el) {
            $target.append(el);
        }

        function prependToPreview ($target, el) {
            $target.prepend(el);
        }

        function isLanguageAlreadyAdded (title) {
            var $languages = $('.language .label--value');

            if ($languages.length == 0) {
                return false;
            }

            return $languages.filter(function () {
                return $(this).text() === title;
            }).length > 0;
        }

        function addMeal (meal) {
            var part = menu.parts.find(function (part) {
                return part.title === meal.partTitle;
            });

            if (!part || part.length === 0) {
                menu.parts.push({
                    id: meal.id,
                    order: meal.order,
                    title: meal.partTitle,
                    meals: []
                });
            }

            menu.parts.find(function (part) {
                return part.title === meal.partTitle;
            }).meals.push(meal);
        }

        $('#menu-price, #menu-title').on('click', function () {
            if ($(this).hasClass('editable')) {
                $(this).css({
                    'border': '1px solid #DCE4EB',
                    'padding': '10px 15px'
                });
            }
        });


        finishStep1.on('click', function () {
            // Add to localstorage 
            // TODO: use db instead
            if (menu.price && menu.title && menu.parts.length > 0) {
                menu.id = generateId(menu.title);
                console.log(menu);
                addMenuToStorage(menu);
            }

            // go to step 2 (show popup asking for more info, etc... + confirmation menu has been added + redirect to list of menus if no extra info chosen)
        });

        addTitlePrice.on('click', function () {
            var title = $('#menu-title').val().trim();
            var price = $('#menu-price').val().trim();

            if (title.length > 0) {
                console.log('valid title');
                menu.title = title;
                $('#menu-title').css({
                    'margin': '0 0 10px 0;',
                    'padding': '0',
                    'border': '0 none',
                    'cursor': 'pointer'
                }).addClass('editable').val(menu.title);
                addToPreview($('#menu-preview-title'), menu.title);
            }

            if (price.length > 0) {
                console.log('valid price');
                menu.price = price;
                $('#menu-price').css({
                    'margin': '0 0 10px 0;',
                    'padding': '0',
                    'border': '0 none',
                    'cursor': 'pointer'
                }).addClass('editable').val(menu.price);
                addToPreview($('#menu-preview-price'), menu.price);
            }

        });

        addLanguage.on('click', function () {
            var $selected = $('#pick--language').next();
            var lang = $selected.text();
            var key, value, id;

            if (lang !== '' && lang !== 'Select a language to Add') {
                var isAdded = isLanguageAlreadyAdded(lang);
                console.log(isAdded);

                if (!isAdded) {
                    console.log('valid language');
                    key = $selected.attr('data-rel').split('-')[0].toUpperCase();
                    value = lang;
                    id = $selected.attr('data-rel');

                    menu.languages.push({
                        id: id,
                        title: key,
                        value: value
                    });
                    $('#languages').append('<div id="' + id + '" class="language content--label">\
                    <h3 class="label--key">' + key + ':</h3><span class="label--value">' + value + '</span>\
                    <span class="status remove status--issue display-tooltip">Issue</span>\
                    </div>');
                    bindRemove($('#' + id).find('.status--issue.remove'));
                }
            }
        });

        function removeLanguage (id) {
            console.log('called once remove lang');
            console.log(menu);
            menu.languages = menu.languages.reduce(function (acc, lang) {
                return lang.id !== id ? acc.concat(lang) : acc;
            }, []);
        }

        function removeMeal (id) {
            console.log(id);
            menu.parts = menu.parts.reduce(function (acc, part) {
                var res = part.meals.filter(function (meal) {
                    return meal.id !== id;
                });
                return acc.concat({
                    id: part.id,
                    order: part.order,
                    title: part.title,
                    meals: res,
                });
            }, []);
            console.log(menu.parts);
        }

        function removePreview (id) {
            $('.food-menu').find('.food-menu--text').each(function () {
                if ($(this).text() === id) {
                    $(this).remove();
                }
            });
        }

        addEntree.on('click', function (e) {
            e.preventDefault();
            var entree = $('#input-add-entree').val();
            var id = generateId(entree);
            if (entree !== '' && entree !== 'Enter your entrée') {
                console.log(entree);

                addMeal({
                    order: 0,
                    id: id,
                    partTitle: 'Entrée',
                    title: entree,
                    hasTooltip: false,
                    tags: []
                });

                console.log($('#table-entrees tbody'));
                $('#table-entrees tbody').prepend('<tr id="' + id + '"><td>' + entree + '</td><td></td><td><span class="status status--issue remove display-tooltip">Issue</span></td></tr>');
                console.log($('#table-entrees tbody'));
                appendToPreview($('#menu-preview-entrees'), '<p class="food-menu--text">' + entree + '</p>');
                bindRemove($('#' + id).find('.status--issue.remove'));
            }
        });

        addMain.on('click', function (e) {
            e.preventDefault();
            var main = $('#input-add-main').val();
            var id = generateId(main);
            if (main !== '' && main !== 'Enter your main') {
                addMeal({
                    order: 1,
                    id: id,
                    partTitle: 'Main',
                    title: main,
                    hasTooltip: false,
                    tags: []
                });
                $('#table-mains tbody').prepend('<tr id="' + id + '"><td>' + main + '</td><td></td><td><span class="status status--issue remove display-tooltip">Issue</span></td></tr>');
                appendToPreview($('#menu-preview-mains'), '<p class="food-menu--text">' + main + '</p>');
                bindRemove($('#' + id).find('.status--issue.remove'));
            }
        });

        addDessert.on('click', function (e) {
            e.preventDefault();
            var dessert = $('#input-add-dessert').val();
            var id = generateId(dessert);
            if (dessert !== '' && dessert !== 'Enter your dessert') {
                addMeal({
                    order: 2,
                    id: id,
                    partTitle: 'Dessert',
                    title: dessert,
                    hasTooltip: false,
                    tags: []
                });
                $('#table-desserts tbody').prepend('<tr id="' + id + '"><td>' + dessert + '</td><td></td><td><span class="status status--issue remove display-tooltip">Issue</span></td></tr>');
                appendToPreview($('#menu-preview-desserts'), '<p class="food-menu--text">' + dessert + '</p>');
                bindRemove($('#' + id).find('.status--issue.remove'));
            }
        });
    });
};

window.PageReports = function() {
    $(document).ready(function() {
        initMenuAnimation();

        $('.content--table').on('click', '.display-tooltip, .icon--close', function(e){
            e.preventDefault();
            $(this).closest('td').find('.display-tooltip').toggleClass('status--active');
            $('#modal--target').toggleClass('hidden');
        });

        $('.content--table').on('click', '.tooltip, .icon--close', function(e){
            e.stopPropagation();
        });

        $('#modal--target').on('click', function(e){
            e.preventDefault();

            $('#modal--target').toggleClass('hidden');
            $('.display-tooltip.status--active').toggleClass('status--active');
        });

        $('.select--styled').on('click', function(e){
            $(this).toggleClass('active');
        });

        function initMenuAnimation() {
            $('.has-subnav').on('click', function () {

                if ($(this).hasClass('subnav-opened')) {
                    $('.has-subnav').removeClass('subnav-opened');
                } else {
                    $('.has-subnav').removeClass('subnav-opened');
                    $(this).addClass('subnav-opened'); 
                }
            });
        }
    });
};

window.PageFAQ = function(){
    $(document).ready(function() {
        initMenuAnimation();

        $('.content--table').on('click', '.display-tooltip, .icon--close', function(e){
            e.preventDefault();
            $(this).closest('td').find('.display-tooltip').toggleClass('status--active');
            $('#modal--target').toggleClass('hidden');
        });

        $('.content--table').on('click', '.tooltip, .icon--close', function(e){
            e.stopPropagation();
        });

        $('#modal--target').on('click', function(e){
            e.preventDefault();

            $('#modal--target').toggleClass('hidden');
            $('.display-tooltip.status--active').toggleClass('status--active');
        });

        $('.select--styled').on('click', function(e){
            $(this).toggleClass('active');
        });

        function initMenuAnimation() {
            $('.has-subnav').on('click', function () {

                if ($(this).hasClass('subnav-opened')) {
                    $('.has-subnav').removeClass('subnav-opened');
                } else {
                    $('.has-subnav').removeClass('subnav-opened');
                    $(this).addClass('subnav-opened'); 
                }
            });
        }
    });
};

window.PageAssetTracking = function(){
    $(document).ready(function() {
        var dataGraphs;

        dataGraphs = [
            {
                type: 'donut',
                data: [
                    {
                        label: 'Received',
                        colorClass: 'donut--dark-blue',
                        value: 750
                    },
                    {
                        label: 'Processing',
                        colorClass: 'donut--medium-blue',
                        value: 358
                    },
                    {
                        label: 'Missing',
                        colorClass: 'donut--red',
                        value: 15
                    },
                    {
                        label: 'Rejected',
                        colorClass: 'donut--red',
                        value: 2
                    },
                    {
                        label: 'Processed',
                        colorClass: 'donut--light-blue',
                        value: 275
                    }

                ]
            }
        ];



        initMenuAnimation();
        initAsideComments();
        initDonutCharts(dataGraphs);
        initClickableRows();

        $('.content--table').on('click', '.display-tooltip, .icon--close', function(e){
            e.preventDefault();


            if($('#modal--target').hasClass('hidden')){
                // If the modal is hidden
                console.log(e);

                // Tooltip Width and height
                var tooltipWidth = 600;
                var tooltipHeight = $('.tooltip').outerHeight();

                console.log(e.target.getBoundingClientRect().left);

                // Smart tooltip: calculate positition of click
                var clickBoundingBox = {
                    left: e.target.getBoundingClientRect().left,
                    top: e.target.getBoundingClientRect().top,
                    right: e.target.getBoundingClientRect().right,
                    bottom: e.target.getBoundingClientRect().bottom,
                    width: tooltipWidth,
                    height: tooltipHeight,
                    clickedElementWidth: e.target.getBoundingClientRect().width,
                    clickedElementHeight: e.target.getBoundingClientRect().height
                };
                var tableBoundingBox = e.delegateTarget.getBoundingClientRect();

                var padding = 20;
                var paddingArrow = {
                    left: 41,
                    right: 41,
                    top: 15,
                    bottom: 15
                };

                console.log(clickBoundingBox);
                console.log(tableBoundingBox);

                // If the tooltip overflows the table
                var overflowObj = checkBoundingBoxesOverflow(clickBoundingBox, tableBoundingBox, padding);
                console.log(overflowObj);
                if(overflowObj.isOverflowing){
                    if(overflowObj.overflow.bottom){
                        $('.tooltip').css({
                           marginTop: (-tooltipHeight - clickBoundingBox.clickedElementHeight - paddingArrow.bottom * 2) + 'px' 
                        });

                    }

                    if(overflowObj.overflow.left){
                        $('.tooltip').css({
                           marginLeft: -paddingArrow.left + 'px' 
                        });
                    }

                    if(overflowObj.overflow.right){
                        $('.tooltip').css({
                           //marginLeft: overflowObj.overflow.right + paddingArrow.left - paddingArrow.left + (clickBoundingBox.clickedElementWidth / 2) + 'px' 
                            marginLeft: (-tooltipWidth + paddingArrow.right) + (padding) + (24) + 'px'
                        });
                    }


                    if(overflowObj.overflow.right && overflowObj.overflow.bottom){
                        $('.tooltip').addClass('tooltip--bottom-right'); 
                    }

                }
                else{
                    $('.tooltip').addClass('tooltip--top-left'); 
                    $('.tooltip').css({
                        marginTop: '15px',
                        marginLeft: '-41px'
                    }); 
                }
            }

            $(this).closest('td').find('.display-tooltip').toggleClass('status--active');
            $('#modal--target').toggleClass('hidden');
        });

        $('.content--table').on('click', '.tooltip, .icon--close', function(e){
            e.stopPropagation();
        });

        $('#modal--target').on('click', function(e){
            e.preventDefault();

            $('#modal--target').toggleClass('hidden');
            $('.display-tooltip.status--active').toggleClass('status--active');
        });

        $('.select--styled').on('click', function(e){
            $(this).toggleClass('active');
        });

        function checkBoundingBoxesOverflow(targetBbox, containerBbox, padding){
            var obj = {
                isOverflowing: false,
                overflow: {
                    top: null,
                    right: null,
                    bottom: null,
                    left: null
                }
            };

            if(targetBbox.left - padding < containerBbox.left){
                obj.isOverflowing = true;
                obj.overflow.left = containerBbox.left - (targetBbox.left);
            }

            if(containerBbox.top > targetBbox.top + padding ){
                obj.isOverflowing = true;
                obj.overflow.top = (targetBbox.top) - containerBbox.top;
            }

            if(containerBbox.right < targetBbox.left + targetBbox.width - padding){
                obj.isOverflowing = true;
                obj.overflow.right = containerBbox.right - (targetBbox.left);
            }

            if(containerBbox.bottom < targetBbox.top + targetBbox.height - padding){
                obj.isOverflowing = true;
                obj.overflow.bottom = containerBbox.bottom - (targetBbox.top + targetBbox.height);
            }

            return obj;
        }

        function initMenuAnimation() {
            $('.has-subnav').on('click', function () {

                if ($(this).hasClass('subnav-opened')) {
                    $('.has-subnav').removeClass('subnav-opened');
                } else {
                    $('.has-subnav').removeClass('subnav-opened');
                    $(this).addClass('subnav-opened'); 
                }
            });
        }

        function initAsideComments() {
            $('.has-comments').on('click', function () {

                if ($(this).hasClass('comments-opened')) {
                    $('.has-comments').removeClass('comments-opened');
                } else {
                    $('.has-comments').removeClass('comments-opened');
                    $(this).addClass('comments-opened'); 
                }
            });
        }

        function initClickableRows(){
            var clickableRows = document.getElementsByClassName("clickable-row");
            var parents = document.getElementsByClassName("has-hover");

            if (!parents) {
                return;
            }

            for(var i = 0, len = parents.length; i < len; i++){
                var parent = parents[i];
                document.addEventListener('click', function(e) {
                    if (e.target && e.target.nodeName === 'TR') {
                        window.document.location = e.target.getAttribute("data-href");
                    }
                    else if (e.target && e.target.nodeName === 'TD') {
                        window.document.location = e.target.parentElement.getAttribute("data-href");
                    }
                }, true);
            }
        }

        function initDonutCharts(dataset){
            var i, len, chartData, chart, charts, target;

            charts = [];
            if(dataset){
                for(i = 0, len = dataset.length; i < len; i += 1){
                    chartData = dataset[i];
                    if(!!chartData){
                        target = '#chart-' + chartData.type + '-' + (i + 1);
                        console.log(target);
                        if(chartData.type === 'donut'){
                            chart = new ChartDonut(target, chartData.label, chartData.data, 174, 174, 40);

                        }
                        /*
                        else if(chartData.type === 'arc'){
                            chart = new ChartDonut('chart-' + chartData.type + '-' + (i + 1), chartData.data, 90, 90, 275, 0, 20);
                        }*/
                        charts.push(chart);
                    }  
                }
            }
        }
    });
};

window.PageDashboard = function(){
    $(document).ready(function() {
        var startIndex, startNbDays, months, currentIndex, xOffset, chartSliderOffset, dataGraphs, jsonFiles;

        chartSliderOffset = 0;
        xOffset = 0;
        startNbDays = 31;
        startIndex = 5;
        jsonFiles = [
            '20160817115924_SFPL_08-18-16_V1',
            '20160817103117_DVRO_08-18-16_V1',
            '20160817163943_UNIR_08-18-16_v1',
            '20160816143539_UNPL_08-18-16_v1',
            '20160817163047_UNUK_08-18-16_v1',
            '20160816155158_UNHU_08-18-16_1',
            '20160817164454_SFUK_08-18-16_FINAL1',
            '20160817165608_MOUK_08-18-16_V1',
            '20160817165215_MPUK_08-18-16_V1',
            '20160815170714_TMAF_08-18-16_V1',
            '20160817164558_UNSA_08-18-16_1',
            '20160816141420_SFME_08-18-16_1',
            '20160812110155_13FR_08-18-16_1',
            '20160817152940_SUSA_08-18-16_1'
        ];

        months = [
            {
                month: 'January',
                days: 31
            },
            {
                month: 'February',
                days: 29
            },
            {
                month: 'March',
                days: 31
            },
            {
                month: 'April',
                days: 30
            },
            {
                month: 'May',
                days: 31
            },
            {
                month: 'June',
                days: 30
            },
            {
                month: 'July',
                days: 31
            },
            {
                month: 'August',
                days: 31
            },
            {
                month: 'September',
                days: 30
            },
            {
                month: 'October',
                days: 31
            },
            {
                month: 'November',
                days: 30
            },
            {
                month: 'December',
                days: 31
            }
        ];

        dataGraphs = [
            {
                type: 'donut',
                data: [
                    {
                        label: 'Processed',
                        colorClass: 'donut--purple',
                        value: 1850
                    },
                    {
                        label: 'Failed',
                        colorClass: 'donut--red',
                        value: 1150
                    }
                ]
            },
            {
                type: 'graph',
                label: 'MONTHLY MENU VISITS',
                cols: [
                    "Date",
                    "VISITS"
                ],
                data: [
                    {
                        date: "2015-12-27T14:15:38-08:00",
                        value: 947
                    },
                    {
                        date: "2015-10-29T15:08:45-07:00",
                        value: 921
                    },
                    {
                        date: "2015-10-20T15:39:52-07:00",
                        value: 974
                    },
                    {
                        date: "2015-11-04T15:10:00-08:00",
                        value: 899
                    },
                    {
                        date: "2016-01-20T02:51:13-08:00",
                        value: 945
                    },
                    {
                        date: "2015-09-17T18:38:56-07:00",
                        value: 906
                    },
                    {
                        date: "2015-10-18T03:36:49-07:00",
                        value: 934
                    },
                    {
                        date: "2015-11-06T14:51:59-08:00",
                        value: 924
                    },
                    {
                        date: "2015-12-31T23:40:22-08:00",
                        value: 887
                    },
                    {
                        date: "2015-09-09T22:07:51-07:00",
                        value: 901
                    },
                    {
                        date: "2015-11-28T15:44:09-08:00",
                        value: 924
                    },
                    {
                        date: "2015-09-15T08:14:47-07:00",
                        value: 894
                    },
                    {
                        date: "2015-10-28T02:16:56-07:00",
                        value: 966
                    },
                    {
                        date: "2015-09-13T03:16:19-07:00",
                        value: 926
                    },
                    {
                        date: "2015-09-07T16:21:58-07:00",
                        value: 965
                    },
                    {
                        date: "2016-01-14T15:19:02-08:00",
                        value: 954
                    },
                    {
                        date: "2015-10-17T06:38:23-07:00",
                        value: 939
                    },
                    {
                        date: "2016-01-18T01:45:09-08:00",
                        value: 876
                    },
                    {
                        date: "2015-09-03T21:49:18-07:00",
                        value: 954
                    },
                    {
                        date: "2015-12-09T05:30:51-08:00",
                        value: 917
                    },
                    {
                        date: "2015-09-17T21:32:37-07:00",
                        value: 936
                    },
                    {
                        date: "2016-01-10T01:26:30-08:00",
                        value: 975
                    },
                    {
                        date: "2016-01-19T13:19:41-08:00",
                        value: 941
                    },
                    {
                        date: "2015-08-18T13:18:59-07:00",
                        value: 899
                    },
                    {
                        date: "2015-09-05T01:57:19-07:00",
                        value: 970
                    },
                    {
                        date: "2015-10-25T12:40:26-07:00",
                        value: 940
                    },
                    {
                        date: "2015-10-19T21:07:51-07:00",
                        value: 930
                    },
                    {
                        date: "2015-09-18T16:25:40-07:00",
                        value: 934
                    },
                    {
                        date: "2015-11-02T14:27:22-08:00",
                        value: 939
                    },
                    {
                        date: "2016-01-25T15:27:19-08:00",
                        value: 966
                    },
                    {
                        date: "2015-11-10T18:51:27-08:00",
                        value: 959
                    },
                    {
                        date: "2015-10-05T15:54:11-07:00",
                        value: 958
                    },
                    {
                        date: "2015-09-03T13:30:52-07:00",
                        value: 915
                    },
                    {
                        date: "2015-11-04T12:41:09-08:00",
                        value: 931
                    },
                    {
                        date: "2015-11-22T18:21:07-08:00",
                        value: 893
                    },
                    {
                        date: "2015-10-29T21:03:31-07:00",
                        value: 965
                    },
                    {
                        date: "2015-10-12T03:03:39-07:00",
                        value: 911
                    },
                    {
                        date: "2015-10-03T04:54:02-07:00",
                        value: 939
                    },
                    {
                        date: "2015-09-13T13:04:33-07:00",
                        value: 899
                    },
                    {
                        date: "2015-12-17T11:55:22-08:00",
                        value: 953
                    },
                    {
                        date: "2015-10-12T01:02:22-07:00",
                        value: 971
                    },
                    {
                        date: "2015-08-24T08:41:47-07:00",
                        value: 969
                    },
                    {
                        date: "2015-08-18T08:41:51-07:00",
                        value: 889
                    },
                    {
                        date: "2015-11-29T11:29:20-08:00",
                        value: 894
                    },
                    {
                        date: "2015-09-07T04:24:53-07:00",
                        value: 891
                    },
                    {
                        date: "2015-09-08T23:51:21-07:00",
                        value: 881
                    },
                    {
                        date: "2016-01-17T15:11:15-08:00",
                        value: 934
                    },
                    {
                        date: "2016-01-18T08:22:15-08:00",
                        value: 895
                    },
                    {
                        date: "2015-08-21T00:25:30-07:00",
                        value: 940
                    },
                    {
                        date: "2015-08-25T19:18:16-07:00",
                        value: 927
                    },
                    {
                        date: "2016-01-06T04:31:17-08:00",
                        value: 879
                    },
                    {
                        date: "2015-09-30T10:29:10-07:00",
                        value: 883
                    },
                    {
                        date: "2015-11-07T02:52:56-08:00",
                        value: 922
                    },
                    {
                        date: "2015-10-18T06:18:46-07:00",
                        value: 955
                    },
                    {
                        date: "2015-09-02T15:32:28-07:00",
                        value: 906
                    },
                    {
                        date: "2015-08-31T04:57:02-07:00",
                        value: 923
                    },
                    {
                        date: "2016-01-13T20:58:01-08:00",
                        value: 899
                    },
                    {
                        date: "2015-09-15T06:04:20-07:00",
                        value: 878
                    },
                    {
                        date: "2015-11-20T04:04:00-08:00",
                        value: 915
                    },
                    {
                        date: "2015-09-13T19:42:00-07:00",
                        value: 884
                    },
                    {
                        date: "2015-12-24T13:33:10-08:00",
                        value: 941
                    },
                    {
                        date: "2016-01-18T14:03:14-08:00",
                        value: 945
                    },
                    {
                        date: "2015-11-07T15:26:28-08:00",
                        value: 915
                    },
                    {
                        date: "2015-09-01T10:04:27-07:00",
                        value: 878
                    },
                    {
                        date: "2015-12-06T12:48:00-08:00",
                        value: 909
                    },
                    {
                        date: "2015-09-18T21:11:33-07:00",
                        value: 881
                    },
                    {
                        date: "2016-01-01T13:22:01-08:00",
                        value: 876
                    },
                    {
                        date: "2015-08-23T10:14:39-07:00",
                        value: 968
                    },
                    {
                        date: "2015-12-22T16:06:35-08:00",
                        value: 884
                    },
                    {
                        date: "2016-01-05T10:25:16-08:00",
                        value: 969
                    },
                    {
                        date: "2015-12-27T21:50:04-08:00",
                        value: 930
                    },
                    {
                        date: "2015-12-07T03:26:00-08:00",
                        value: 933
                    },
                    {
                        date: "2015-08-19T12:57:13-07:00",
                        value: 887
                    },
                    {
                        date: "2015-11-07T06:52:09-08:00",
                        value: 901
                    },
                    {
                        date: "2015-09-26T21:04:43-07:00",
                        value: 920
                    },
                    {
                        date: "2015-10-07T04:27:02-07:00",
                        value: 927
                    },
                    {
                        date: "2015-12-18T23:14:27-08:00",
                        value: 895
                    },
                    {
                        date: "2015-11-02T19:20:38-08:00",
                        value: 933
                    },
                    {
                        date: "2015-12-02T12:25:35-08:00",
                        value: 905
                    },
                    {
                        date: "2015-12-29T05:33:28-08:00",
                        value: 951
                    },
                    {
                        date: "2015-09-11T15:19:26-07:00",
                        value: 881
                    },
                    {
                        date: "2016-01-17T10:31:57-08:00",
                        value: 927
                    },
                    {
                        date: "2016-01-08T04:48:25-08:00",
                        value: 920
                    },
                    {
                        date: "2016-01-18T18:35:47-08:00",
                        value: 909
                    },
                    {
                        date: "2015-09-08T13:15:15-07:00",
                        value: 880
                    },
                    {
                        date: "2015-11-15T15:29:35-08:00",
                        value: 913
                    },
                    {
                        date: "2016-01-11T09:58:36-08:00",
                        value: 962
                    },
                    {
                        date: "2015-09-03T07:21:11-07:00",
                        value: 922
                    },
                    {
                        date: "2015-11-05T22:58:34-08:00",
                        value: 878
                    },
                    {
                        date: "2015-12-13T05:29:27-08:00",
                        value: 909
                    },
                    {
                        date: "2015-12-09T12:10:40-08:00",
                        value: 939
                    },
                    {
                        date: "2015-11-15T07:29:04-08:00",
                        value: 946
                    },
                    {
                        date: "2015-11-24T18:23:02-08:00",
                        value: 897
                    },
                    {
                        date: "2015-12-03T05:12:38-08:00",
                        value: 973
                    },
                    {
                        date: "2015-10-19T05:22:27-07:00",
                        value: 892
                    },
                    {
                        date: "2015-09-11T11:56:14-07:00",
                        value: 911
                    },
                    {
                        date: "2015-09-09T01:31:18-07:00",
                        value: 927
                    },
                    {
                        date: "2016-01-18T00:58:04-08:00",
                        value: 927
                    },
                    {
                        date: "2015-08-22T21:34:26-07:00",
                        value: 920
                    },
                    {
                        date: "2015-12-22T08:21:49-08:00",
                        value: 945
                    }
                ]
            }
        ];

        initMenuAnimation();
        initAlertAction();

        initCharts(dataGraphs);

        function initCharts(dataset){
            var i, countDonut, countArc, countGraph, len, chartData, chart, charts, target;

            countDonut = countArc = countGraph = 0;
            charts = [];

            if(dataset){
                for(i = 0, len = dataset.length; i < len; i += 1){
                    chartData = dataset[i];
                    if(!!chartData){
                        if(chartData.type === 'donut'){
                            countDonut++;
                            target = '#chart-' + chartData.type + '-' + (countDonut);
                            chart = new ChartDonut(target, chartData.label, chartData.data, 174, 174, 40);
                        }
                        else if(chartData.type === 'arc'){
                            countArc++;
                            target = '#chart-' + chartData.type + '-' + (countArc);
                            chart = new ChartArc(target, chartData.label, chartData.data, 78, 78, 6, 2);
                        }
                        else if(chartData.type === 'graph'){
                            countGraph++;
                            target = '#chart-' + chartData.type + '-' + (countGraph);
                            chart = new ChartGraph(target, chartData.label, chartData.data, 800, 328, 'Unique Visits (K)', 'Sample Dates');
                        }

                        charts.push(chart);
                    }
                }
            }
        }


        function initElementSlider(target, elementType) {
            // GridContainerWidth = window.width - aside width - header width - (2 * globalpadding) - padding right - 4px borders
            var gridWidth = $(window).width() -  466 - (2 * 20) - 20 - 4;
            $(target).find('.grid--'+elementType).each(function(){
                $(this).width(gridWidth);
            });

            initSwitches(target, '.switches', gridWidth + 20);
        }

        function initSwitches(chartSliderTarget, target, offset){
            var prevElementIndex, elementIndex;

            $(target).on('click', '.switch-grid', function(e){
                // Get index of selected element
                prevElementIndex = $(target).find('.switch-grid.selected').parent().index();
                console.log(prevElementIndex);

                elementIndex = $(this).parent().index();
                if(!$(this).hasClass('selected')){
                    // Select clicked button
                    $(target).find('.switch-grid').removeClass('selected');
                    $(this).addClass('selected');

                    // Translate Slider by right amount
                    chartSliderOffset += (prevElementIndex - elementIndex) * offset;
                    console.log(chartSliderOffset);
                    applyTranslate(chartSliderTarget, chartSliderOffset);
                }
                console.log(elementIndex);


            });
        }

        function animateSlider(target, direction, amount) {
            var sign, offset;

            sign = (direction === 'left') ? 1 : -1;
            offset = amount * sign;
            xOffset += offset;
            currentIndex = Math.round(xOffset / 256) * -1;

            applyTranslate(target, xOffset);

        }

        function moveCalendarToMonth(n){
            // move to aug
            applyTranslate('#calendar--year', n * -256);
            currentIndex = n;
            xOffset = n * -256;
        }

        function appendListeners(target, prev, next){
            var n;

            $(prev).on('click', function(e) {
                e.preventDefault();

                if (currentIndex > 0) {

                    animateSlider(target, 'left', 256);

                }  
            });

            $(next).on('click', function(e) {
                e.preventDefault();

                if (currentIndex < 11) {

                    animateSlider(target, 'right', 256);

                }   
            });

        }

        function initAlertAction(){
            $('.close-alert').on('click', function(){
                $(this).closest('.module--alert').toggleClass('hidden');
            });
        }

        function applyTranslate(el, amount) {
            $(el).css({
                'transform': 'translate(' + amount + 'px, 0)',
                '-webkit-transform': 'translate(' + amount + 'px, 0)',
                '-moz-transform': 'translate(' + amount + 'px, 0)'
            });
        }

        // Calendar
        function generateCalendar(target, year, initIndex, prevNbDays, monthsArray){
            var i, j, len, llen, startIndex, endIndex, finalIndex, monthObj, strMonths, strDays, nbDays, daysArray;

            strMonths = '';
            strDays = '';
            startIndex = initIndex;
            nbDays = prevNbDays;

            for (i = 0, len = monthsArray.length; i < len; i += 1) {
                monthObj = monthsArray[i];

                // If the month ends perfectly we display the next row as 'opaque' to be sure we're not missing any days
                endIndex = ((startIndex-1 + monthObj.days) % 7 );
                finalIndex = (endIndex === 0) ? 6 : 7 - endIndex - 1;


                /*
                console.log('Month: ' + monthObj.month);
                console.log('start index begining: ' + startIndex);
                console.log('end index' + endIndex);
                */

                strMonths += '<li>';
                strMonths += '<h2 class="calendar--month article--title">'+ monthObj.month + ' ' + year + '</h2>';
                strMonths += '<ol class="calendar--week"><li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li></ol>';
                strMonths += '<ol id="calendar--days" class="calendar--days">';

                // days greyed before
                for (j = startIndex, llen = 0; j > llen; j -= 1) {
                    strDays += '<li class="day day--opaque">';
                    strDays += '<a href="#," class="day--link">';
                    strDays += (nbDays - (nbDays + j) % (nbDays + 1 ));
                    strDays += '</a>';
                    strDays += '</li>';
                }

                // days
                for (j = 0, llen = monthObj.days; j < llen; j += 1) {
                    strDays += '<li class="day">';
                    strDays += '<a href="#," class="day--link">';
                    strDays += (j+1);
                    strDays += '</a>';
                    strDays += '</li>';
                }

                // days greyed after
                for (j = 0, llen = finalIndex; j < llen; j += 1) {
                    strDays += '<li class="day day--opaque">';
                    strDays += '<a href="#," class="day--link">';
                    strDays += j+1;
                    strDays += '</a>';
                    strDays += '</li>';
                }

                startIndex = (endIndex + 1) % 7;
                console.log('start index end loop: ' + startIndex);
                //console.log(strDays); 

                strMonths += strDays;

                nbDays = monthObj.days;

                //console.log('current nbdays:' + nbDays);
                strDays = '';

                strMonths += '</ol>';
                strMonths += '</li>';
            }



            //console.log(strMonths);

            $(target).each(function(){
                var currentEl = $(this);
                var day, month, year, extraDigitDay, extraDigitMonth, currentMonth;

                currentEl.append(strMonths);

                if(currentEl.parent().hasClass('date-picker')){
                    // manually greys unpickable days
                    currentMonth = currentEl.children().get(7);

                    $(currentMonth).find('.day:not(:nth-child(n+7):nth-child(-n+15))').addClass('day--opaque');



                    // append listener on days
                    currentEl.on('click', '.day:not(.day--opaque) .day--link', function(e){
                        day = $(this).text();
                        console.log(day.toString);
                        extraDigitDay = (day.toString().length === 1) ? '0' : '';
                        month = currentIndex + 1;
                        year = 2016;
                        extraDigitMonth = (month.toString().length === 1) ? '0' : '';
                        $('#schedule--date-from').val(extraDigitDay + day + '/' + extraDigitMonth + month + '/' + year);
                    });
                }
                else{
                    daysArray = [5, 17];
                    // manually fill filled days
                    currentMonth = currentEl.children().get(7);

                    for(i = 0, len = daysArray.length; i < len; i++){
                        $(currentMonth).find('.day:nth-child(' + (daysArray[i] + 1) + ')').addClass('day--filled');
                    }
                }
            });
        }

        // Left menu
        function initMenuAnimation() {
            /*
            $('.has-subnav').on('click', function (e) {
                e.preventDefault();
                if ($(this).hasClass('subnav-opened')) {
                    $('.has-subnav').removeClass('subnav-opened');
                } else {
                    $('.has-subnav').removeClass('subnav-opened');
                    $(this).addClass('subnav-opened'); 
                }
            });
*/
        }

        function initClickableRows(){
            var clickableRows = document.getElementsByClassName("clickable-row");
            var parents = document.getElementsByClassName("has-hover");

            if (!parents) {
                return;
            }

            for(var i = 0, len = parents.length; i < len; i++){
                var parent = parents[i];
                parent.addEventListener('click', function(e) {
                    if (e.target && e.target.nodeName === 'TR') {
                        window.document.location = e.target.getAttribute("data-href");
                    }
                    else if (e.target && e.target.nodeName === 'TD') {
                        window.document.location = e.target.parentElement.getAttribute("data-href");
                    }
                }, true);
            }
        }

        function parseJsonData(jsonFiles) {
            var limit, htmlString, target;

            target = $('#missing-list-body');
            target.html('');
            limit = 1;

            parseJSONFiles(jsonFiles, function(results){
                htmlString = constructTableHTML(results, limit);
                target.html(htmlString);
            }); 
        }

        function constructTableHTML(dataArray, limit){
            var str, i, j, len, llen, item, key;

            str = '';

            for (i = 0, len = dataArray.length; i < len; i++){
                for (j = 0, llen = limit; j < llen; j++){
                    item = dataArray[i][j];

                    if(!!item){
                        str += '<tr>';

                        for(key in item){
                            if (key === 'status') {
                                str += '<td><span class="status status--warning">';
                                str += 'Warning';
                                str += '</span>Unavailable</td>';
                            }
                            else{
                                str += '<td>';

                                if (key === 'programId') {
                                    str += 'NBCU000-';
                                }
                                str += item[key];
                                str += '</td>';
                            }
                        }

                        str += '</tr>';
                    }
                }
            }

            return str;
        } 
    });
};

window.PageAssetDetail = function() {
    $(document).ready(function() {
        initMenuAnimation();
        initAsideComments();

        $('.content--table').on('click', '.display-tooltip, .icon--close', function(e){
            e.preventDefault();
            $(this).closest('td').find('.display-tooltip').toggleClass('status--active');
            $('#modal--target').toggleClass('hidden');
        });

        $('.content--table').on('click', '.tooltip, .icon--close', function(e){
            e.stopPropagation();
        });

        $('#modal--target').on('click', function(e){
            e.preventDefault();

            $('#modal--target').toggleClass('hidden');
            $('.display-tooltip.status--active').toggleClass('status--active');
        });

        $('.select--styled').on('click', function(e){
            $(this).toggleClass('active');
        });

        function initMenuAnimation() {
            $('.has-subnav').on('click', function () {

                if ($(this).hasClass('subnav-opened')) {
                    $('.has-subnav').removeClass('subnav-opened');
                } else {
                    $('.has-subnav').removeClass('subnav-opened');
                    $(this).addClass('subnav-opened'); 
                }
            });
        }

        function initAsideComments() {
            $('.has-comments').on('click', function () {

                if ($(this).hasClass('comments-opened')) {
                    $('.has-comments').removeClass('comments-opened');
                } else {
                    $('.has-comments').removeClass('comments-opened');
                    $(this).addClass('comments-opened'); 
                }
            });
        }
    });
};

window.PageSchedules = function(){
    var scrollAmount = 154;
            
    $(document).ready(function() {
         var startIndex, startNbDays, months, currentIndex, xOffset, dataGraphs, totalTooltipMargin;

        xOffset = 0;
        totalTooltipMargin = 0;
        startNbDays = 31;
        startIndex = 5;
        months = [
            {
                month: 'January',
                days: 31
            },
            {
                month: 'February',
                days: 29
            },
            {
                month: 'March',
                days: 31
            },
            {
                month: 'April',
                days: 30
            },
            {
                month: 'May',
                days: 31
            },
            {
                month: 'June',
                days: 30
            },
            {
                month: 'July',
                days: 31
            },
            {
                month: 'August',
                days: 31
            },
            {
                month: 'September',
                days: 30
            },
            {
                month: 'October',
                days: 31
            },
            {
                month: 'November',
                days: 30
            },
            {
                month: 'December',
                days: 31
            }
        ];

        var totalWidth = ($('.content--table-container th').length - 1) * scrollAmount;
        var visibleWidth = $('.content--table-container.table--schedule').width() - scrollAmount;
        var maxScroll = totalWidth - visibleWidth;
        var offset = $('.content--table-container.table--schedule').scrollLeft();
        if(offset === 0){
            $('#arrow--prev').hide();
        }

        console.log('total width container:' + totalWidth);
        console.log('visible width container:' + visibleWidth);
        console.log('max scroll: ' + maxScroll);

        initMenuAnimation();
        initAsideComments();
        initClickableRows();

        generateCalendar('.calendar--year', 2016, startIndex, startNbDays, months);
        moveCalendarToMonth(7);
       // appendListeners('#arrow--prev', '#arrow--next');
        initCalendarAnimation();

        $('.content--table').on('click', '.display-tooltip, .icon--close', function(e){
            e.preventDefault();


            if($('#modal--target').hasClass('hidden')){
                // If the modal is hidden
                console.log(e);

                // Tooltip Width and height
                var tooltipWidth = 600;
                var tooltipHeight = $('.tooltip').outerHeight();

                console.log(e.target.getBoundingClientRect().left);

                // Smart tooltip: calculate positition of click
                var clickBoundingBox = {
                    left: e.target.getBoundingClientRect().left,
                    top: e.target.getBoundingClientRect().top,
                    right: e.target.getBoundingClientRect().right,
                    bottom: e.target.getBoundingClientRect().bottom,
                    width: tooltipWidth,
                    height: tooltipHeight,
                    clickedElementWidth: e.target.getBoundingClientRect().width,
                    clickedElementHeight: e.target.getBoundingClientRect().height
                };
                var tableBoundingBox = e.delegateTarget.getBoundingClientRect();

                var padding = 20;
                var paddingArrow = {
                    left: 41,
                    right: 41,
                    top: 15,
                    bottom: 15
                };

                console.log(clickBoundingBox);
                console.log(tableBoundingBox);

                // If the tooltip overflows the table
                var overflowObj = checkBoundingBoxesOverflow(clickBoundingBox, tableBoundingBox, padding);
                console.log(overflowObj);
                if(overflowObj.isOverflowing){
                    if(overflowObj.overflow.bottom){
                        $('.tooltip').css({
                           marginTop: (-tooltipHeight - clickBoundingBox.clickedElementHeight - paddingArrow.bottom * 2) + 'px' 
                        });

                    }

                    if(overflowObj.overflow.left){
                        totalTooltipMargin = -paddingArrow.left;
                        $('.tooltip').css({
                           marginLeft: totalTooltipMargin + 'px' 
                        });
                    }

                    if(overflowObj.overflow.right){
                        totalTooltipMargin = (-tooltipWidth + paddingArrow.right) + (padding) + (24);
                        $('.tooltip').css({
                           //marginLeft: overflowObj.overflow.right + paddingArrow.left - paddingArrow.left + (clickBoundingBox.clickedElementWidth / 2) + 'px' 
                            marginLeft: totalTooltipMargin + 'px'
                        });
                    }


                    if(overflowObj.overflow.right && overflowObj.overflow.bottom){
                        $('.tooltip').addClass('tooltip--bottom-right'); 
                    }

                }
                else{
                    $('.tooltip').addClass('tooltip--top-left'); 
                    totalTooltipMargin = -41;
                    $('.tooltip').css({
                        marginTop: '15px',
                        marginLeft: (totalTooltipMargin - offset) + 'px'
                    }); 
                }
            }

            $(this).closest('td').find('.display-tooltip').toggleClass('status--active');
            $('#modal--target').toggleClass('hidden');
        });


        $('.content--table').on('click', '.display-tooltip', function(e){
            e.stopPropagation();
        });

        $('.content--table').on('click', '.tooltip, .icon--close', function(e){
            e.stopPropagation();
        });

        $('#modal--target').on('click', function(e){
            e.preventDefault();

            $('#modal--target').toggleClass('hidden');
            $('.display-tooltip.status--active').toggleClass('status--active');
        });

        $('#arrow--prev').on('click', function(e){

            if (offset >= scrollAmount) {
                $('.content--table-container.table--schedule').animate({
                    scrollLeft: offset - scrollAmount
                }, 100);
                offset -= scrollAmount;
                if(offset === 0){
                    $('#arrow--prev').hide();
                }
            }
        });
        $('#arrow--next').on('click', function(e){

            if (offset < maxScroll) {
                $('.content--table-container.table--schedule').animate({
                    scrollLeft: offset + scrollAmount
                }, 100);
                
                offset += scrollAmount;
                if(offset > 0){
                    $('#arrow--prev').show();
                }
            }
        });

        function checkBoundingBoxesOverflow(targetBbox, containerBbox, padding){
            var obj = {
                isOverflowing: false,
                overflow: {
                    top: null,
                    right: null,
                    bottom: null,
                    left: null
                }
            };

            if(targetBbox.left - padding < containerBbox.left){
                obj.isOverflowing = true;
                obj.overflow.left = containerBbox.left - (targetBbox.left);
            }

            if(containerBbox.top > targetBbox.top + padding ){
                obj.isOverflowing = true;
                obj.overflow.top = (targetBbox.top) - containerBbox.top;
            }

            if(containerBbox.right < targetBbox.left + targetBbox.width - padding){
                obj.isOverflowing = true;
                obj.overflow.right = containerBbox.right - (targetBbox.left);
            }

            if(containerBbox.bottom < targetBbox.top + targetBbox.height - padding){
                obj.isOverflowing = true;
                obj.overflow.bottom = containerBbox.bottom - (targetBbox.top + targetBbox.height);
            }

            return obj;
        }


        function initCalendarAnimation(){
            $('body').on('click', '.display-calendar', function(e){
                $('.calendar--container').toggleClass('active');
            });
        }

        function initMenuAnimation() {
            $('.has-subnav').on('click', function () {

                if ($(this).hasClass('subnav-opened')) {
                    $('.has-subnav').removeClass('subnav-opened');
                } else {
                    $('.has-subnav').removeClass('subnav-opened');
                    $(this).addClass('subnav-opened'); 
                }
            });
        }

        function initAsideComments() {
            $('.has-comments').on('click', function () {

                if ($(this).hasClass('comments-opened')) {
                    $('.has-comments').removeClass('comments-opened');
                } else {
                    $('.has-comments').removeClass('comments-opened');
                    $(this).addClass('comments-opened'); 
                }
            });
        }

        function initClickableRows(){
            var clickableRows = document.getElementsByClassName("clickable-row");
            var parents = document.getElementsByClassName("has-hover");

            if (!parents) {
                return;
            }

            for(var i = 0, len = parents.length; i < len; i++){
                var parent = parents[i];
                document.addEventListener('click', function(e) {
                    if (e.target && e.target.nodeName === 'TR') {
                        window.document.location = e.target.getAttribute("data-href");
                    }
                    else if (e.target && e.target.nodeName === 'TD') {
                        window.document.location = e.target.parentElement.getAttribute("data-href");
                    }
                }, true);
            }
        }

        function animateSlider(direction, amount) {
            var sign, offset;

            sign = (direction === 'left') ? 1 : -1;
            offset = amount * sign;
            xOffset += offset;
            currentIndex = Math.round(xOffset / 256) * -1;

            applyTranslate('.calendar--year', xOffset);

        }

        function moveCalendarToMonth(n){
            // move to aug
            applyTranslate('.calendar--year', n * -256);
            currentIndex = n;
            xOffset = n * -256;
        }

        function applyTranslate(el, amount) {
            $(el).css({
                'transform': 'translate(' + amount + 'px, 0)',
                '-webkit-transform': 'translate(' + amount + 'px, 0)',
                '-moz-transform': 'translate(' + amount + 'px, 0)'
            });
        }

        function appendListeners(prev, next){
            var n;

            $(prev).on('click', function(e) {
                e.preventDefault();

                if (currentIndex > 0) {

                    animateSlider('left', 256);

                }  
            });

            $(next).on('click', function(e) {
                e.preventDefault();

                if (currentIndex < 11) {

                    animateSlider('right', 256);

                }   
            });

        }

        // Calendar
        function generateCalendar(target, year, initIndex, prevNbDays, monthsArray){
            var i, j, len, llen, startIndex, endIndex, finalIndex, monthObj, strMonths, strDays, nbDays;

            strMonths = '';
            strDays = '';
            startIndex = initIndex;
            nbDays = prevNbDays;

            for (i = 0, len = monthsArray.length; i < len; i += 1) {
                monthObj = monthsArray[i];

                // If the month ends perfectly we display the next row as 'opaque' to be sure we're not missing any days
                endIndex = ((startIndex-1 + monthObj.days) % 7 );
                finalIndex = (endIndex === 0) ? 6 : 7 - endIndex - 1;


                /*
                console.log('Month: ' + monthObj.month);
                console.log('start index begining: ' + startIndex);
                console.log('end index' + endIndex);
                */

                strMonths += '<li>';
                strMonths += '<h2 class="calendar--month article--title">'+ monthObj.month + ' ' + year + '</h2>';
                strMonths += '<ol class="calendar--week"><li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li></ol>';
                strMonths += '<ol id="calendar--days" class="calendar--days">';

                // days greyed before
                for (j = startIndex, llen = 0; j > llen; j -= 1) {
                    strDays += '<li class="day day--opaque">';
                    strDays += '<a href="#," class="day--link">';
                    strDays += (nbDays - (nbDays + j) % (nbDays + 1 ));
                    strDays += '</a>';
                    strDays += '</li>';
                }

                // days
                for (j = 0, llen = monthObj.days; j < llen; j += 1) {
                    strDays += '<li class="day">';
                    strDays += '<a href="#," class="day--link">';
                    strDays += (j+1);
                    strDays += '</a>';
                    strDays += '</li>';
                }

                // days greyed after
                for (j = 0, llen = finalIndex; j < llen; j += 1) {
                    strDays += '<li class="day day--opaque">';
                    strDays += '<a href="#," class="day--link">';
                    strDays += j+1;
                    strDays += '</a>';
                    strDays += '</li>';
                }

                startIndex = (endIndex + 1) % 7;
                console.log('start index end loop: ' + startIndex);
                //console.log(strDays); 

                strMonths += strDays;

                nbDays = monthObj.days;

                //console.log('current nbdays:' + nbDays);
                strDays = '';

                strMonths += '</ol>';
                strMonths += '</li>';
            }



            //console.log(strMonths);

            $(target).each(function(){
                var currentEl = $(this);
                var day, month, year, extraDigitDay, extraDigitMonth, currentMonth;

                currentEl.append(strMonths);

                if(currentEl.parent().hasClass('date-picker')){
                    // manually greys unpickable days
                    currentMonth = currentEl.children().get(7);

                    console.log(currentMonth);

                    $(currentMonth).find('.day:not(:nth-child(n+7):nth-child(-n+15))').addClass('day--opaque');



                    // append listener on days
                    currentEl.on('click', '.day:not(.day--opaque) .day--link', function(e){
                        day = $(this).text();
                        console.log(day.toString);
                        extraDigitDay = (day.toString().length === 1) ? '0' : '';
                        month = currentIndex + 1;
                        year = 2016;
                        extraDigitMonth = (month.toString().length === 1) ? '0' : '';
                        $('#schedule--date-from').val(extraDigitDay + day + '/' + extraDigitMonth + month + '/' + year);
                    });
                }
            });
        }
    });
};


window.PageCatalogue = function() {
    $(document).ready(function() {
        var dataGraphs, chartSliderOffset;

        chartSliderOffset = 0;
        dataGraphs = [
            {
                type: 'donut',
                data: [
                    {
                        label: 'Received',
                        colorClass: 'donut--dark-blue',
                        value: 750
                    },
                    {
                        label: 'Processing',
                        colorClass: 'donut--medium-blue',
                        value: 358
                    },
                    {
                        label: 'Missing',
                        colorClass: 'donut--red',
                        value: 15
                    },
                    {
                        label: 'Rejected',
                        colorClass: 'donut--red',
                        value: 2
                    },
                    {
                        label: 'Processed',
                        colorClass: 'donut--light-blue',
                        value: 275
                    }

                ]
            },
            {
                type: 'donut',
                label: 'Tb',
                data: [
                    {
                        label: 'Received',
                        colorClass: 'donut--dark-blue',
                        value: 48.8
                    },
                    {
                        label: 'Processing',
                        colorClass: 'donut--medium-blue',
                        value: 14.2
                    } 
                ]
            }
        ];


        initMenuAnimation();
        initAsideComments();
        initElementSlider('#grid--container', 'table');
        initDonutCharts(dataGraphs);
        initClickableRows();

        $('.content--table').on('click', '.display-tooltip, .icon--close', function(e){
            e.preventDefault();


            if($('#modal--target').hasClass('hidden')){
                // If the modal is hidden
                console.log(e);

                // Tooltip Width and height
                var tooltipWidth = 600;
                var tooltipHeight = $('.tooltip').outerHeight();

                console.log(e.target.getBoundingClientRect().left);

                // Smart tooltip: calculate positition of click
                var clickBoundingBox = {
                    left: e.target.getBoundingClientRect().left,
                    top: e.target.getBoundingClientRect().top,
                    right: e.target.getBoundingClientRect().right,
                    bottom: e.target.getBoundingClientRect().bottom,
                    width: tooltipWidth,
                    height: tooltipHeight,
                    clickedElementWidth: e.target.getBoundingClientRect().width,
                    clickedElementHeight: e.target.getBoundingClientRect().height
                };
                var tableBoundingBox = e.delegateTarget.getBoundingClientRect();

                var padding = 20;
                var paddingArrow = {
                    left: 41,
                    right: 41,
                    top: 15,
                    bottom: 15
                };

                console.log(clickBoundingBox);
                console.log(tableBoundingBox);

                // If the tooltip overflows the table
                var overflowObj = checkBoundingBoxesOverflow(clickBoundingBox, tableBoundingBox, padding);
                console.log(overflowObj);
                if(overflowObj.isOverflowing){
                    if(overflowObj.overflow.bottom){
                        $('.tooltip').css({
                           marginTop: (-tooltipHeight - clickBoundingBox.clickedElementHeight - paddingArrow.bottom * 2) + 'px' 
                        });

                    }

                    if(overflowObj.overflow.left){
                        $('.tooltip').css({
                           marginLeft: -paddingArrow.left + 'px' 
                        });
                    }

                    if(overflowObj.overflow.right){
                        $('.tooltip').css({
                           //marginLeft: overflowObj.overflow.right + paddingArrow.left - paddingArrow.left + (clickBoundingBox.clickedElementWidth / 2) + 'px' 
                            marginLeft: (-tooltipWidth + paddingArrow.right) + (padding) + (24) + 'px'
                        });
                    }


                    if(overflowObj.overflow.right && overflowObj.overflow.bottom){
                        $('.tooltip').addClass('tooltip--bottom-right'); 
                    }

                }
                else{
                    $('.tooltip').addClass('tooltip--top-left'); 
                    $('.tooltip').css({
                        marginTop: '15px',
                        marginLeft: '-41px'
                    }); 
                }
            }

            $(this).closest('td').find('.display-tooltip').toggleClass('status--active');
            $('#modal--target').toggleClass('hidden');
        });

        $('.content--table').on('click', '.tooltip, .icon--close', function(e){
            e.stopPropagation();
        });

        $('#modal--target').on('click', function(e){
            e.preventDefault();

            $('#modal--target').toggleClass('hidden');
            $('.display-tooltip.status--active').toggleClass('status--active');
        });

        $('.select--styled').on('click', function(e){
            $(this).toggleClass('active');
        });


        function checkBoundingBoxesOverflow(targetBbox, containerBbox, padding){
            var obj = {
                isOverflowing: false,
                overflow: {
                    top: null,
                    right: null,
                    bottom: null,
                    left: null
                }
            };

            if(targetBbox.left - padding < containerBbox.left){
                obj.isOverflowing = true;
                obj.overflow.left = containerBbox.left - (targetBbox.left);
            }

            if(containerBbox.top > targetBbox.top + padding ){
                obj.isOverflowing = true;
                obj.overflow.top = (targetBbox.top) - containerBbox.top;
            }

            if(containerBbox.right < targetBbox.left + targetBbox.width - padding){
                obj.isOverflowing = true;
                obj.overflow.right = containerBbox.right - (targetBbox.left);
            }

            if(containerBbox.bottom < targetBbox.top + targetBbox.height - padding){
                obj.isOverflowing = true;
                obj.overflow.bottom = containerBbox.bottom - (targetBbox.top + targetBbox.height);
            }

            return obj;
        }

        function initDonutCharts(dataset){
            var i, len, chartData, chart, charts, target;

            charts = [];
            if(dataset){
                for(i = 0, len = dataset.length; i < len; i += 1){
                    chartData = dataset[i];
                    if(!!chartData){
                        target = '#chart-' + chartData.type + '-' + (i + 1);
                        console.log(target);
                        if(chartData.type === 'donut'){
                            chart = new ChartDonut(target, chartData.label, chartData.data, 174, 174, 40);

                        }
                        /*
                        else if(chartData.type === 'arc'){
                            chart = new ChartDonut('chart-' + chartData.type + '-' + (i + 1), chartData.data, 90, 90, 275, 0, 20);
                        }*/
                        charts.push(chart);
                    }  
                }
            }
        }

        function initElementSlider(target, elementType) {
            // GridContainerWidth = window.width - aside width - header width - (2 * globalpadding) - padding right - 4px borders
            var gridWidth = $(window).width() -  466 - (2 * 20) - 20 - 4 - 20;
            $(target).find('.grid--'+elementType).each(function(){
                $(this).width(gridWidth);
            });

            initSwitches(target, '.switches', gridWidth + 20);
        }

        function initSwitches(chartSliderTarget, target, offset){
            var prevElementIndex, elementIndex, switches;

            switches = $(target).find('a').filter(function(item){
                return $(this).hasClass('switch-grid');
            });

            console.log(switches);

            $(target).on('click', '.switch-grid', function(e){
                var that = this;
                // Get index of selected element
                prevElementIndex = switches.index($(target).find('.switch-grid.selected'));
                console.log('prev element index: '+prevElementIndex);

                elementIndex = switches.index($(this));
                console.log('clicked element index: '+elementIndex);

                if(!$(this).hasClass('selected')){
                    // Select clicked button
                    $(target).find('.switch-grid').removeClass('selected');
                    $(this).addClass('selected');

                    // Translate Slider by right amount
                    chartSliderOffset += (prevElementIndex - elementIndex) * offset;
                    console.log(chartSliderOffset);
                    applyLeftTransform(chartSliderTarget, chartSliderOffset);
                }
                console.log(elementIndex);


            });
        }

        function initMenuAnimation() {
            $('.has-subnav').on('click', function () {

                if ($(this).hasClass('subnav-opened')) {
                    $('.has-subnav').removeClass('subnav-opened');
                } else {
                    $('.has-subnav').removeClass('subnav-opened');
                    $(this).addClass('subnav-opened'); 
                }
            });
        }

        function initAsideComments() {
            $('.has-comments').on('click', function () {

                if ($(this).hasClass('comments-opened')) {
                    $('.has-comments').removeClass('comments-opened');
                } else {
                    $('.has-comments').removeClass('comments-opened');
                    $(this).addClass('comments-opened'); 
                }
            });
        }

        function applyTranslate(el, amount) {

            $(el).css({
                'transform': 'translate(' + amount + 'px, 0)',
                '-webkit-transform': 'translate(' + amount + 'px, 0)',
                '-moz-transform': 'translate(' + amount + 'px, 0)'
            });
        }

        function applyLeftTransform(el, amount){
            $(el).css({
                'left': amount + 'px'
            });
        }

        function initClickableRows(){
            var clickableRows = document.getElementsByClassName("clickable-row");
            var parents = document.getElementsByClassName("has-hover");

            if (!parents) {
                return;
            }

            for(var i = 0, len = parents.length; i < len; i++){
                var parent = parents[i];
                document.addEventListener('click', function(e) {
                    if (e.target && e.target.nodeName === 'TR') {
                        window.document.location = e.target.getAttribute("data-href");
                    }
                    else if (e.target && e.target.nodeName === 'TD') {
                        window.document.location = e.target.parentElement.getAttribute("data-href");
                    }
                }, true);
            }
        }
    });
};