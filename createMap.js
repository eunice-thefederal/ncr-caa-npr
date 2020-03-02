function draw_india_map(options) {
    
    const width = 430, height = 480;

    //Generate the svg container by targeting the html container
    const svg = d3.select(options["htmlcontainer"])
        .append("svg")
        .attr("class", "indiamap")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin")
        .append("g")
    
    // Add a tooltip to visualization
    // const tooltip = d3.select(options["htmlcontainer"]).append('div')
    //     .attr('class', 'hidden tooltipblock')
    //     .html("<p><")
        
    //Enter latlong, scale info of chosenstate
    const projection = d3.geoMercator()
        .scale(800)
        .center([83, 22.8])
        .translate([width / 2, height / 2])

    const geoPath = d3.geoPath()
        .projection(projection)

    d3.json(options.map, function(error, mapshape) {
        let allIndiaShape = topojson.feature(mapshape, mapshape.objects.collection).features;
        console.log("allIndiaShape", allIndiaShape);

        //draw and enter map based on mapshape data
        svg.selectAll(".state")
            .data(allIndiaShape).enter().append("path")
            .attr("d", geoPath)
            .attr("class", function(d) {
                return "state " + d.properties.ST_VC.toLowerCase();
            })
            .attr('fill', "#F0F2EF")
            .attr('stroke', "#636363")
            .attr('stroke-width', "0.5")
            .attr('stroke-opacity', "0.5")
            .on('click', function(d,i){
                d3.select(".tooltipblock").html(d.properties.ST_VC.toLowerCase())
            })

    })

}