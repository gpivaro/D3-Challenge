
function makeResponsive() {


    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the SVG
    var svgArea = d3.select("#scatter").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    };

    // Get the text width size for sizing the SVG
    var element = d3.select('#textContent').node();
    var svgDivWidth = element.getBoundingClientRect().width;
    console.log(`SVG div widht = ${svgDivWidth}`);


    // svg container is variable with the browser window size
    var svgWidth = svgDivWidth;
    // Set the height to be 2/3 of the widht
    var svgHeigth = svgWidth * 2 / 3;

    // margins
    var margin = {
        left: 80,
        top: 30,
        right: 30,
        bottom: 80
    };

    // chart area minus margins
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeigth - margin.top - margin.bottom;

    // create svg container
    var svg = d3.select("#scatter").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeigth)

    // shift everything over by the margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // circle properties
    var circleRadius = 10;

    // Define the data columns for the plot
    var xColumn = "poverty";
    var yColumn = "healthcare"

    // Axis title offset for better location of the titles
    var xAxisLabelOffset = 20;
    var yAxisLabelOffset = 35;

    // Use d3 to import the data
    d3.csv("data/data.csv").then(function (data) {


        // Cast the data value to a number for each piece of data
        data.forEach(function (data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });

        // scale y to chart height with 10% over the max
        var yScale = d3.scaleLinear()
            .domain([3, 1.1 * d3.max(data, function (d) { return d[yColumn]; })])
            .range([chartHeight, 0])
            .nice();

        // scale x to chart width
        var xScale = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return d[xColumn]; }))
            .range([0, chartWidth])
            .nice();

        // create axes
        var xAxis = d3.axisBottom(xScale).tickSize(-chartHeight).ticks(6);
        var yAxis = d3.axisLeft(yScale).tickSize(-chartWidth).ticks(6);

        // set the x axis to the bottom of the chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .attr("class", "axis")
            .call(xAxis)

        // set the y axis
        chartGroup.append("g")
            .attr("class", "axis")
            .call(yAxis)

        // Append x-axis label
        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + xAxisLabelOffset})`)
            .attr("text-anchor", "middle")
            .classed("dow-text text", true)
            .text("In Poverty (%)");

        // Append y-axis label
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - yAxisLabelOffset)
            .attr("x", 0 - (chartHeight / 2))
            .attr("text-anchor", "middle")
            .classed("dow-text text", true)
            .text("Lacks Healthcare (%)");


        // Bind data to the circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[xColumn]))
            .attr("cy", d => yScale(d[yColumn]))
            .attr("r", circleRadius)
            .classed("stateCircle", true)

        // Exit data
        circlesGroup.exit().remove();

        //Add the SVG Text Element to the group
        var circlesLabel = chartGroup.selectAll("circles");

        //Add SVG Text Element Attributes
        circlesLabel
            .data(data)
            .enter()
            .append("text")
            .classed("stateText", true)
            .attr("text-anchor", "middle")
            .attr("x", d => xScale(d[xColumn]))
            .attr("y", d => yScale(d[yColumn]) + 3)
            .text(d => `${d.abbr}`)
            .attr("font-size", `${circleRadius}px`);


        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip") //toolTip doesn't have a "classed()" function like core d3 uses to add classes, so we use the attr() method.
            .offset([0, 95]) // (vertical, horizontal)
            .html(function (d) {
                return (`<strong>${(d.state)}</strong><br/>In Poverty ${(d.poverty)}%<br/>Lacks Healthcare ${d.healthcare}%`);
            });

        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function (d) {
            toolTip.show(d, this);
        })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function (d) {
                toolTip.hide(d);
            });



    }).catch(function (error) {
        console.log(error);
    });

};

// Call the function
makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);