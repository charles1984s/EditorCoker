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
        $self.getJson = function () {
            const json = "";
            return json;
        };
        $self.set = function (json) {
            $conten.each(function () {
                const $self = $(this);
                switch ($self.data("key")) {
                    case "main":
                        $self.find(".title textarea").text(json.title);
                        $self.find(".no input").val(json.no);
                        json.LogoImage.File = null;
                        ImageSetData($self.find(".image_upload"), json.LogoImage);
                        break;
                    case "mainManu":
                        const timmer = setInterval(function () {
                            const component = $self.find(".dx-widget").data("component");
                            if (!!component) {
                                $self.find(".dx-widget").data("component").option("dataSource", json.mainManu);
                                clearInterval(timmer);
                            }
                        }, 100);
                        break;
                    default:
                        if (!!json[$self.data("key")]) {
                            var con = json[$self.data("key")]
                            if (!!con.Conten && con.Conten.length > 0) {
                                const $ele = $self.find(".add-items");
                                if ($ele.length > 0) {
                                    $(con.Conten).each(function () {
                                        $ele.data("palameter", { text: this });
                                        $ele.trigger("click");
                                        $ele.removeData("palameter");
                                    });
                                } else if (con.Conten.length == 1) {
                                    $self.find(".conten textarea").text(con.Conten[0]);
                                }
                            }
                            if (!!con.More) {
                                $self.find(`[name="title"]`).val(con.More.Title);
                                $self.find(`[name="link"]`).val(con.More.Link);
                                $self.find(`[name="target"]`).prop("checked", con.More.Target == 1);
                                $self.find(`[name="alert"]`).val(con.More.Alert);
                            }
                            if (!!con.List && $self.find(".dx-widget").length>0) {
                                const timmer = setInterval(function () {
                                    const component = $self.find(".dx-widget").data("component");
                                    if (!!component) {
                                        $self.find(".dx-widget").data("component").option("dataSource", con.List);
                                        clearInterval(timmer);
                                    }
                                }, 100);
                            }
                            if (!!con.mainTitle)
                                $self.find(".title textarea").text(con.mainTitle);
                            if (!!con.mainTitle)
                                $self.find(".subTitle textarea").text(con.Title);
                            if (!!con.Line) {
                                $self.find(`.line [name="link"]`).val(con.Line.Link);
                                $self.find(`.line [name="alert"]`).val(con.Line.Alert);
                            } if (!!con.Home) {
                                $self.find(`.home [name="link"]`).val(con.Home.Link);
                                $self.find(`.home [name="alert"]`).val(con.Home.Alert);
                            }
                            if (!!con.img)
                                ImageSetData($self.find(".image_upload:not(.ico)"), con.img);
                            if (!!con.icon)
                                ImageSetData($self.find(".image_upload.ico"), con.icon);
                        }
                        break;
                }
            });
        };
        return $self;
    }
});