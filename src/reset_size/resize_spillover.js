module.exports = function resize_spillover(params, ini_svg_group, delay_info=false){

  var delays = {};
  var duration = params.viz.duration;
  var svg_group;

  if(delay_info === false){
    delays.run_transition = false;
  } else {
    delays = delay_info;
  }

  if (delays.run_transition){
    svg_group = ini_svg_group
      .transition().delay(delays.update).duration(duration);
  } else {
    svg_group = ini_svg_group;
  }

  svg_group
    .select('.right_slant_triangle')
    .attr('transform', 'translate(' + params.viz.clust.dim.width + ',' +
    params.viz.norm_labels.width.col + ')');

  svg_group.select('.left_slant_triangle')
    .attr('transform', 'translate(-1,' + params.viz.norm_labels.width.col +')');

  svg_group
    .select('.top_left_white')
    .attr('width', params.viz.clust.margin.left)
    .attr('height', params.viz.clust.margin.top);

  var tmp_left = params.viz.clust.margin.left +   
    params.viz.clust.dim.width +
    params.viz.uni_margin + 
    params.viz.dendro_room.row;
  var tmp_top = params.viz.norm_labels.margin.top + params.viz.norm_labels.width.col;
  
  svg_group.select('.right_spillover')
    .attr('transform', function() {
      return 'translate(' + tmp_left + ',' + tmp_top + ')';
    })
    .attr('height', params.viz.svg_dim.height+'px');

  // white border bottom - prevent clustergram from hitting border
  svg_group.select('.bottom_spillover')
    .attr('width', params.viz.svg_dim.width)
    .attr('height', 2 * params.viz.grey_border_width)
    .attr('transform', function() {
      // shift up enough to show the entire border width
      var inst_offset = params.viz.svg_dim.height - 3 * params.viz.grey_border_width;
      return 'translate(0,' + inst_offset + ')';
    });

};