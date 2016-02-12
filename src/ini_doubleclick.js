function ini_doubleclick(params){

  // disable double-click zoom
  d3.selectAll(params.viz.viz_svg).on('dblclick.zoom', null);

  d3.select(params.viz.viz_svg)
    .on('dblclick', function() {
      two_translate_zoom(params, 0, 0, 1);
    });
}