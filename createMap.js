function draw_india_map(options) {
    
    const width = 430, height = 480;

    var colorScale = {
        'Other': '#95a5a6',
        "BJP": "#e67e22",
        "Congress": "#27ae60"
    }

    //Generate the svg container by targeting the html container
    const svg = d3.select(options["htmlcontainer"])
        .append("svg")
        .attr("class", "indiamap")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin")
        .append("g")
    
    // Add a tooltip to visualization
    const tooltip = d3.select(options["htmlcontainer"]).append('div')
        .attr('class', 'hidden tooltipblock')
        
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
            .attr('fill', function(d){
                var fd = _.filter(data, function(obj){
                    return obj.vhcode === d.properties.ST_VC;
                })

                if(fd[0] !== undefined){
                    return colorScale[fd[0]["Coalition"]]
                }else{
                    return "#F0F2EF"
                }
            })
            .attr('stroke', "#636363")
            .attr('stroke-width', "0.5")
            .attr('stroke-opacity', "0.5")
            .on('click', function(d,i){
                
                console.log(d.properties.ST_VC)
                var fd = _.filter(data, function(obj){
                    return obj.vhcode === d.properties.ST_VC;
                })
                console.log("fd", fd[0])

                var html;

                if(fd[0] !== undefined){

                    html = '<div class="modal-content">'
                    html += '<p class="title">State</p>'
                    html += '<p class="stateName">'+fd[0]['State']+'</p>'
                    // html += '<p class="title">Description</p>'
                    // html += '<p class="desc">'+fd[0]['Desc']+'</p>'
                    html += '<p class="title">Ruling Party</p>'
                    html += '<p class="rulingParty">'+fd[0]['Ruling Party']+'</p>'
                    html += '<p class="title">NRC</p>'
                    html += '<p class="ncropinion">'+fd[0]['NRC']+'</p>'
                    html += '<p class="title">NPR</p>'
                    html += '<p class="npropinion">'+fd[0]['NPR']+'</p>'
                    html += '<p class="title">CAA</p>'
                    html += '<p class="caaopinion">'+fd[0]['CAA']+'</p>'
                    html += '<div>'
                    
                }else{
                    html = '<div class="modal-content">'
                    html += '<p class="title">State</p>'
                    html += '<p class="stateName">'+d.properties.ST_NM+'</p>'
                    html += '<p>No Data Available</p>'
                    html += '<div>'
                }

                d3.select(".info").html(html)
            })

    })

}