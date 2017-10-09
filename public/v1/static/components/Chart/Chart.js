// Chart
function Chart(target, label, dataset, width, height) {
    this.dataset = dataset || null;
    this.width = width;
    this.height = height;
    this.svg = d3.select(target);
    this.path = null;
    this.textLabel = label;
    this.total = {
        value: 0,
        text: null
    };
}
Chart.prototype = {
    init: function () {
        this.svg = this.svg.insert('svg', ':first-child')
            .attr('width', this.width)
            .attr('height', this.height);
    }
}

// Chart Arc
function ChartArc(target, label, dataset, width, height, thickness, cornerRadius) {
    Chart.call(this, target, label, dataset, width, height);
    this.pie = d3.pie();
    this.arc = d3.arc();
    this.radius = Math.min(this.width, this.height) / 2;
    this.thickness = thickness;
    this.cornerRadius = cornerRadius;

    this.init();
    this.initArc();
}
ChartArc.prototype = Object.create(Chart.prototype);
ChartArc.prototype.initArc = function(){
    var self = this;
    
    this.svg = this.svg.attr('class', 'chart--arc--svg')
            .append('g')
            .attr('transform', 'translate(' + (this.width / 2) +
                ',' + (this.height / 2) + ')');
    
    this.arc = this.arc
        .innerRadius(this.radius - this.thickness)
        .cornerRadius(this.cornerRadius)
        .outerRadius(this.radius);
    
    this.pie = this.pie.value(function (d) {
        return d.value;
    }).sort(null);
    
    this.path = this.svg.selectAll('path').data(this.pie(this.dataset))
        .enter()
        .append('path')
        .attr('d', this.arc)
        .attr('class', function (d, i) {
            self.total.value += d.data.value;
            return d.data.colorClass;
        });
    
    this.total.text = this.svg.append('text')
        .text(function(){
            var label = (!!self.textLabel) ? self.textLabel : '';
            return label;
        })
        .attr('class', 'chart--total')
        .attr('dx', 4)
        .attr('y', 8)
        .append('tspan')
        .attr('class', 'chart--total--percentage')
        .attr('dx', 2)
        .attr('dy', -4)
        .text('%');
        
};
ChartArc.prototype.constructor = ChartArc;

// Chart Donut
function ChartDonut(target, label, dataset, width, height, thickness) {
    Chart.call(this, target, label, dataset, width, height);
    this.pie = d3.pie();
    this.arc = d3.arc();
    this.radius = Math.min(this.width, this.height) / 2;
    this.thickness = thickness;
    
    this.init();
    this.initDonut();
}
ChartDonut.prototype = Object.create(Chart.prototype);
ChartDonut.prototype.initDonut = function () {
    var self = this;

    this.svg = this.svg.attr('class', 'chart--donut--svg')
            .append('g')
            .attr('transform', 'translate(' + (this.width / 2) +
                ',' + (this.height / 2) + ')');
    
    this.arc = this.arc.innerRadius(this.radius - this.thickness)
        .outerRadius(this.radius);

    this.pie = this.pie.value(function (d) {
        return d.value;
    }).sort(null);

    this.path = this.svg.selectAll('path').data(this.pie(this.dataset))
        .enter()
        .append('path')
        .attr('d', this.arc)
        .attr('class', function (d, i) {
            self.total.value += d.data.value;
            return d.data.colorClass;
        });
    
    this.total.text = this.svg.append('text')
        .text(function(){
            var label = (!!self.textLabel) ? self.textLabel : '';
            return self.total.value + label;
        })
        .attr('class', 'chart--total')
        .attr('y', 10);

};
ChartDonut.prototype.constructor = ChartDonut;

// Chart Graph
function ChartGraph(target, label, dataset, width, height, xLabel, yLabel){
    Chart.call(this, target, label, dataset, width, height);
    this.margin = {
        top: 20, 
        right: 20, 
        bottom: 30, 
        left: 20
    };
    this.domain = {
        x: {
            label: xLabel
        },
        y: {
            label: yLabel
        }
    };
    
    this.line = d3.line();
    
    this.init();
    this.initGraph();
}
ChartGraph.prototype = Object.create(Chart.prototype);
ChartGraph.prototype.initGraph = function () {
    var self, parseTime, dateFormat, sortByDateAscending;
    
    self = this;
    sortByDateAscending = function(a, b) {
        return new Date(a.date) - new Date(b.date);
    }
    
    // Date Time Formatting / Parsing functions
    parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
    dateFormat = d3.timeFormat("%d %b");
    
    this.svg = this.svg.attr('class', 'chart--graph--svg')
            .attr("width", this.width)
            .attr("height", this.height + this.margin.bottom * 2)
            .append('g')
            .attr('transform', 'translate(' + (0) +
                ',' + (0) + ')');
            
    
    // Sort data by date
    this.dataset = this.dataset.sort(sortByDateAscending);
    
    console.log(this.dataset);
    
    // Scales
    this.domain.x.scale = d3.scaleTime()
        .range([0, this.width - this.margin.left])
        .domain(d3.extent(this.dataset, function(d){
            return parseTime(d.date);
        }));
        
    this.domain.y.scale = d3.scaleLinear()
        .range([this.height, this.margin.top])
        .domain(d3.extent(this.dataset, function(d){
            return d.value / 10;
        }));
    
    console.log(this.domain.x.scale.domain());

    // Line
    this.line = this.line.curve(d3.curveBasisOpen)
        .x(function(d, i) { 
            return self.domain.x.scale(parseTime(d.date)); 
        })
        .y(function(d, i) { 
            return self.domain.y.scale(d.value / 10); 
        });


    // Add Axis
    this.domain.x.axis = this.svg.append("g")
        .attr("class", "axis--x")
        .attr("transform", "translate(0," + (this.height) + ")")
        .call(d3.axisBottom(this.domain.x.scale)
            .tickFormat(dateFormat)
            .ticks(8)
            .tickSizeInner(-this.height)
            .tickSizeOuter(0)
            .tickPadding(10)
        );
    
    this.domain.y.axis = this.svg.append("g")
        .attr("class", "axis--y")
        .attr("transform", "translate(" + 0 + ", " + (0) + ")")
        .call(d3.axisLeft(this.domain.y.scale).ticks(5)
            .tickSizeInner(-this.width)
            .tickSizeOuter(0)
            .tickPadding(0)
        );
    
    // Add Path
    this.path = this.svg.append("g")
        .append("path")
        .datum(this.dataset)
        .attr("class", "graph--line")
        .attr("d", this.line).attr("transform", "translate(" + (this.margin.left + 5) + "," + (0) + ")");

    
    // Add label x Axis
    this.svg.append("text")
            .attr("class", "graph--label-x")
            .attr("x", this.margin.left - 4)
            .attr("y", this.margin.top + 5)
            .text(this.domain.x.label);
    
    // Add label y Axis
    this.svg.append("text")
            .attr("class", "graph--label-y")
            .attr("x", this.width / 2)
            .attr("y", this.height + this.margin.bottom + 10)
            .text(this.domain.y.label);
    
    // Add graph title
    this.svg.append("text")
            .attr("x", this.width / 2)
            .attr("y", this.margin.bottom)
            .attr("class", "graph--title")
            .text(this.textLabel);
    
    
    // Transition
    /*
    var transition = d3.select({}).transition()
        .duration(750)
        .ease("linear");
        */
    

};
ChartGraph.prototype.constructor = ChartGraph;