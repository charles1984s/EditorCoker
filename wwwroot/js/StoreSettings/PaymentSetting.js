function PageReady() {
    const formId = "StoreSet";
    console.log($(`#${formId}`));
    co.Form.set(formId, () => {
        console.log(co.Object.objectToArray(co.Form.getJson(formId, true)));
        /*co.StoreSet.SaveValues(co.Object.objectToArray(co.Form.getJson(formId, true))).done(function (result) {
            if (result.success) co.sweet.success("儲存成功");
            else co.sweet.error("儲存失敗", result.message);
        });*/
        return false;
    });
}