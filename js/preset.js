function preset_export() {
  const modalTextArea = document.getElementById('modal-export-preset-textarea');
  const settings = require('electron-settings');
  var presets = settings.get('presets');

  presets = JSON.stringify(presets);
  modalTextArea.innerHTML = btoa(presets);
}

function preset_import() {
  const modalTextArea = document.getElementById('modal-import-preset-textarea');
  const settings = require('electron-settings');
  var currentPresets = settings.get('presets');
  var presetsToBeImported = atob(modalTextArea.value);

  try {
    presetsToBeImported = JSON.parse(presetsToBeImported);
  } catch (e) {
    notification('danger', 'Unable to import presets, malformed data.');
    console.error(e);
    return;
  }

  var updatedPresets = Object.assign(
    {},
    currentPresets,
    presetsToBeImported
  );
  settings.set('presets', updatedPresets);
  updatePresetList();
  modalTextArea.innerText = '';
}
