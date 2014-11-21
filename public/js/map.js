var socket = io();

var width = 640;
var height = 333;
var projection = d3.geo.albers()
  .scale(713)
  .translate([width / 2, height / 2])

var path = d3.geo.path().projection(projection);

var svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("background-color", '#ccc')

queue()
  .defer(d3.json, "data/dma.json")
  .defer(d3.csv, "data/dma.csv")
  .await(function (error, dmaMap, dmaData) {
    dmaData.forEach(function(d, i) {
      // console.log(d);
    });

    svg.append("g")
      .attr("class", "world")
      .selectAll("path")
      .data(topojson.feature(dmaMap, dmaMap.objects.nielsen_dma).features)
      .enter()
      .append("path")
      .attr("class", "dma")
      .attr("id", function(d) { return d.id; })
      .attr("d", path);

    socket.on('event', function (data) {
      console.dir('SOCKET EVENT');
      var res = data.split(':');

      var dmaCode = res[0];
      var dmaName = res[1];
      var device = res[2];
      var browser = res[3];

      console.dir(device);

      $('#' + dmaCode).attr("class", "dma-highlight");
      setTimeout(function() {
        $('#' + dmaCode).attr("class", "dma");
      }, 1000);

      var $tbody = $('#events').find('tbody');

      if ($tbody.children('tr').length > 5) {
        $tbody.children().last().remove();
      }

      $tbody.prepend($('<tr>')
          .append($('<td>')
            .append(dmaName)
          )
          .append($('<td>')
            .append(dmaCode)
          )
          .append($('<td>')
            .append(device)
          )
          .append($('<td>')
            .append(browser)
          )
        );
    });
  });
