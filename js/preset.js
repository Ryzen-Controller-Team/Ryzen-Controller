/**
 * Will fill the export preset modal textarea with the preset data.
 */
function preset_export() {
  const modalTextArea = document.getElementById('modal-export-preset-textarea');
  const settings = require('electron-settings');
  var presets = settings.get('presets');

  presets = JSON.stringify(presets);
  modalTextArea.innerHTML = btoa(unescape(encodeURIComponent(presets)));
}

/**
 * Will import the preset from the export preset modal textarea.
 */
function preset_import() {
  const modalTextArea = document.getElementById('modal-import-preset-textarea');
  const settings = require('electron-settings');
  var currentPresets = settings.get('presets');
  var presetsToBeImported;

  try {
    presetsToBeImported = decodeURIComponent(escape(atob(modalTextArea.value)));
    presetsToBeImported = JSON.parse(presetsToBeImported);
  } catch (e) {
    notification('danger', 'Unable to import presets, malformed data.');
    appendLog(`preset_import() ${e}`);
    return;
  }

  var updatedPresets = Object.assign(
    {},
    currentPresets,
    presetsToBeImported
  );
  settings.set('presets', updatedPresets);
  preset_updateList();
  modalTextArea.innerText = '';
}

/**
 * Will save the current settings to a new preset.
 */
function preset_createNewPreset() {
  const settingsToBeSaved = getCurrentSettings("inputId");
  const currentPresets = require('electron-settings').get('presets') || {};
  var newPresetName = document.getElementById('new_preset_name').value;

  if (!newPresetName) {
    notification('danger', 'You must provide a preset name.');
    return;
  }

  if (typeof currentPresets[newPresetName] !== "undefined") {
    newPresetName = preset_findUnusedPresetName(newPresetName);
    notification('warning', `This preset name already exist, your preset has been saved with the name "${newPresetName}".`);
  }

  const newPresetList = Object.assign(
    {},
    currentPresets,
    { [newPresetName]: settingsToBeSaved }
  );

  require('electron-settings').set('presets', newPresetList);
  appendLog(`preset_createNewPreset(): Saved preset ${newPresetName}, ${JSON.stringify(newPresetList)}`);
  preset_updateList();
  if (newPresetName === document.getElementById('new_preset_name').value) {
    notification('success', `The preset ${newPresetName} has been saved.`);
  }
}

/**
 * This recursive function will return an available preset name to be used to save a preset.
 *
 * @param {string} newPresetName The preset name to be edited.
 * @param {number} suffix The preset name suffix
 */
function preset_findUnusedPresetName(newPresetName, suffix = 1) {
  const currentPresets = require('electron-settings').get('presets') || {};
  if (typeof currentPresets[`${newPresetName}${suffix}`] !== "undefined") {
    suffix++;
    return preset_findUnusedPresetName(newPresetName, suffix);
  }
  return `${newPresetName}${suffix}`;
}

/**
 * Will save the preset to be enabled on AC plugged out.
 */
function preset_enableAutoApplyOnAcStatusChange(statusName, presetName) {
  const settings = require('electron-settings');
  const status = {
    "update-ac-plugged-in": `will be applied on AC plugged in.`,
    "update-ac-plugged-out": `will be applied on AC plugged out.`,
  };

  if (typeof status[statusName] === "undefined") {
    let message = `Error while updating auto apply on AC status change.`;
    notification('danger', message);
    console.log(`preset_enableAutoApplyOnAcStatusChange(statusName:"${statusName}", presetName:"${presetName}")`);
    Sentry.captureException(new Error(message));
    return;
  }

  settings.set(`auto-apply.${statusName}`, presetName);

  if (presetName) {
    notification('primary', `Preset "${presetName}" ${status[statusName]}`);
  } else {
    notification('primary', `No preset ${status[statusName]}`);
  }
}

/**
 * This will update the preset tab based on saved presets.
 */
function preset_updateList() {
  var presetTab = document.getElementById('presetTab');
  const currentPresets = require('electron-settings').get('presets') || {};

  var content = '';
  content += /*html*/`
    <table class="uk-table uk-table-striped uk-table-hover uk-table-middle">
      <thead>
        <tr>
          <th>Name</th>
          <th colspan="2">Apply on</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  if (Object.keys(currentPresets).length === 0) {
    content += /*html*/`<li>No preset has been created yet, import them or use the "Save to preset" button on Controller tab to create one.</li>`;
  }

  for (const presetName in currentPresets) {
    if (currentPresets.hasOwnProperty(presetName)) {
      const preset = currentPresets[presetName];

      let valueSummary = [];
      for (const key in preset) {
        if (preset.hasOwnProperty(key) && key.indexOf('_range') !== -1 && key.indexOf('apply_') != 0) {
          const value = preset[key];
          valueSummary.push(value);
        }
      }
      valueSummary.join(', ');

      content += /*html*/`
        <tr class="uk-margin">
          <td class="preset">
            <span class="uk-text-lead">${presetName}</span>
            <i class="uk-text-small">${valueSummary}</i>
          </td>
          <td class="uk-table-expand preset">
            <label style="cursor: pointer;">
              <input
                value="${presetName}"
                class="uk-radio onAcStatusChange"
                type="radio"
                name="update-ac-plugged-in"
                ${presetName === require('electron-settings').get('auto-apply.update-ac-plugged-in') ? 'checked' : ''}
              />
              AC&nbsp;plugged&nbsp;in
            </label>
          </td>
          <td class="uk-table-expand preset">
            <label style="cursor: pointer;">
              <input
                value="${presetName}"
                class="uk-radio onAcStatusChange"
                type="radio"
                name="update-ac-plugged-out"
                ${presetName === require('electron-settings').get('auto-apply.update-ac-plugged-out') ? 'checked' : ''}
              />
              AC&nbsp;plugged&nbsp;out
            </label>
          </td>
          <td class="preset">
            <button class="uk-button uk-button-danger delete" type="button" onClick="preset_deletion('${presetName}')">
              Delete
            </button>
            <button class="uk-button uk-button-primary" type="button" onClick="preset_apply('${presetName}')">
              Apply
            </button>
          </td>
        </tr>
      `;
    }
  }
  content += /*html*/`
        <tr class="autoapply">
          <td><span class="uk-align-right">Disable auto apply</span></td>
          <td>
            <label style="cursor: pointer;">
              <input
                value=""
                class="uk-radio onAcStatusChange"
                type="radio"
                name="update-ac-plugged-in"
                ${!require('electron-settings').get('auto-apply.update-ac-plugged-in') ? 'checked' : ''}
              />
              On&nbsp;charging
            </label>
          </td>
          <td>
            <label style="cursor: pointer;">
              <input
                value=""
                class="uk-radio onAcStatusChange"
                type="radio"
                name="update-ac-plugged-out"
                ${!require('electron-settings').get('auto-apply.update-ac-plugged-out') ? 'checked' : ''}
              />
              On&nbsp;discharging
            </label>
          </td>
          <td></td>
        </tr>
      <tbody>
    </table>
  `;
  presetTab.innerHTML = content;
  var acStatusChangeRadios = document.querySelectorAll('.onAcStatusChange');

  Array.from(acStatusChangeRadios).forEach(radio => {
    radio.addEventListener('click', function(event) {
      preset_enableAutoApplyOnAcStatusChange(this.name, this.value);
    });
  });

}

/**
 * Will check if the preset exists.
 *
 * @param {String} name The preset name to look for.
 */
function preset_isExist(name) {
  const preset = require('electron-settings').get(`presets`)[name];
  return !!preset;
}

/**
 * This will apply the preset you asked for.
 * @param {string} presetName The preset name to be applied.
 */
function preset_apply(presetName) {
  if (!preset_isExist(presetName)) {
    notification('danger', `Unable to apply unexisting preset "${presetName}".`);
    return;
  }

  const preset = require('electron-settings').get(`presets`)[presetName];
  appendLog(`preset_apply(): preset ${presetName}: ${JSON.stringify(preset)}`);

  var ret = require('electron-settings').set("latest_controller_tabs_settings", preset);
  appendLog(`preset_apply(): saved preset: ${JSON.stringify(ret)}`);

  loadLatestUsedSettings();
  applyRyzenSettings();
  toggleOptionDisplayBasedOnApplyCheckbox();
}

/**
 * This will delete the preset you asked for.
 * @param {string} presetName The preset name to be deleted.
 */
function preset_deletion(presetName) {
  var presets = require('electron-settings').get(`presets`);
  delete presets[presetName];
  require('electron-settings').set(`presets`, presets);
  notification('success', `The preset ${presetName} has been deleted.`);
  preset_updateList();
}
