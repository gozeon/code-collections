import * as gg from 'engine-api';

export const mapEventDelegate: gg.MapEventDelegate = {
  layerWillAdd: (layer: gg.Layer) => {
  },
  layerDidAdd: (layer: gg.Layer) => {
    const checkboxID = `cb${layer.id}`;
    const sliderID = `sl${layer.id}`;

    $('div#layerBar').fadeIn();
    $('div#layerBarList').empty();
    $('div#layerBarList').append(`
      <div class="layer-bar-item">
        <input type="checkbox" checked id=${checkboxID}>
        <span>${layer.name}</span>
        <input type="range" value="1" max="1" min="0" step="0.1" id=${sliderID}>
      </div>
    `);

    addEvent(layer.id, checkboxID, sliderID);
  }
}

const addElement = (layers: gg.Layer) => {

}

const addEvent = (layerID: string, checkboxID: string, sliderID: string) => {
  $(`#${checkboxID}`).click(function () {
    if($(this).is(':checked')) {
      (<any>window).Map.showLayer(layerID);
    }else {
      (<any>window).Map.hideLayer(layerID);
    }
  });

  $(`#${sliderID}`).change(function () {
    (<any>window).Map.setLayerOpacity(layerID, +$(this).val());
  })
}
