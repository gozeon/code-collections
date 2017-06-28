const oPoi = document.getElementById('poi');
let isHide = false;
oPoi.onclick = () => {
    if (isHide) {
        map.clearOverlays();
    } else {
        axios.get('http://127.0.0.1:3000/points')
            .then(response => {
                const results = response['data']['data'];
                for (let i = 0; i < results.length; i++) {
                    addInfoWindow(results[i]);
                }
            })
            .catch(error => {
                alert(error)
            })
    }
    isHide = !isHide;
    return false;
}

function addInfoWindow(obj) {
    const point = new BMap.Point(obj.point.lng, obj.point.lat);
    const marker = new BMap.Marker(point);
    map.addOverlay(marker);
    const opts = {
        width: 200, // 信息窗口宽度
        height: 120, // 信息窗口高度
        title: obj.title, // 信息窗口标题
    }

    const infoWindow = new BMap.InfoWindow(
        `地址：${obj.address}<br/>人气：${obj.popularity}/star<br/>平均游玩时间：${obj.averagePlayTime}/hour`, opts); // 创建信息窗口对象 
    marker.addEventListener("click", function() {
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    });
}