
// Use d3 to import the data
d3.csv("data/data.csv").then(function (data) {

    // console.log(data.columns);

    // Cast the data value to a number for each piece of data
    data.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;

    });

    // Insert a table
    d3.select("table")
        .selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .html(function (d) {
            return `<td>${d.abbr}</td>
            <td>${d["poverty"]}</td>
            <td>${d["age"]}</td>
            <td>${d["income"]}</td>
            <td>${d["healthcare"]}</td>
            <td>${d["obesity"]}</td>
            <td>${d["smokes"]}</td>`;
        });

}).catch(function (error) {
    console.log(error);
});