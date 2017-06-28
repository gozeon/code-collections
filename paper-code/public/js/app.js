// init map
const map = new BMap.Map("map");
map.setMapStyle({ style: 'midnight' });
map.centerAndZoom(new BMap.Point(117.208666, 39.13621), 12);
map.enableScrollWheelZoom(true);

// common
function G(id) {
    return document.getElementById(id);
}
let startPoint;
let endPoint;
let startTitle;
let endTitle;

// input
// start
const acs = new BMap.Autocomplete( //建立一个自动完成的对象
    {
        "input": "inputStart",
        "location": map
    });

acs.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
    let str = "";
    let _value = e.fromitem.value;
    let value = "";
    if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
    if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    G("searchResultPanelStart").innerHTML = str;
});

acs.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
    let _value = e.item.value;
    startTitle = _value.province + _value.city + _value.district + _value.street + _value.business;
    G("searchResultPanelStart").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + startTitle;

    function myFun() {
        if (startPoint) {
            map.removeOverlay(BMap.Marker(startPoint));
        }
        startPoint = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        map.centerAndZoom(startPoint, 14);
        const marker = new BMap.Marker(startPoint)
        map.addOverlay(marker); //添加标注
        // marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
    }
    const local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(startTitle);
});

// end
const ace = new BMap.Autocomplete( //建立一个自动完成的对象
    {
        "input": "inputEnd",
        "location": map
    });

ace.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
    var str = "";
    var _value = e.fromitem.value;
    var value = "";
    if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

    if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    G("searchResultPanelEnd").innerHTML = str;
});

ace.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
    var _value = e.item.value;
    endTitle = _value.province + _value.city + _value.district + _value.street + _value.business;
    G("searchResultPanelEnd").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + endTitle;

    // setPlace(myValueEnd);
    function myFun() {
        if (endPoint) {
            map.removeOverlay(new BMap.Marker(endPoint));
        }
        endPoint = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        map.centerAndZoom(endPoint, 14);
        const marker = new BMap.Marker(endPoint)
        map.addOverlay(marker); //添加标注
        // marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
    }
    const local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(endTitle);
});