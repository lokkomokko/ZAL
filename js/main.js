$(document).ready(function () {

    // анимация на главной
    if ($('.main-page').length >= 1) {

        var app = new Vue({
            el: '#app',
            data: {
                // events - все события, show_events - события отображаемые
                events: {},
                show_events: {}
            },

            methods: {

                // общий рендеринг мероприятий по клику на навигации либо при скроле
                list_render: function (obj) {
                    var self = this;
                    var index;
                    // определяем активное поле, добавляем класс
                    for (var i = 1; i <= Object.keys(this.events).length; i++) {
                        if (this.events[i] === obj) {
                            obj.active = true;
                            // obj._class = 'scroll-path__item scroll-path__item--active'
                            index = i;
                        }
                        else {
                            this.events[i].active = false;
                            // this.events[i]._class = 'scroll-path__item'
                        }
                    }
                    // меняем активное поле
                    self.show_events = obj.array;
                    self.show_events['index'] = index;

                },

                // механизм анимации
                render: function (new_items, old_items) {

                    // создание обертки для элементов
                    var list = $('.list'), wrapper = $('.event-wrapper');
                    if (list.length === 0) {
                        wrapper.append('<span class="list"></span>');
                        makeTemplate(new_items, wrapper.find('.list'));
                    }
                    // удаление старой обертки добавление новой
                    else {
                        list.addClass('list--old');
                        wrapper.append('<span class="list"></span>');
                        makeTemplate(new_items, $('.list:not(.list--old)'));

                        var old_list = $('.list--old');

                        var tl = new TimelineMax({
                            paused: true,
                            onComplete: function () {
                                //     TweenMax.to(old_list, .5, {
                                //         'opacity': 0, onComplete: function () {
                                //             old_list.remove()
                                //         }
                                //     })
                                old_list.remove()
                            }
                        });

                        var elements = $('.list:not(.list--old) .event'),
                            animate_array = [],
                            count = 0;


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

                        // dry tweenmax
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
                            if (odd) {
                                p = params;

                            }
                            else {
                                p['one'] = params.two;
                                p['two'] = params.one;
                                time = even_time;
                            }

                            // getted params
                            var gp = index % 2 === 0 ? p.one : p.two;

                            var settings = {ease: Power1.easeIn,};
                            settings[gp.direction] = gp.size;

                            tl.add(TweenMax.set(item.find('.event__bg'), {'background-color': color}));
                            tl.add('scene')
                                .to('.list--old', .5, {opacity: 0, ease: Power1.easeIn}, .5)
                                .from(item.find('.event__img'), gp.duration, settings, time + gp.delay)
                                .from(item.find('.event__bg'), gp.duration + .1, {
                                    'opacity': .8,
                                    ease: Power1.easeIn
                                }, time + gp.delay)
                                .from(item.find('.event__info'), gp.duration, {'opacity': 0}, (time + gp.delay) + .7)
                        }


                        // добавляем каждому элементу анимацию
                        var time = 0,
                            colors = ['#EE2324', '#ffffff', '#000000'],
                            color_count = 0,
                            color_count_2 = colors.length - 1;


                        animate_array.forEach(function (item, outer_index) {
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
                        tl.restart()
                    }

                    // функция создания евента по шаблону
                    function makeTemplate(array, wrapper) {
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
                        })
                    }

                    // анимация навигации
                    var dir = old_items.index > this.show_events.index ? 'top' : 'bottom';
                    // var line = $('.scroll-path__item--active .scroll-path__item-line');

                    // проверка на единичный сколл

                    $('.scroll-path__item').removeClass('scroll-path__item--active');

                    var need_navitem = $('.scroll-path__item[data-index=' + (this.show_events.index) + ']');
                    need_navitem.addClass('scroll-path__item--active');

                    // console.log(need_navitem.data('index'));

                    // var line = need_navitem.find('.scroll-path__item-line');

                    num = this.show_events.index - old_items.index;
                    var tl = new TimelineMax();


                    if (num === 1 || num === -1) {
                        if (dir === 'bottom') {
                            need_navitem.addClass('scroll-path__item-animate-bottom');
                            setTimeout(function () {
                                need_navitem.removeClass('scroll-path__item-animate-bottom')
                            }, 1000)

                        }
                        else {
                            need_navitem.addClass('scroll-path__item-animate-top');
                            setTimeout(function () {
                                need_navitem.removeClass('scroll-path__item-animate-top')
                            }, 1000)
                        }
                    }


                },

                // функция пересчета евентов при ресайзе
                resize: function (events_counts_list) {
                    var count = 0;
                    var arr = {};
                    var old_array = [];
                    var self = this;

                    $.each(self.events, function (i, item) {
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

                    self.show_events = arr[1].array.slice();
                    arr[1].active = true;
                    // arr[1]._class = 'scroll-path__item scroll-path__item--active';
                    self.events = arr;
                }

            },
            watch: {
                // следим за отображаемым полем, если изменяется - вызываем рендер
                show_events: function (new_items, old_items) {
                    this.render(new_items, old_items)

                }
            },
            created: function () {
                // устанавливаем кол-во показываемых мероприятий и количество их в ряду
                var events_counts_list = 9;
                window.elems_count = 3;

                if ($(window).width() >= 1441) {
                    events_counts_list = 12;
                    window.elems_count = 4
                }
                // принимаем данные
                var self = this;
                $.ajax({
                    type: "GET",
                    url: "json-example.json",
                    success: function (data) {

                        // собираем объекты массивов отображаемых мероприятий
                        var count = 0;
                        var arr = {};
                        data.events.forEach(function (item, i) {

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

                        self.show_events = arr[1].array.slice();
                        self.show_events['index'] = 1;
                        arr[1].active = true;
                        // arr[1]._class = 'scroll-path__item scroll-path__item--active';
                        self.events = arr;
                        setTimeout(function () {
                            $('.scroll-path__item[data-index=1]').addClass('scroll-path__item--active')
                        })


                    },
                    error: function (error) {
                        console.log('возникла ошибка', error)
                    }
                });

            },
            mounted: function () {

                var self = this;
                var change = true;

                // ловим ресайз
                $(window).resize(function () {
                    if ($(window).width() >= 1441) {

                        change = window.elems_count === 4;

                        events_counts_list = 12;
                        window.elems_count = 4;

                        if (!change) {

                            self.resize(events_counts_list);
                            change = !change
                        }
                    }
                    else {

                        change = window.elems_count === 3;

                        events_counts_list = 9;
                        window.elems_count = 3;
                        if (!change) {

                            self.resize(events_counts_list);
                            change = !change
                        }
                    }
                });

                // функция поиска активного поля
                function activeSearch(direction) {

                    var dir = direction === 'bottom' ? 1 : -1;

                    $.each(self.events, function (i, item) {
                        if (item.active === true) {
                            if (self.events[Number(i) + dir]) {
                                self.list_render(self.events[Number(i) + dir]);
                                return false
                            }
                        }
                    })
                }


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
                    }, 500);

                    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                }
            }
        })
    }
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
            )


        myMap.behaviors.disable('scrollZoom')
        myMap.controls.add(new ymaps.control.ZoomControl({options: {position: {left: 10, top: 250}}}));
        myMap.geoObjects
            .add(myPlacemark)
    });

}
