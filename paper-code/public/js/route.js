const oBtn = document.getElementById('btn');
const oPrompt = document.getElementById('prompt');
const oHourInput = document.getElementById('hour');

oBtn.onclick = () => {
    if (!startPoint || !endPoint || oHourInput.value === '' || oHourInput.value == 0) {
        oPrompt.style.display = 'block';
        oPrompt.className = 'animated bounceInRight';
        setTimeout(() => {
            oPrompt.className = 'animated bounceOutRight'
        }, 1800)
    } else {
        const hour = Number(oHourInput.value);
        axios.get('http://127.0.0.1:3000/route', {
                params: {
                    time: hour,
                    start: startTitle,
                    end: endTitle
                }
            })
            .then(response => {
                let waypoints = response.data.waypoints;
                if (startPoint.lng < endPoint.lng) {
                    waypoints = waypoints.sort(function(a, b) {
                        return a.lng - b.lng;
                    });
                } else {
                    waypoints = waypoints.sort(function(a, b) {
                        return b.lng - a.lng;
                    });
                }
                let way = waypoints.map(item => {
                    return new BMap.Point(item.lng, item.lat);
                })
                showResult(way);
            })
            .catch(error => {
                alert(error)
            });
    }
    return false;
}

function showResult(waypoints) {
    const start = new BMap.Point(startPoint.lng, startPoint.lat);
    const end = new BMap.Point(endPoint.lng, endPoint.lat);
    const driving = new BMap.DrivingRoute(map, {
        renderOptions: {
            map: map,
            autoViewport: true,
            panel: "route-result"
        }
    });
    driving.search(start, end, {
        waypoints: waypoints
    });
}