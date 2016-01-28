function change_network_view(params, orig_network_data, change_view){
 
  var views = orig_network_data.views;

  console.log('change_network_view')

  // Get Row Filtering View 
  ///////////////////////////////////////////////////////////////
  // change_view has the name of the new view (e.g. {N_row_sum:20})
  // this view name is used to pull up the view information. The view consists 
  // of a description of the view (e.g N_row_sum number and distance type) and 
  // the nodes of the view (e.g. row_nodes and col_nodes). With the new set of 
  // nodes, new_nodes, the links will be filtered in order to only keep links 
  // between nodes that still exist in the view 

  console.log('in change_network_view')
  console.log(change_view)

  if (_.has(change_view,'filter_row')){

    // failsafe if there is only row+col filtering from front-end
    var filt_views = _.filter(views, function(d){

      // failsafe from json 
      if (_.has(d, 'filter_row')){
        // filter_row_value is the same as filter_row 
        return d.filter_row == change_view.filter_row;
      } else {
        return d.filt == change_view.filter_row;
      }

    });  

  } else if (_.has(change_view, 'filter_row_value')) {

    // filter row value 
    var filt_views = _.filter(views, function(d){

      // failsafe from json 
      return d.filter_row_value == change_view.filter_row_value;

    });  

  } else if (_.has(change_view,'filter_row_sum')) {

    var filt_views = _.filter(views, function(d){
      return d.filter_row_sum == change_view.filter_row_sum;
    });

  } else if (_.has(change_view,'filter_row_num')) {

    var filt_views = _.filter(views, function(d){
      return d.filter_row_num == change_view.filter_row_num;
    });

  } else if (_.has(change_view, 'N_row_sum')){

    var filt_views = _.filter(views, function(d){
      return d.N_row_sum == change_view.N_row_sum;
    });

    if(typeof filt_views === 'undefined'){
        filt_views = [views[0]];
    };

  }

  if (change_view==='default'){
    filt_views = [views[0]];
  }

  /*
  get the inst_view 
  */

  // get the single view that will be used to update the network from 
  // the array of filtered views 
  if ( params.show_categories === false ){
    console.log('\nview defined by filter only, no category\n')
    console.log('there are '+String(filt_views.length)+' views with this N_row_sum')
    var inst_view = filt_views[0];

    if (_.has(change_view,'enr_score_type')){

      inst_view = _.filter(filt_views, function(d){
        return d.enr_score_type == change_view.enr_score_type;
      })[0];

      console.log('\n\n final inst_view ');
      console.log(inst_view);
    }

  } 

  if (params.show_categories){
    console.log('\nview defined by filter and category\n')
    // apply category filtering if necessary 
    var inst_view = _.find(filt_views, function(d){
      return d.col_cat === params.current_col_cat;
    })
  }

  /*
  assign the inst_view, if it is defined 
  */
  if (typeof inst_view !== 'undefined'){

    var new_nodes = inst_view.nodes;
    var links = orig_network_data.links;
    var new_network_data = filter_using_new_nodes(new_nodes, links, views);

  } else {
    var new_network_data = orig_network_data;
  }

  return new_network_data;
}



function change_category( inst_cat ){
  // change the category 
  this.params.current_col_cat = inst_cat;
  console.log('changed category to ' + String(inst_cat));
}

function filter_using_new_nodes(new_nodes, links, views){

  // get new names of rows and cols 
  var row_names = _.pluck(new_nodes.row_nodes, 'name');
  var col_names = _.pluck(new_nodes.col_nodes, 'name');
  
  var new_links = _.filter(links, function(d){
    var inst_row = d.name.split('_')[0];
    var inst_col = d.name.split('_')[1]; 

    var row_index = _.indexOf(row_names, inst_row);
    var col_index = _.indexOf(col_names, inst_col);

    if ( row_index >-1 & col_index >-1 ){
      // redefine source and target 
      d.source = row_index;
      d.target = col_index;
      return d;
    }
  });

  // set up new_network_data
  var new_network_data = {};
  // rows
  new_network_data.row_nodes = new_nodes.row_nodes;
  new_network_data.row_nodes_names = row_names;
  // cols
  new_network_data.col_nodes = new_nodes.col_nodes;
  new_network_data.col_nodes_names = col_names;
  // links 
  new_network_data.links = new_links;

  // save all links 
  new_network_data.all_links = links;

  // pass on all views 
  new_network_data.views = views;
  
  return new_network_data;
}