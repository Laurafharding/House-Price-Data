var width = document.getElementById('vis')
  .clientWidth;
var height = document.getElementById('vis')
  .clientHeight;

var padding = 100;

var margin = {
  top: 10,
  bottom: 70,
  left: 70,
  right: 20
};

var svg = d3.select('#vis')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var data = {};

var x_scale = d3.scaleBand()
  .rangeRound([0, width])
  .padding(0.1);

var y_scale = d3.scaleLinear()
  .range([height, 0]);

var colour_scale = d3.scaleQuantile()
  .range(["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);


d3.csv("CSVs/annual_data_with_scotland.csv", function(error, data) {

  data.forEach(function(d) {
    d.year = d.year;
    d.value = +d.value;
  });

  var t = d3.transition()
    .duration(2000);

  var annual_data_with_scotland = data;

  var max_value = d3.max(annual_data_with_scotland, function(d) {
    return +d.value;
  });

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");




  svg.append("text")
    .text("Average House Price, UK")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline");

  svg.append('g')
    .attr('class', 'y axis')
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");


  y_scale.domain([0, max_value]);
  colour_scale.domain([0, max_value]);

  var years = annual_data_with_scotland.map(function(d) {
    return d.year;
  });

  x_scale.domain(years);

  var bars = svg.selectAll('.bar')
    .data(annual_data_with_scotland);

  bars
    .exit()
    .remove();

  var new_bars = bars
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) {
      return x_scale(d.year);
    })
    .attr('width', x_scale.bandwidth())
    .attr('y', height)
    .attr('height', 0);

  new_bars.merge(bars)
    .transition(t)
    .attr('y', function(d) {
      return y_scale(+d.value);
    })
    .attr('height', function(d) {
      return height - y_scale(+d.value);
    })
    .attr('fill', function(d) {
      return colour_scale(+d.value);
    });

  svg.select('.x.axis')
    .call(x_axis);

  svg.select('.y.axis')
    .transition(t)
    .call(y_axis);

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (padding / -3) + "," + (height / 2) + ")rotate(-90)")
    .text("Price in Thousands of Pounds");

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (width / 2) + "," + (height - (padding / -3)) + ")")
    .text("Year");
});
