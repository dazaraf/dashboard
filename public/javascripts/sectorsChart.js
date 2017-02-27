app.directive("bar", function(){
    
    function link(scope,el,attr){
        
        var margin = {top: 20, right: 20, bottom: 30, left: 60},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;  
        
        // set the ranges
        var x = d3.scaleBand()
                  .range([0, width])
                  .padding(0.1);
        var y = d3.scaleLinear()
                  .range([height, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

         var bar = svg.selectAll("rect");
             // get the data
     
       scope.$watch('data', function(data){
        
        if(!data){ return; }

        
        svg.selectAll('*').remove();

         var bar = svg.selectAll("rect");
             // get the data
        // format the data
        data.forEach(function(d) {
          d.exposure = +d.exposure;
        });
        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.sector; }));
        y.domain(d3.extent(data, function(d) { return d.exposure; }))
        
         bar =  bar.data(data)
         bar.exit().remove()
         bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.sector); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(Math.max(0,d.exposure)); })
        .attr("height", function(d) { return Math.abs(y(d.exposure) - y(0)); })
        .attr("class", function(d) {return d.exposure < 0 ? "negative" : "positive" });

        
        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);
        
        svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

      // add the y Axis
        svg.append("g")
        .call(yAxis);
        
        
        
        },true);
    }
    
    
    return {
        link: link,
        restrict: 'E',
        scope: {data: "="}
      };
});
