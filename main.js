var meteorite_data_url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';
var world_url = 'https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json';
// var meteorites = [];

// canvas resolution
var width = window.innerWidth; // window.innerWidth,
    height = window.innerHeight; // window.innerHeight;

// projection-settings for mercator
var projection = d3.geo.mercator()
    .scale(200) // Zoom level

// defines "path" as return of geographic features
var path = d3.geo.path()
    .projection(projection);

// Define SVG
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// group the svg layers 
var g = svg.append("g");

// zoom
var zoom = d3.behavior.zoom()
    .on("zoom", function(){
      g.attr("transform","translate("+ d3.event.translate.join(",")+")scale("+d3.event.scale+")");
      // g.selectAll("path")  
        // .attr("d", path.projection(projection));
    });

d3.json(world_url, function(err, world) {

  if (err) {
    throw err;
  }

  var countries = topojson.feature(world, world.objects.countries).features;

  g.selectAll("path")
    .data(countries)
    .enter()
    .append("path")
      .attr({
        'fill': 'skyblue',
        'stroke': 'white',
        'd': path
      });

  // g.selectAll('path')
  //   .data(topojson.feature(data, data.objects.countries).features)
  //   .enter()
  //     .append('path')
  //     .attr('d', path);


  // console.log(data.features[0].geometry);

  // data.features.forEach(function(d) {

  //   if(d.properties.fall === 'Fell' && d.geometry) {
  //     var meteorite = {
  //       fall: d.properties.fall,
  //       mass: d.properties.mass,
  //       name: d.properties.name,
  //       nameType: d.properties.nameType,
  //       recclass: d.properties.recclass,
  //       reclat: d.properties.reclat,
  //       reclong: d.properties.reclong,
  //       year: d.properties.year,
  //       coordinates: d.geometry.coordinates,
  //     };

  //     meteorites.push(meteorite);
  //   }
  // });

});

svg.call(zoom);




