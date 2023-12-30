'use strict';
$.fn.extend({
    CokerMultiStepForm: function (options) {
        const $self = this;
        const defaults = {
            activeIndex: 0,
            activeClass:"active",
            validate: {},
            hideBackButton: false,
            allowUnvalidatedStep: false,
            allowClickNavigation: false,
            btn: {
                next: $self.find(`.msf-nav-button[data-type="next"]`),
                back: $self.find(`.msf-nav-button[data-type="back"]`),
                submit: $self.find(`.msf-nav-button[data-type="submit"]`)
            },
            save:null
        };
        const settings = $.extend({}, defaults, options);
        const $header = $self.find(".msf-header .msf-step");
        const $conten = $self.find(".msf-content .msf-view");
        const changeView = function () {
            $header.removeClass(settings.activeClass).eq(settings.activeIndex).addClass(settings.activeClass);
            $conten.removeClass(settings.activeClass).eq(settings.activeIndex).addClass(settings.activeClass);
            if (settings.activeIndex == 0) {
                settings.btn.back.addClass("d-none");
                settings.btn.next.removeClass("d-none");
                settings.btn.submit.addClass("d-none");
            } else if (settings.activeIndex == $header.length - 1) {
                settings.btn.back.removeClass("d-none");
                settings.btn.next.addClass("d-none");
                settings.btn.submit.removeClass("d-none");
            } else {
                settings.btn.back.removeClass("d-none");
                settings.btn.next.removeClass("d-none");
                settings.btn.submit.addClass("d-none");
            }
        }
        settings.btn.next.on("click", function () {
            settings.activeIndex++;
            if (settings.activeIndex > $header.length - 1) settings.activeIndex = $header.length - 1;
            changeView();
        });
        settings.btn.back.on("click", function () {
            settings.activeIndex--;
            if (settings.activeIndex < 0) settings.activeIndex = 0;
            changeView();
        });
        changeView();
        $self.on("coker-msf:viewChanged", function (event, data) {
            var progress = Math.round((data.completedSteps / data.totalSteps) * 100);
            $(".progress-bar").css("width", progress + "%").attr('aria-valuenow', progress);
        });
    }
});