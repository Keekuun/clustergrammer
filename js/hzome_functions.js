
function ini_hzome(){

  // save gene data to global variable
  gene_data = {};

  were_genes_found = false;

  function get_mouseover(gene_symbol){

    if ( d3.select('.row_tip').classed(gene_symbol) ){

      get_request(gene_symbol);

    }

  }

  function get_request(gene_symbol, optional_callback){



    var base_url = 'https://amp.pharm.mssm.edu/Harmonizome/api/1.0/gene/';
    var url = base_url + gene_symbol;

    $.get(url, function(data) {

      data = JSON.parse(data);

      // save data for repeated use
      gene_data[gene_symbol] = {}
      gene_data[gene_symbol].name = data.name;
      gene_data[gene_symbol].description = data.description;

      if (data.name != undefined){
        were_genes_found = true;
      }

      set_tooltip(data, gene_symbol);

      if (typeof optional_callback === 'function'){
        optional_callback(gene_symbol);
      }

      return data;

    });
  }

  function set_tooltip(data, gene_symbol){

    if (data.name != undefined){
      d3.selectAll('.row_tip')
        .html(function(){
            var sym_name = gene_symbol + ': ' + data.name;
            var full_html = '<p>' + sym_name + '</p>' +  '<p>' +
              data.description + '</p>';
            return full_html;
        });
    }
  }


  function gene_info(gene_info){

    var gene_symbol = gene_info.name;

    if (_.has(gene_data, gene_symbol)){
      var inst_data = gene_data[gene_symbol];
      set_tooltip(inst_data)
    } else{
      setTimeout(get_mouseover, 250, gene_symbol);
    }

  }

  hzome = {}

  hzome.gene_info = gene_info;
  hzome.gene_data = gene_data;
  hzome.get_mouseover = get_mouseover;
  hzome.get_request = get_request;

  return hzome;

}

function check_for_genes(){

  var all_names = ['sometthing', 'not-a-gene', 'asfas', 'EGFR', '2134qw'];

  // check each gene using Harmonizome
  _.each(all_names, function(inst_name){

    hzome.get_request(inst_name, check_ini_enrichr);

  });

}

function check_ini_enrichr(inst_name){

  if (were_genes_found){
    console.log('** set up Enrichr')
  }

}


