$(document).ready(function () {

    // анимация на главной
    if ($('.main-page').length >= 1) {

        // общий рендеринг мероприятий по клику на навигации либо при скроле

        window.show_events = [];
        window.events = {};

        function list_render(obj) {
            var self = this;
            var index;
            // определяем активное поле, добавляем класс
            for (var i = 1; i <= Object.keys(window.events).length; i++) {
                if (window.events[i] === obj) {
                    obj.active = true;
                    // obj._class = 'scroll-path__item scroll-path__item--active'
                    index = i;
                }
                else {
                    window.events[i].active = false;
                    // window.events[i]._class = 'scroll-path__item'
                }
            }
            // меняем активное поле
            console.log(obj.array, window.show_events)
            render(obj.array, window.show_events, index)
            window.show_events = obj.array;
            window.show_events['index'] = index;

        }

        function dotRender() {

            var dots_wrapper = $('.scroll-path');
            for (var i = 1; i <= Object.keys(window.events).length; i++) {
                dots_wrapper.append('<div class="scroll-path__item" data-index="' + i + '">\n' +
                    '                        <span class="scroll-path__item-line"></span>\n' +
                    '                    </div>')
            }

        }


        // функция создания евента по шаблону
        function makeTemplate(array, wrapper) {
            if (!window.mobile) {
                var events_counts_list = 9;

                if ($(window).width() >= 1441) {
                    events_counts_list = 12;
                }
                array.forEach(function (item) {
                    wrapper.append(
                        '            <a href="' + item.link + '" class="event">\n' +
                        '                    <span class="event__img"><span class="event__bg"></span><img src="' + item.img + '" alt=""></span>\n' +
                        '                    <span class="event__info">\n' +
                        '                        <span class="event__info-top">\n' +
                        '                            <p class="event__date">' + item.date + '</p>\n' +
                        '                            <h3 class="event__name">' + item.name + '</h3>\n' +
                        '                            <p class="event__desc">' + item.desc + '</p>\n' +
                        '                        </span>\n' +
                        '                        <span class="event__btn btn">купить билет</span>\n' +
                        '                    </span>\n' +
                        '                </a>'
                    );

                });
                var event_len = wrapper.find('.event').length;
                if (event_len < events_counts_list) {

                    var i = 1;
                    while (i <= (events_counts_list - event_len)) {
                        wrapper.append(
                            '            <div class="event event--empty">\n' +
                            '                    <span class="event__img"></span>\n' +
                            '                    <span class="event__info">\n' +
                            '                        <span class="event__info-top">\n' +
                            '                            <p class="event__date"></p>\n' +
                            '                            <h3 class="event__name"></h3>\n' +
                            '                            <p class="event__desc"></p>\n' +
                            '                        </span>\n' +
                            '                    </span>\n' +
                            '                </div>'
                        );
                        i++
                    }
                }
            }
            else {
                $('.event-wrapper').append('<span class="list"></span>');
                array.forEach(function (item) {
                    $('.list').append(
                        '            <a href="' + item.link + '" class="event">\n' +
                        '                    <span class="event__img"><span class="event__bg"></span><img src="' + item.img + '" alt=""></span>\n' +
                        '                    <span class="event__info">\n' +
                        '                        <span class="event__info-top">\n' +
                        '                            <p class="event__date">' + item.date + '</p>\n' +
                        '                            <h3 class="event__name">' + item.name + '</h3>\n' +
                        '                            <p class="event__desc">' + item.desc + '</p>\n' +
                        '                        </span>\n' +
                        '                        <span class="event__btn btn">купить билет</span>\n' +
                        '                    </span>\n' +
                        '                </a>'
                    );

                });
            }

        }

        function render(new_items, old_items, index) {

            // узнаем направление движения
            var dir_bottom = old_items.index < index;
            console.log(dir_bottom, old_items.index, window.show_events.index)
            // создание обертки для элементов (первый рендеринг)
            var list = $('.list'), wrapper = $('.event-wrapper');
            if (list.length === 0) {
                wrapper.append('<span class="list"></span>');
                makeTemplate(new_items, wrapper.find('.list'));
            }

            // удаление старой обертки добавление новой
            else {
                $('.list--old').remove();
                list.addClass('list--old');
                wrapper.append('<span class="list"></span>');
                makeTemplate(new_items, $('.list:not(.list--old)'));

                var old_list = $('.list--old');

                var tl = new TimelineMax({
                    paused: true,
                    onComplete: function () {
                        // $('.list').css('pointer-events', 'auto')
                        // old_list.remove()
                        // TweenMax.set('.list',  {'pointer-events': 'auto'})
                    }
                });

                var elements = $('.list:not(.list--old) .event'),
                    animate_array = [], animate_array_old = [],
                    count = 0,
                    old_elements = $('.list--old .event');


                // распределение в массив групп элементов для дальнейшей работы
                elements.each(function (index) {

                    if (index % window.elems_count === 0) {
                        count++
                    }
                    if (!animate_array[count]) {
                        animate_array[count] = []
                    }
                    animate_array[count].push($(this))
                });

                old_elements.each(function (index) {

                    if (index % window.elems_count === 0) {
                        count++
                    }
                    if (!animate_array_old[count]) {
                        animate_array_old[count] = []
                    }
                    animate_array_old[count].push($(this))
                });

                // dry tweenmax (функция анимации)
                var even_time = 0;

                function animate(item, index, odd, time, color) {

                    var p = {},
                        params = {
                            one: {
                                duration: .5,
                                delay: .1,
                                direction: 'x',
                                size: '100%'
                            },
                            two: {
                                duration: .7,
                                delay: 0,
                                direction: 'y',
                                size: '-100%'
                            }
                        };

                    // проверка на четный ряд
                    if (odd) {
                        p = params;
                    }
                    else {
                        p['one'] = params.two;
                        p['two'] = params.one;
                    }
                    // проверка на реверс
                    if (!dir_bottom) {
                        // $('.list--old').css('z-index', 1);

                        params['one'].size = '-100%';
                        params['one'].direction = 'y';
                        params['two'].size = '100%';
                        params['two'].direction = 'x';

                        tl.add(TweenMax.set('.list--old', {'z-index': 1}));
                        tl.set('.list:not(.list--old) .event__info ', {'z-index': 0});

                    }

                    $('.list').css('pointer-events', 'none');
                    setTimeout(function () {
                        $('.list:not(.list--old)').css('pointer-events', 'auto')
                        tl.set('.list:not(.list--old) .event__info ', {'z-index': 1});
                    }, 1000);


                    time = even_time;

                    // getted params
                    var gp = index % 2 === 0 ? p.one : p.two;

                    var settings = {ease: Power1.easeOut};
                    settings[gp.direction] = gp.size;

                    tl.add(TweenMax.set(item.find('.event__bg'), {'background-color': color}));
                    tl.add('scene')

                        .from(item.find('.event__img'), gp.duration, settings, 0)
                        .from(item.find('.event__bg'), gp.duration + .1, {
                            'opacity': .8,
                            ease: Power1.easeOut
                        }, 0)
                        .from(item.find('.event__info'), gp.duration, {'opacity': 0}, .5)
                    if (dir_bottom) {
                        tl.to('.list--old', .5, {opacity: 0, ease: Power1.easeIn}, .3)
                    }

                }

                // добавляем каждому элементу анимацию
                var time = 0,
                    colors = ['#EE2324', '#ffffff', '#000000'],
                    color_count = 0,
                    color_count_2 = colors.length - 1,
                    // массив с нужными элементами
                    need_arr = [];

                need_arr = dir_bottom ? animate_array : animate_array_old;

                need_arr.forEach(function (item, outer_index) {
                    if (outer_index % 2 === 0) {

                        item.forEach(function (item, index) {
                            animate(item, index, true, time, colors[color_count]);
                            color_count = color_count === (colors.length - 1) ? 0 : color_count + 1;


                        })
                    }
                    else {

                        item.forEach(function (item, index) {
                            animate(item, index, false, time, colors[color_count_2]);
                            color_count_2 = color_count_2 === 0 ? (colors.length - 1) : color_count_2 - 1;
                        })
                    }
                    time = time + .2;
                    even_time = time - .3;
                });

                // запуск
                tl.restart();
                if (!dir_bottom) {
                    tl.reverse(-.6)


                }
            }


        }

        function resize(events_counts_list) {
            var count = 0;
            var arr = {};
            var old_array = [];
            var self = this;

            $.each(window.events, function (i, item) {
                item.array.forEach(function (value) {
                    old_array.push(value)
                })
            });
            old_array.forEach(function (item, i) {

                if (i % events_counts_list === 0) {
                    count++
                }
                if (!arr[count]) {
                    arr[count] = {
                        array: [],
                        // _class: 'scroll-path__item',
                        active: false
                    }
                }
                arr[count].array.push(item)
            });

            window.show_events = arr[1].array.slice();
            arr[1].active = true;
            // arr[1]._class = 'scroll-path__item scroll-path__item--active';
            window.events = arr;
            $('.scroll-path__item').remove();
            dotRender()

        }


        // created
        var is_iPad = navigator.userAgent.match(/iPad/i) != null;
        var win_width = $(window).width();
        var events_counts_list = 9;
        window.elems_count = 3;

        if (win_width >= 1441) {
            events_counts_list = 12;
            window.elems_count = 4
        }

        window.mobile = win_width <= 850 || is_iPad;

        // принимаем данные
        var self = this;
        $.ajax({
            type: "GET",
            url: "/events/index/get-list-events",
            // url: "json-example.json",
            success: function (data) {

                // собираем объекты массивов отображаемых мероприятий
                var count = 0;
                var arr = {};

                data.events.forEach(function (item, i) {

                    $('.image-preload').append('<img src="' + item.img + '"/>')

                    if (i % events_counts_list === 0) {
                        count++
                    }
                    if (!arr[count]) {
                        arr[count] = {
                            array: [],
                            active: false
                        }
                    }
                    arr[count].array.push(item)
                });

                if (!window.mobile) {

                    window.show_events = arr[1].array.slice();
                    window.show_events['index'] = 1;
                    arr[1].active = true;
                    window.events = arr;
                    setTimeout(function () {
                        $('.scroll-path__item[data-index=1]').addClass('scroll-path__item--active')
                    })
                    console.log(window.show_events, window.events);

                    dotRender();
                    render(window.show_events, window.show_events)
                }
                else {
                    arr_mobile = [];
                    data.events.forEach(function (item) {
                        arr_mobile.push(item);
                    });
                    makeTemplate(arr_mobile)
                }

            },


            error: function (error) {
                console.log('возникла ошибка', error)
            }
        });

        // mounted
        var change = true;

        // ловим ресайз
        $(window).resize(function (e) {

            if ($(window).width() >= 1441) {

                change = window.elems_count === 4;

                events_counts_list = 12;
                window.elems_count = 4;

                if (!change) {

                    resize(events_counts_list);
                    change = !change
                }
            }
            else {

                change = window.elems_count === 3;

                events_counts_list = 9;
                window.elems_count = 3;
                if (!change) {

                    resize(events_counts_list);
                    change = !change
                }
            }

            window.mobile = $(window).width() <= 768;
        });

        // функция поиска активного поля
        function activeSearch(direction) {

            var dir = direction === 'bottom' ? 1 : -1;

            $.each(window.events, function (i, item) {
                if (item.active === true) {
                    if (window.events[Number(i) + dir]) {
                        list_render(window.events[Number(i) + dir]);
                        changeDots($('.scroll-path__item[data-index=' + Number(i) + dir + ']'), true);
                        return false
                    }
                }
            })
        }

        function changeDots(item, scroll) {
            if (!scroll) {
                list_render(window.events[item.data('index')])
            }


            // анимация навигации
            // проверка на единичный сколл
            var old_index = $('.scroll-path__item--active').data('index');
            $('.scroll-path__item').removeClass('scroll-path__item--active');

            var need_navitem = $('.scroll-path__item[data-index=' + (window.show_events.index) + ']');
            need_navitem.addClass('scroll-path__item--active');


            num = window.show_events.index - old_index;

            var tl = new TimelineMax();
            if (num === 1 || num === -1) {
                if (num === 1) {
                    need_navitem.addClass('scroll-path__item-animate-bottom');
                    setTimeout(function () {
                        need_navitem.removeClass('scroll-path__item-animate-bottom')
                    }, 1000)

                }
                else if (num === -1) {
                    need_navitem.addClass('scroll-path__item-animate-top');
                    setTimeout(function () {
                        need_navitem.removeClass('scroll-path__item-animate-top')
                    }, 1000)
                }
            }
        }

        $(document).on('click', '.scroll-path__item', function () {
            changeDots($(this))
        });

        // ловим скрол и меням поле
        var elem = document.querySelector('.event-wrapper');
        if (elem.addEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                elem.addEventListener("wheel", onWheel);
            } else if ('onmousewheel' in document) {
                // устаревший вариант события
                elem.addEventListener("mousewheel", onWheel);
            } else {
                // Firefox < 17
                elem.addEventListener("MozMousePixelScroll", onWheel);
            }
        } else { // IE8-
            elem.attachEvent("onmousewheel", onWheel);
        }

        var disable_scroll = false;

        function onWheel(e) {
            if (disable_scroll) {
                return
            }
            e = e || window.event;

            var delta = e.deltaY || e.detail || e.wheelDelta;
            var scroll_direction = delta > 0 ? 'bottom' : 'top';

            activeSearch(scroll_direction);
            disable_scroll = true;
            setTimeout(function () {
                disable_scroll = false;
            }, 1000);

            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        }


    }


    $('.sidebar__search--search-icon').click(function () {
        if ($('.header-search__wrap input').val() === '') {
            $('.header-search__wrap').toggleClass('header-search__wrap--hide');
            $('.sidebar__search').toggleClass('sidebar__search--open');
        }
        else {
            $('.header-search__wrap form').submit()
        }
    });
    $('.sidebar__search--close-icon').click(function () {
        $('.sidebar__search').removeClass('sidebar__search--open');
        $('.header-search__wrap').toggleClass('header-search__wrap--hide');
    });


    if ($('#map').length >= 1) {
        ymaps.ready(function () {
            var myMap = new ymaps.Map('map', {
                    center: [59.906660, 30.307461],
                    zoom: 16,
                    controls: []
                }, {
                    searchControlProvider: 'yandex#search'
                }),

                // Создаём макет содержимого.
                MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
                ),

                myPlacemark = new ymaps.Placemark([59.906681, 30.307429], {
                        hintContent: 'Клуб зал ожидания',
                        balloonContent: '197136 Санкт-Петербург, улица Рентгена, 7'
                    }
                    //  {
                    //     // Опции.
                    //     // Необходимо указать данный тип макета.
                    //     iconLayout: 'default#image',
                    //     // Своё изображение иконки метки.
                    //     iconImageHref: 'img/bable_shadow.png',
                    //     // Размеры метки.
                    //     iconImageSize: [49, 51],
                    //     // Смещение левого верхнего угла иконки относительно
                    //     // её "ножки" (точки привязки).
                    //     iconImageOffset: [-5, -38]
                    // }
                );


            myMap.behaviors.disable('scrollZoom');
            myMap.controls.add(new ymaps.control.ZoomControl({options: {position: {left: 10, top: 250}}}));
            myMap.geoObjects
                .add(myPlacemark)
        });


        $('.header__right-adress')
            .click(function () {
                $('html, body').animate({
                    scrollTop: $(".footer__adress-wrap").offset().top
                }, 1000);
            })


    }
    else {
        $('.header__right-adress').addClass('header__right-adress--disable');
    }

    //========== Common events ==============================

    $('.header__mobile-icon').click(function () {
        $(this).toggleClass('header__mobile-icon--open')
        $('html').toggleClass('overflow-hidden');
        $('.header__nav').toggleClass('header__nav--open')
    });


    //====== Event page =====================================


    if ($('.e-top').length >= 1) {
        $('.e-sharing__img ').fancybox()

        if ($('.e-sharing__img img').length === 0 || $('.e-sharing__img img').height() === 0) {
            $('.e-info__top, .e-info__bottom').addClass('e-info--no-image');
        }
        var got_img = false;

        function mobile_img() {
            if (got_img === false || $('.e-image__mobile').length === 0) {
                $('.e-top__left').prepend('<div class="e-image__mobile"></div>');
                $('.e-image__mobile').append($('.e-image').html())
                got_img = true;
            }
        }

        if ($(window).width() <= 660) {
            mobile_img()
        }
        $(window).resize(function () {
            mobile_img()
        })

    }
    //====== Event ARICHIVE page =====================================

    if ($('.e-archive').length >= 1) {
        $('body').addClass('event-archive');

        if ($('.e-image').length === 0) {
            $('.e-text').addClass('e-text--archive');
        }
    }


    // ====== Archive page ===================================

    if ($('.ar-content').length >= 1) {

        var myLazyLoad = new LazyLoad();

        $('.footer__map, .footer__adress-wrap').hide();
        // загруженные года
        var used_years = [];

        // шаблон event-a
        function eventTemplate(data) {
            if (data.img) {
                return '  <a href="' + data.link + '" class="ar-item col-3">\n' +
                    '                          <span class="ar-item__inner-wrapper">\n' +
                    '                             <span class="ar-item__img">\n' +
                    '                                 <img data-src="' + data.img + '" alt="">\n' +
                    '                             </span>\n' +
                    '                             <span class="ar-item__date">' + data.date + '</span>\n' +
                    '                             <h3 class="ar-item__name">' + data.name + '</h3>\n' +
                    '                          </span>\n' +
                    '                    </a>';
            }
            else {
                return '  <a href="' + data.link + '" class="ar-item col-3">\n' +
                    '                          <span class="ar-item__inner-wrapper">\n' +
                    '                             <span class="ar-item__img ar-item__img--empty"></span>\n' +
                    '                             <span class="ar-item__date">' + data.date + '</span>\n' +
                    '                             <h3 class="ar-item__name">' + data.name + '</h3>\n' +
                    '                          </span>\n' +
                    '                    </a>';
            }
        }

        // рендер евентов определенного года
        function renderRow(year, data) {

            var this_row = $('.ar__year-wrapper[data-year=' + year + ']');
            this_row.removeClass('ar__year-wrapper--empty');

            for (var i = 0; i <= Object.keys(data).length - 1; i++) {

                this_row.append(eventTemplate(data[i]));
            }
            myLazyLoad.update();
            setTimeout(function () {
            }, 400)


        }

        // функция ajax запроса нужного года
        function eventsAjax(year) {
            if (used_years.indexOf(year) === -1) {
                $.ajax({
                    type: "GET",
                    url: "/archive-year/" + String(year),
                    // url: "/archive-json/" + String(year) + '.json',
                    success: function (data) {
                        renderRow(year, data.events)
                    },

                    error: function (error) {
                        console.log('возникла ошибка', error)
                    }
                });

                used_years.push(year);
            }
        }

        // первый рендер
        var first_wrap = $('.ar__year-wrapper').first();
        eventsAjax($('.scroll-path__item').first().data('year'));
        first_wrap.removeClass('ar__year-wrapper--empty');
        if (!(first_wrap.height() > 415)) {
            console.log(1231, $('.ar__year-wrapper:nth-child(2)'))
            $('.ar__year-wrapper:nth-child(2)').removeClass('ar__year-wrapper--empty');
            eventsAjax($('.scroll-path__item:nth-child(2)').data('year'));
        }

        // навигация по клику на год
        var nav_items = $('.scroll-path__item--archive');

        nav_items.click(function () {
            var year = $(this).text();
            $('html, body').animate({
                scrollTop: $(".ar__year-wrapper[data-year=" + year + "]").offset().top - 63
            }, 1000);
        });

        // функция чека событий во вьюпорте
        function isScrolledIntoView(elem) {
            var path = 400;
            var docViewTop = $(window).scrollTop();

            var elemTop = $(elem).offset().top;
            return (elemTop <= docViewTop + path);
        }


        var scroll_path = $('.scroll-path');
        var offset_bottom = scroll_path.scrollTop() + scroll_path.height();

        // адекватное отображение точек
        //----------------------------------------------
        $('.scroll-path__item-dots--next').css('top', offset_bottom);

        $(window).resize(function () {
            offset_bottom = scroll_path.scrollTop() + scroll_path.height();

            $('.scroll-path__item-dots--next').css('top', offset_bottom);
        });

        if ($('.scroll-path__inner').height() - 60 <= scroll_path.height()) {
            $('.scroll-path__item-dots--next').remove();
            $('.scroll-path').css('overflow', 'hidden')
        }
        //----------------------------------------------
        // Eсли годов больше чем нужно, запускаем механизм скрола годов

        else {
            $('.scroll-path__item-dots--next').show();
            // мягкий скролл
            scroll_path.niceScroll({
                scrollspeed: 300, // scrolling speed
                mousescrollstep: 55,
                horizrailenabled: false,
                cursorwidth: "0px",
                bouncescroll: true,
                spacebarenabled: false,
                cursorfixedheight: true,
                enablemouselockapi: false,
                nativeparentscrolling: false, // detect bottom of content and let parent to scroll, as native scroll does
                enablescrollonselection: false, // enable auto-scrolling of content when selection text
                disablemutationobserver: true
            })
        }

        // скрываем/показываем троеточия
        scroll_path.on('scroll mousewheel touchmove', function () {

            if (scroll_path.scrollTop() > 0) {

                $('.scroll-path__item-dots--prev').fadeIn(200)
            }
            else {
                $('.scroll-path__item-dots--prev').fadeOut(200)

            }
            if ($('.scroll-path__inner').height() - 50 <= scroll_path.scrollTop() + scroll_path.height()) {
                $('.scroll-path__item-dots--next').fadeOut(200)
            }
            else {
                $('.scroll-path__item-dots--next').fadeIn(200)
            }
        });


        // обработка клика на точки
        $('.scroll-path__item-dots--prev').click(function () {

            scroll_path.animate({
                scrollTop: 0
            }, 400);
        });
        $('.scroll-path__item-dots--next').click(function () {

            scroll_path.animate({
                scrollTop: scroll_path.height() + 2000
            }, 400);
        });


        // ловим скролл и меняем год на актуальный во вьюпорте
        $(window).scroll(function (e) {


            clearTimeout($.data(this, 'scrollTimer'));
            var year;


            $('.ar__year-wrapper').each(function () {
                if (isScrolledIntoView($(this))) {

                    year = $(this).data('year');

                    if ($('scroll-path__item--active').data('year') !== year) {
                        // берем данные с сервера
                        nav_items.removeClass('scroll-path__item--active');

                        $('.scroll-path__item[data-year=' + year + ']').addClass('scroll-path__item--active');

                        var s_path = ($('.scroll-path__item--active').offset().top - $('.scroll-path__inner').offset().top) - 60;
                        scroll_path.getNiceScroll(0).doScrollTop(s_path, 300);

                        count = 1;
                    }

                }

            });

            $.data(this, 'scrollTimer', setTimeout(function () {
                eventsAjax(year);
            }, 50));


        })
    }
});



