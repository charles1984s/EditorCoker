﻿var $btn_display, $bind_type, title, $title_text, $description, $description_text
var keyId, disp_opt = true
var directory_list;

function PageReady() {
    co.Directory = {
        AddUp: function (data) {
            return $.ajax({
                url: "/api/Directory/AddUp",
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                headers: _c.Data.Header,
                data: JSON.stringify(data),
                dataType: "json"
            });
        },
        Get: function (Id) {
            return $.ajax({
                url: "/api/Directory/GetDataOne/",
                type: "GET",
                contentType: 'application/json; charset=utf-8',
                headers: _c.Data.Header,
                data: { Id: Id },
            });
        },
        Delete: function (Id) {
            return $.ajax({
                url: "/api/Directory/Delete/",
                type: "GET",
                contentType: 'application/json; charset=utf-8',
                headers: _c.Data.Header,
                data: { Id: Id },
            });
        }
    };

    ElementInit();
    TagListModalInit();

    const forms = $('#DirectorytForm');
    (() => {
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                } else {
                    event.preventDefault();
                    Coker.sweet.confirm("即將儲存", "儲存後將顯示於安排的位置", "儲存", "取消", function () {
                        AddUp("已成功儲存", "儲存發生未知錯誤");
                    });
                }
                form.classList.add('was-validated')
            }, false)
        })
    })()

    $(".btn_back").on("click", function () {
        Coker.sweet.confirm("返回目錄列表", "資料將不被保存", "確定", "取消", function () {
            directory_list.component.refresh();
            BackToList();
        });
    })

    $(".btn_add").on("click", function () {
        FormDataClear();
        window.location.hash = 0;
        HashDataEdit();
    });

    $btn_display.on("click", function () {
        if (disp_opt) {
            $btn_display.children("span").text("visibility_off");
            disp_opt = !disp_opt;
        } else {
            $btn_display.children("span").text("visibility");
            disp_opt = !disp_opt;
        }
    })

    $title_text.on('keyup', function () {
        var $self = $(this);
        $title.children("div").children(".count").text($self.val().length)
    });

    $description_text.on('keyup', function () {
        var $self = $(this);
        $description.children("div").children(".count").text($self.val().length)
    });

    if ("onhashchange" in window) {
        window.onhashchange = hashChange;
    } else {
        setInterval(hashChange, 1000);
    }
}

function ElementInit() {
    $btn_display = $(".btn_display");
    $bind_type = $("#BindType");
    $title = $(".title");
    $title_text = $title.children("textarea");
    $description = $(".description");
    $description_text = $description.children("textarea");
}


function hashChange(e) {
    if (!!e) {
        HashDataEdit();
        e.preventDefault();
    } else {
        console.log("HashChange錯誤")
    }
}

function HashDataEdit() {
    if (window.location.hash != "") {
        if (window.currentHash != window.location.hash) {
            var hash = window.location.hash.replace("#", "");
            if (parseInt(hash) == 0) {
                window.location.hash = 0;
                keyId = 0;
                FormDataClear();
                MoveToContent();
            } else {
                MoveToContent();
                co.Directory.Get(parseInt(hash)).done(function (result) {
                    if (result != null) {
                        MoveToContent();
                        FormDataSet(result);
                    } else {
                        window.location.hash = ""
                        keyId = "";
                    }
                })
            }
        }
    } else {
        BackToList();
    }
}

function contentReady(e) {
    directory_list = e;
    HashDataEdit();
}

function editButtonClicked(e) {
    MoveToContent();
    keyId = e.row.key;
    window.location.hash = keyId;
}

function deleteButtonClicked(e) {
    Coker.sweet.confirm("刪除資料", "刪除後不可返回", "確定刪除", "取消", function () {
        co.Directory.Delete(e.row.key).done(function (result) {
            if (result.success) {
                e.component.refresh();
            }
        });
        e.component.refresh();
    });
}

function FormDataClear() {
    TagDataClear();
    keyId = 0;
    $btn_display.children("span").text("visibility");
    $bind_type.val(0);
    $title_text.val("");
    $description_text.val("");
}

function FormDataSet(result) {
    FormDataClear();
    keyId = result.id;
    disp_opt = result.visible;
    if (disp_opt) {
        $btn_display.children("span").text("visibility");
    } else {
        $btn_display.children("span").text("visibility_off");
    }
    $bind_type.val(result.type);
    $title_text.val(result.title);
    $description_text.val(result.description);
    TagDataSet(result.tagDatas);
}

function AddUp(success_text, error_text) {
    co.Directory.AddUp({
        Id: keyId,
        Title: $title_text.val(),
        Description: $description_text.val(),
        Type: parseInt($bind_type.val()),
        Visible: disp_opt,
        TagSelected: tag_list
    }).done(function () {
        Coker.sweet.success(success_text, null, true);
        directory_list.component.refresh();
        BackToList();
    }).fail(function () {
        Coker.sweet.error("錯誤", error_text, null, true);
    });
}

function MoveToContent() {
    $("#DirectorytForm").removeClass("was-validated");
    if (keyId == 0) {
        $(".btn_to_canvas").addClass("text-dark");
        $(".btn_to_canvas").attr('disabled', '');
    } else {
        $(".btn_to_canvas").removeClass("text-dark");
        $(".btn_to_canvas").removeAttr('disabled');
    }
    $("#DirectoryList").addClass("d-none");
    $("#DirectoryContent").removeClass("d-none");
    $("#DirectoryCanvas").addClass("d-none");
}

function BackToList() {
    $("#TopLine > a").addClass("d-none");
    $("#DirectoryList").removeClass("d-none");
    $("#DirectoryContent").addClass("d-none");
    $("#DirectoryCanvas").addClass("d-none");
    window.location.hash = ""
}