(function ($) {
    var options = {
        wrapper: '.slider-wrapper',
        container: '.slider-container',
        item: '.item-slider',
        nav: '.slider-nav',
        transition: 'slide',
        end: '',
        auto: false
    }

    var methods = {
        init: function (config) {

            return this.each(function () {

                var $this = $(this);

                /* Get Options */
                options = $.extend({}, options, config);

                var slider = $(this);
                var wrapper = slider.children(options.wrapper);
                var next = wrapper.children(".next");
                var prev = wrapper.children(".prev");
                var container = wrapper.children(options.container);
                var navigation = wrapper.children(options.nav);
                var navigation_item = navigation.find('li > a');

                //var timer;
                var count = container.children(options.item).length;

                /* Setup Slider */
                var item_width = $(options.item).outerWidth(true);

                if (options.transition == "slide") {
                    container.width(item_width * count);
                    wrapper.addClass('overflow-hidden');

                    $(options.item).each(function () {
                        $(this).addClass('float-left');
                    });
                }

                /* Setup Timer */
                if (options.auto) {
                    slider.bind("tick", function (e) {
   
                        var wrapper = slider.children(options.wrapper);
                        var container = wrapper.children(options.container);
                        var count = container.children(options.item).length;

                        slider.timer = window.setTimeout(function () {
                            var currentIndex = container.children('li.active').index();
                            if (currentIndex >= count - 1) {
                                currentIndex = -1;
                            };
                            methods.transition([currentIndex + 1], slider);
                            slider.trigger("tick");
                        }, 5000);
                    });

                    slider.trigger("tick");
                }

                /* Setup Navigator */
                next.click(function (e) {
                    e.preventDefault();

                    var currentIndex = container.children('li.active').index();
                    methods.transition([currentIndex + 1], slider);

                    if (options.auto) {
                        methods.reset(slider);
                    }
                });

                prev.click(function (e) {
                    e.preventDefault();

                    var currentIndex = container.children('li.active').index();
                    methods.transition([currentIndex - 1], slider);

                    if (options.auto) {
                        methods.reset(slider);
                    }
                });

                navigation_item.click(function (e) {
                    e.preventDefault();

                    var index = $(this).attr('rel');
                    methods.transition([index - 1], slider);

                    if (options.auto) {
                        methods.reset(slider);
                    }
                });

            });
        },
        reset: function (slider) {
            clearTimeout(slider.timer);
        },
        transition: function (index, slider) {

            //var slider = this;
            var wrapper = slider.children(options.wrapper);
            var container = wrapper.children(options.container);
            var navigation = wrapper.children(options.nav);

            var currentIndex = container.children('li.active').index();

            var current = container.children('li').eq(index);
            var item_width = $(options.item).outerWidth(true);

            /* Setup Transition */
            count = container.children(options.item).length;

            /* Animation */
            if (options.transition == "fade") {

                if (index >= count) {
                    index = 0;
                }
                container.children().fadeOut().find('.inner').hide();
                current.fadeIn(800).find('.inner').delay(1200).fadeIn();

            } else if (options.transition == "slide") {
                if (index >= count) {
                    index = index - 1;
                    container.animate({ left: '-=50' }, 200).animate({ left: '+=50' }, 200, "easeOutBack");
                } else if (index < 0) {
                    index = 0;
                    container.animate({ left: '+=50' }, 200).animate({ left: '-=50' }, 200, "easeOutBack");
                }
                else {
                    if (index > currentIndex) {
                        container.animate({ left: '-' + item_width * index }, 500, function () { /* Animation complete */ });
                        if (options.end == "bounce") {
                            container.animate({ left: '-=20' }, 100).animate({ left: '+=20' }, 200);
                        }
                    } else {
                        container.animate({ left: '-' + item_width * index }, 500, function () { /* Animation complete */ });
                        if (options.end == "bounce") {
                            container.animate({ left: '+=20' }, 100).animate({ left: '-=20' }, 200);
                        }
                    }
                }
            }

            container.children('li').removeClass('active');
            current.addClass('active');

            navigation.find('li').removeClass('active');
            index++;
            navigation.find('a[rel^=' + index + ']').parent().addClass('active');
        }
    };

    $.fn.vidraSlider = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }

    };


})(jQuery);
