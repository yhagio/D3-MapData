var meteorite_data_url = 'https://data.nasa.gov/resource/y77d-th95.geojson';
var world_url = 'https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json';

// canvas resolution
var width = window.innerWidth,
    height = 600; // window.innerHeight;

// projection-settings for mercator
var projection = d3.geo.mercator()
    .translate([560, 370])
    .scale(200) // Zoom level

// defines "path" as return of geographic features
var path = d3.geo.path()
    .projection(projection);

// Define SVG
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// group the svg layers 
var g = svg.append("g");

// zoom
var zoom = d3.behavior.zoom()
    .on("zoom", function(){
      g.attr("transform",
        "translate("+ d3.event.translate.join(",")+")scale("+d3.event.scale+")");
    });

d3.json(world_url, function(err, world) {

  if (err) {
    throw err;
  }

  // World Map
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

  // Mapping dots of meteorites
  d3.json(meteorite_data_url, function(err, geodata) {

    // Filter data that has geometry object
    var filteredData = geodata.features.filter(function(data) {
      // console.log(data.geometry);
      return data.geometry !== null && data.properties !== null;
    });

    // Scale of meteorite impact (mass)
    // * Max value is far large, so divide it by 3
    var maxMass = d3.max(filteredData, function(d) {
      return parseInt(d.properties.mass);
    });

    var massScale = d3.scale.linear()
      .domain([0, maxMass / 3])
      .range([1.5, 30]);

    var max = 0;
    
    // Add circle
    g.selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr({
        cx: function(d) {
          return projection(d.geometry.coordinates)[0];
        },
        cy: function(d) {
          return projection(d.geometry.coordinates)[1];
        },
        r: function(d) {
          var massData = d.properties.mass > (maxMass / 3) ? (maxMass / 3) : d.properties.mass;
          return massScale(massData);
        },
        fill: 'rgba(200, 10, 10, 0.5)'
      })
      .on('mouseover', function(d) {

        d3.select('#tooltip')
          .transition()
          .ease('quad')
          .duration(100)
          .style("opacity", 1);

        d3.select('#tooltip')
          .style("left", getXPositionOnHover(d3.event.pageX) + "px")
          .style("top", getYPositionOnHover(d3.event.pageY) + "px")
          .select("#value")
            .html(
              '<p>Year: '+new Date(d.properties.year).toDateString()+'</p>'+
              '<p>Name: '+d.properties.name+'</p>'+
              '<p>NameType: '+d.properties.nametype+'</p>'+
              '<p>Mass: '+d.properties.mass+'</p>'+
              '<p>Recclass: '+d.properties.recclass+'</p>'+
              '<p>Reclat: '+d.properties.reclat+'</p>');
      })
      .on('mouseout', function() {
        d3.select('#tooltip')
          .transition()
          .ease('quad')
          .duration(100)
          .style("opacity", 0);
      });

  });

});

// Make the map zoomable
svg.call(zoom);

// Adjust or get the mouseover position of X
function getXPositionOnHover(x) {
  if (x > 950) {
    return x - 170;
  }
  return x + 15;
}

// Adjust or get the mouseover position of Y
function getYPositionOnHover(y) {
  if (y > 500) {
    return x - 200;
  }
  return y + 15;
}


