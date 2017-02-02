// var utils = require('../Utils_clust');
var reposition_tile_highlight = require('./reposition_tile_highlight');
var toggle_dendro_view = require('../dendrogram/toggle_dendro_view');
// var show_visible_area = require('../zoom/show_visible_area');
var ini_zoom_info = require('../zoom/ini_zoom_info');

module.exports = function row_reorder(cgm, row_selection, inst_row) {

  console.log('row_reorder')

  var params = cgm.params;
  params.viz.inst_order.row = 'custom';
  toggle_dendro_view(cgm, 'col');

  d3.selectAll(params.root+' .toggle_col_order .btn')
    .classed('active',false);

  params.viz.run_trans = true;

  var mat       = $.extend(true, {}, params.matrix.matrix);
  var row_nodes = params.network_data.row_nodes;
  var col_nodes = params.network_data.col_nodes;

  // find the index of the row
  var tmp_arr = [];
  row_nodes.forEach(function(node) {
    tmp_arr.push(node.name);
  });

  // find index
  inst_row = _.indexOf(tmp_arr, inst_row);

  // gather the values of the input genes
  tmp_arr = [];
  col_nodes.forEach(function(node, index) {
    tmp_arr.push( mat[inst_row].row_data[index].value);
  });

  // sort the rows
  var tmp_sort = d3.range(tmp_arr.length).sort(function(a, b) {
    return tmp_arr[b] - tmp_arr[a];
  });

  // resort cols (cols are reorderd by double clicking a row)
  params.viz.x_scale.domain(tmp_sort);

  // save to custom col order
  params.matrix.orders.custom_row = tmp_sort;

  // reorder matrix
  ////////////////////
  var t;
  if (params.network_data.links.length > params.matrix.def_large_matrix){
    t = d3.select(params.root + ' .viz_svg');
  } else {
    t = d3.select(params.root + ' .viz_svg').transition().duration(2500);
  }

  // Move Col Labels
  t.select('.col_zoom_container')
    .selectAll('.col_label_text')
    .attr('transform', function(d) {
      return 'translate(' + params.viz.x_scale(d.col_index) + ')rotate(-90)';
    });

  // reorder col_class groups
  t.selectAll('.col_cat_group')
    .attr('transform', function(d) {
      return 'translate(' + params.viz.x_scale(d.col_index) + ',0)';
    });

  // reorder matrix
  t.selectAll('.tile')
    .attr('transform', function(d) {
      return 'translate(' + params.viz.x_scale(d.pos_x) + ',0)';
    });

  t.selectAll('.tile_up')
    .attr('transform', function(d) {
      return 'translate(' + params.viz.x_scale(d.pos_x) + ',0)';
    });

  t.selectAll('.tile_dn')
    .attr('transform', function(d) {
      return 'translate(' + params.viz.x_scale(d.pos_x) + ',0)';
    });


  // highlight selected column
  ///////////////////////////////
  // unhilight and unbold all columns (already unbolded earlier)
  d3.selectAll(params.root+' .row_label_group')
    .select('rect')
    .style('opacity', 0);
  // highlight column name
  d3.select(row_selection)
    .select('rect')
    .style('opacity', 1);

  reposition_tile_highlight(params);

  // redefine x and y positions
  params.network_data.links.forEach(function(d){
    d.x = params.viz.x_scale(d.target);
    d.y = params.viz.y_scale(d.source);
  });

  params.zoom_info = ini_zoom_info();

  // // tmp disable may not need - getting circular calling
  // show_visible_area(cgm);

  setTimeout(function(){
    params.viz.run_trans = false;
  }, 2500);

};
