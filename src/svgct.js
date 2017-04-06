const d3 = require("d3");
const topojson = require("topojson");
const smap = require("./smap.js").smap;
const ct_towns = require("./cttowns.js").ct_towns;
const town_names = require("./townnames.js");
const datab = require("datab");

var datab_ui, datab_data,
    townmap,
    town_col = [],
    color_col = [];

var default_color = "white";

var color_towns = function()
{
    var sel;
    sel = d3.select(".col_sel_town").node();
    console.log(sel.options[sel.selectedIndex].value)

    console.log(datab_data.cols());
    console.log(sel.selectedIndex);
    console.log(datab_data.cols()[sel.selectedIndex]);
    town_col = datab_data.cols()[sel.selectedIndex].map(function(t){
	try{
	    return t.toUpperCase().replace("_"," ");
	}
	catch(e){
	    return t;
	}
	    
	    
    });

    sel = d3.select(".col_sel_color").node();
    console.log(sel.options[sel.selectedIndex].value)
    color_col = datab_data.cols()[sel.selectedIndex]

    console.log("coloring towns");
    townmap.color(function(d, i){
	console.log(d.id, town_col);

	var town_i = town_col.indexOf(d.id.toUpperCase().replace("_"," "));

	if ( town_i < 0 )
	    return default_color;
	
	console.log(town_i, d.id);

	return color_col[town_i];
	     
    });
}

/*
 * parse_file 
 */
var parse_file = function()
{

    console.log("parsing file", datab_data.index( "col" ));
    // add column selector
    d3.selectAll( ".col_selector" ).selectAll( "option" )
	.data(datab_data.index( "col" ))
	.enter()
	.append("option")
	.text(function(d) { return d; });

    d3.select(".col_sel_town")
	.on("change", function(){
	    color_towns();
	});

        d3.select(".col_sel_color")
	.on("change", function(){
	    color_towns();
	});

}

/*
 * bind_stuff - set up the UI
 */
var bind_stuff = function()
{

    new datab.data().from_input( d3.select("#file_input"),
				    function(d){
					console.log("got data", d);
					datab_data = d;
					parse_file();
				    });
    
}

var main = function()
{
    townmap = ct_towns(d3.select("#map-container"));
    d3.select(".state-name")
	.text("Connecticut");
    bind_stuff();

};


main();
