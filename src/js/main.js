// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-leaflet-map");

var $ = require("./lib/qsa");

var mapElement = $.one("leaflet-map");
var map = mapElement.map;
var L = mapElement.leaflet;

var markerLayer = new L.FeatureGroup();

window.cityData.forEach(function(row){
  var marker = new L.Marker([row.Lat,-row.Long], {
    title: row.City,

    riseOnHover: true,
    autoPan: true,
    bubblingMouseEvents: true,
    icon: L.divIcon({
      className: "city-marker"
    })
  });

marker.data = row;
row.marker = marker;


  marker.bindPopup(`
<h1 style="color:orange;",style="font-size:200%;"">${row.City}</h1>
<ul style="color:black;">
  <li> Overall job growth (last 10 years): <b>${row.j_g_p}</b>
  <li> Job Growth in Tech Sector (last 5 years): <b>${row.t_g_p}</b>
  <li> Offered tax incentives: <b>${row.tax_in}</b>
  <li> Traffic congestion: <b>${row.Traffic}</b>
  <li> Airport(s) that meet requirements: <b>${row.Airport_Name}</b>
</ul>
  `);
  marker.addTo(markerLayer);

});

markerLayer.addTo(map);
//map.fitBounds(markerLayer.getBounds());
map.fitBounds([[50.792,-129.7],[18.64,-62.66]]);

var blocks = $(".map-item").reverse();
var filters = {
  j_growth: d=>d.j_growth > .05,
  t_growth: d=>d.tech_growth > .06 && d.j_growth > .05,
  rent: d=>d.rent < 1150,
  airports: d=>d.Airport > 0,
  traffic: d=> d.Traffic > 10,
  incentives: d=>d.t_in_num > 0,
  all: d=>true,

}

window.addEventListener("scroll",function(e){

for(var i = 0; i < blocks.length; i++){
  var el = blocks[i];
  var bounds = el.getBoundingClientRect();
  if(bounds.top > 0 && bounds.top < window.innerHeight*.8){
    var filtername = el.getAttribute("data-filter");
    if(!filtername) return;
    var filter = filters[filtername];
    var matches = window.cityData.filter(filter);
    window.cityData.forEach(d => d.marker.getElement().classList.remove("highlight"));
    matches.forEach(d=> d.marker.getElement().classList.add("highlight"));
    //console.log(matches);
    break;
  }

}

});

// map.on("click", e => console.log(e.latlng));
