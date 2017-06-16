var d3 = require("d3");
/*------------tooltip------------------*/
var tooltip = d3.select("body").append("div").style("position", "absolute").style("z-index", "10")
.style("visibility", "hidden")
.style("color", "white")
.style("padding", "8px")
.style("background-color", "rgba(0, 0, 0, 0.75)")
.style("border-radius", "6px")
.style("font-size", "20px")
.text("tooltip");

/*------------Build dropdown Menu------------------*/
var xSelect = document.getElementById("xSelectNumber");
var ySelect = document.getElementById("ySelectNumber");

var options = ["P. Min Mass (EU)", "P. Mass (EU)", "P. Gravity (EU)", "P. Esc Vel (EU)", "P. SFlux Min (EU)", "P. SFlux Mean (EU)", "P. SFlux Max (EU)","P. Teq Min (K)", "P. Teq Mean (K)", "P. Teq Max (K)", "P. Ts Min (K)", "P. Ts Mean (K)", "P. Ts Max (K)", "P. Surf Press (EU)", "P. Mag","P. Radius (EU)", "P. Appar Size (deg)", "P. Period (days)", "P. Sem Major Axis (AU)", "P. Eccentricity", "P. Mean Distance (AU)", "P. Inclination (deg)", "P. Omega (deg)", "S. Mass (SU)", "S. Radius (SU)", "S. Teff (K)", "S. Luminosity (SU)", "S. [Fe/H]", "S. Age (Gyrs)", "S. Appar Mag", "S. Distance (pc)", "S. RA (hrs)", "S. DEC (deg)", "S. Mag from Planet", "S. Size from Planet (deg)", "S. No. Planets", "S. No. Planets HZ", "S. Hab Zone Min (AU)", "S. Hab Zone Max (AU)", "P. HZD", "P. HZC", "P. HZA", "P. HZI", "P. SPH", "P. Int ESI", "P. Surf ESI", "P. ESI", "S. HabCat", "P. Habitable", "P. Hab Moon", "P. Confirmed", "P. Disc. Year"];

for (var i = 0; i < options.length; i++) {
    var opt = options[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    var el2 = document.createElement("option");
    el2.textContent = opt;
    el2.value = opt;
    xSelect.appendChild(el);
    ySelect.appendChild(el2);
}

var xMax,xMin,yMax,yMin;
/*------------load with two features pre-selected------------------*/
var xAtt = "P. Min Mass (EU)",
yAtt = "P. Min Mass (EU)";


/*------------load data------------------*/
d3.csv("data/phl_hec_all_confirmed.csv", function(data) {
       data.forEach(function(d) {
                    for (var i = 0; i < options.length; i++) {
                    d[options[i]] = +d[options[i]];
                    }
                    });
       
       /*------------Populate Scatter Plot and Distribution------------------*/
       creatScatterPlot();
       creatDistrubution(xAtt, ".xDistribution");
       creatDistrubution(yAtt, ".yDistribution");
       
       /*------------Create new chart when user switch the features------------------*/
       $('#xSelectNumber').on('change', function() {
                              xAtt = this.value;
                              d3.selectAll("svg").remove();
                              creatScatterPlot();
                              creatDistrubution(xAtt, ".xDistribution");
                              creatDistrubution(yAtt, ".yDistribution");
                              })
       $('#ySelectNumber').on('change', function() {
                              yAtt = this.value;
                              d3.selectAll("svg").remove();
                              creatScatterPlot();
                              creatDistrubution(xAtt, ".xDistribution");
                              creatDistrubution(yAtt, ".yDistribution");
                              })
       
       /*------------Build Distrubition Chart------------------*/
       function creatDistrubution(option, div) {
       var max,min;
       if(div == ".xDistribution"){
       max = xMax;
       min = xMin;
       }else if(div == ".yDistribution"){
       max = yMax;
       min = yMin;
       }
       
       /*------------set dimensions of the chart------------------*/
       var margin = {
       top: 10,
       right: 40,
       bottom: 50,
       left: 50
       },
       width = 500 - margin.left - margin.right,
       height = 160 - margin.top - margin.bottom;
       
       
       var x = d3.scaleLinear()
       .domain([min, max])
       .rangeRound([0, width])
       
       var y = d3.scaleLinear()
       .range([height, 0]);
       
       var svg = d3.select(div).append("svg")
       .attr("class", "div")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform",
             "translate(" + margin.left + "," + margin.top + ")");
       
       /*------------set up histogram bins------------------*/
       var histogram = d3.histogram()
       .value(function(d) {
              return d[option];
              })
       .domain([min, max])
       .thresholds(x.ticks(30));
       var bins = histogram(data);
       
       /*------------Scale the y axis------------------*/
       y.domain([0, d3.max(bins, function(d) {
                           return d.length;
                           })]);
       
       /*------------Append the bars------------------*/
       svg.selectAll("rect")
       .data(bins)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("x", 1)
       .attr("transform", function(d) {
             return "translate(" + x(d.x0) + "," + y(d.length) + ")";
             })
       .attr("width", function(d) {
             return x(d.x1) - x(d.x0) - 1;
             })
       .attr("height", function(d) {
             return height - y(d.length);
             })
       .style("fill", "#47b5e0")
       .on("mouseover", function(d) {
           tooltip.text(d.length);
           tooltip.style("visibility", "visible");
           })
       .on("mousemove", function() {
           return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
           })
       .on("mouseout", function(d) {
           return tooltip.style("visibility", "hidden");
           });
       
       /*------------Append CDF Curve------------------*/
       var cdfCurve = d3.line()
       .x(function(d) {
          return x(d.x0)
          })
       .y(function(d) {
          return y(d.length)
          })
       .curve(d3.curveBasis);
       
       var line = svg.append('path')
       .datum(bins)
       .attr('d', cdfCurve)
       .attr('class', 'line');
       
       /*------------Append Axis------------------*/
       svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x)).selectAll("text")
       .attr("y", 0)
       .attr("x", 9)
       .attr("dy", ".35em")
       .attr("transform", "rotate(40)")
       .style("text-anchor", "start");
       
       svg.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(y))
       .append("text")
       .classed("label", true)
       .attr("transform", "rotate(-90)")
       .attr("y", -45)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("Counts");
       
       /*------------Append Title------------------*/
       svg.append("text")
       .attr("id", "mainTitle2")
       .attr("x", (width / 2))
       .attr("y", height + 45)
       .attr("text-anchor", "middle")
       .style("font-size", "10px")
       .style("fill", "#47b5e0")
       .text(option + " Distribution ");
       }
       
       /*------------Build Scatter Plot------------------*/
       function creatScatterPlot() {
       document.getElementById("panel-title").innerHTML = xAtt + " vs " + yAtt;
       
       /*------------set dimensions of the chart------------------*/
       var margin = {
       top: 20,
       right: 300,
       bottom: 50,
       left: 50
       },
       outerWidth = 1200,
       outerHeight = 400,
       width = outerWidth - margin.left - margin.right,
       height = outerHeight - margin.top - margin.bottom;
       
       /*------------set up the range of scale------------------*/
       var x = d3.scaleLinear()
       .range([0, width]).nice();
       
       var y = d3.scaleLinear()
       .range([height, 0]).nice();
       
       /*------------remove outlier of the data------------------*/
       var dataArray =[];
       var dataArray2 =[];
       
       data.forEach(function (d,i) {
                    dataArray[i] = d[xAtt];
                    dataArray2[i] = d[yAtt];
                    });
       
       var slicedData = outLier(dataArray);
       var slicedData2 = outLier(dataArray2);
       
       xMax = d3.max(slicedData),
       xMin = d3.min(slicedData),
       yMax = d3.max(slicedData2),
       yMin = d3.min(slicedData2);

       x.domain([xMin, xMax]);
       y.domain([yMin, yMax]);
       
       var xAxis = d3.axisBottom(x)
       .tickSize(-height);
       
       var yAxis = d3.axisLeft(y)
       .tickSize(-width);
       
       /*------------set up the color for points------------------*/
       var color = d3.scaleOrdinal().range(["#71c1f7","#dd55fc","#46f2d2","#2747f9","#0d8de2","#7be2f7","#d338f7","#00f7c9","#59def9","#09f9cd","#bd09f9","#00f7a0","#7f00f7","#1266ed","#02b8d8"]);
       var svg = d3.select(".map")
       .append("svg")
       .attr("width", outerWidth)
       .attr("height", outerHeight)
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       
       svg.append("g")
       .classed("x axis", true)
       .attr('id', "axis--x")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
       .append("text")
       .classed("label", true)
       .attr("x", width)
       .attr("y", margin.bottom - 10)
       .style("text-anchor", "end")
       .text(xAtt);
       
       svg.append("g")
       .classed("y axis", true)
       .attr('id', "axis--y")
       .call(yAxis)
       .append("text")
       .classed("label", true)
       .attr("transform", "rotate(-90)")
       .attr("y", -margin.left)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text(yAtt);
       
       var brush = d3.brush().extent([
                                      [0, 0],
                                      [width, height]
                                      ]).on("end", brushended),
       idleTimeout,
       idleDelay = 350;
       
       var scatterPlot = svg.append("svg")
       .attr("class", "scatterPlot")
       .attr("width", width)
       .attr("height", height);
       
       scatterPlot.append("svg:line")
       .attr("x1", 0)
       .attr("y1", 0)
       .attr("x2", width)
       .attr("y2", 0)
       .attr("transform", "translate(0," + height + ")");
       
       scatterPlot.append("svg:line")
       .attr("x1", 0)
       .attr("y1", 0)
       .attr("x2", 0)
       .attr("y2", height);
       
       /*------------append an area to capture all the mouse events------------------*/
       //In order to show the tooltip, this part need to be created before appending the points.
       scatterPlot.append("g")
       .attr("class", "brush")
       .call(brush);
       
       /*------------append points on the chart------------------*/
       var dots = scatterPlot.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("class", function(d) {
             return d[xAtt] + " " + d[yAtt];
             })
       .attr("r", 5)
       .attr("transform", transform)
       .attr("opacity", 0.5)
       .style("fill", function(d) {
              return color(d["P. Name"]);
              })
       .on("mouseover", function(d) {
           if (d["P. Composition Class"] == "") {
           d["P. Composition Class"] = "Undefined";
           }
           tooltip.html("<h4>" + d["P. Name"] + "</h4><h4>P. Zone：" + d["P. Zone Class"] +
                        "</h4><h4>P. Composition: " + d["P. Composition Class"] + "</h4>");
           tooltip.style("visibility", "visible");
           })
       .on("mousemove", function() {
           return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
           })
       .on("mouseout", function(d) {
           return tooltip.style("visibility", "hidden");
           });
       
       /*------------Set up brush and zoom features.------------------*/
       function brushended() {
       var s = d3.event.selection;
       if (!s) {
       if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
       x.domain(d3.extent(slicedData)).nice();
       y.domain(d3.extent(slicedData2)).nice();
       } else {
       x.domain([s[0][0], s[1][0]].map(x.invert, x));
       y.domain([s[1][1], s[0][1]].map(y.invert, y));
       scatterPlot.select(".brush").call(brush.move, null);
       }
       zoom();
       }
       
       function idled() {
       idleTimeout = null;
       }
       
       /*------------Zoom------------------*/
       function zoom() {
       var t = scatterPlot.transition().duration(750);
       svg.select("#axis--x").transition(t).call(xAxis);
       svg.select("#axis--y").transition(t).call(yAxis);
       scatterPlot.selectAll("circle").transition(t)
       .attr("transform", transform);
       }
       
       /*------------set up the the position of points------------------*/
       function transform(d) {
       return "translate(" + x(d[xAtt]) + "," + y(d[yAtt]) + ")";
       }
       
       /*------------remove outlier of the data------------------*/
       function outLier(dataArray){
       dataArray.sort(function(a,b){return a-b});
       
       var low = Math.round(dataArray.length * 0.025);
       var high = dataArray.length - low;
       
       return dataArray.slice(low,high);
       }
       
       }
       
       });
