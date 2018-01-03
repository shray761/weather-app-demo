function init() {
	var mapIndex = 0;
	document.getElementById("submit").addEventListener("click", function(e) {
		e.preventDefault();
        error("");
		var searchDom = document.getElementById("search");
		var search = searchDom.value;
        if (search.length < 1) {
            error("Please enter city name.");
            return;
        }
		var _this = this;
		this.disabled = true;
		searchDom.disabled = true;
		$.ajax({
			type: "GET",
			url: "http://api.openweathermap.org/data/2.5/forecast",
			data: {
				appid: "41759783c8ef8257cd229fff2283fe50",
				q: search + ",us",
				units: "metric"
			},
			success: function (response) {
				if (response.cod === "200") {
                    var points = [];
                    var total = 0;
                    for (var pointIndex in response.list) {
                        total += parseFloat(response.list[pointIndex].main.temp);
                        points.push({y: response.list[pointIndex].main.temp});
                    }
                    var averageTemp = (total / response.list.length).toFixed(2);
                    $("#con-table").append('<tr>\
                        <td><div id="map-'+mapIndex+'" class="map"></div></td>\
                        <td>\
                            <div class="graph" id="graph-'+mapIndex+'"></div>\
                            <div class="avg-temp">'+averageTemp+' deg C</div>\
                        </td>\
                        </tr>');
					initializeMap(response.city.coord.lat, response.city.coord.lon, document.getElementById("map-" + mapIndex));
                    initalizeGraph(points, "#graph-"+mapIndex);
                    ++mapIndex;
				} else {
					console.log(err);
					error("Something went wrong!");
				}
			},
			error: function (err) {
				try {
					error("Error: " + err.responseJSON.message);
				} catch (ex) {
					console.log(err);
					error("Something went wrong!");
				}
			},
			complete: function () {
				_this.disabled = false;
				searchDom.disabled = false;
			}
		});
	});
}

$(document).ready(function() {
	init();
});

function initializeMap(lat, lon, dom) {
   	var latlng = new google.maps.LatLng(lat, lon);
    var map = new google.maps.Map(dom, {
      center: latlng,
      zoom: 5
    });
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      draggable: false,
      anchorPoint: new google.maps.Point(0, -29)
   });
}

function initalizeGraph(points, id) {
    var options = {
        animationEnabled: true,
        data: [
            {
                type: "line",
                dataPoints: points
            }
        ]
    };
    $(id).CanvasJSChart(options);
}

function error(errorMsg) {
    document.getElementsByClassName('error')[0].innerHTML = errorMsg;
}