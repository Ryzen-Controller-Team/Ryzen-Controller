import * as React from "react";
import LocaleContext, { getTranslation } from "../contexts/LocaleContext";

const localeSelectorModalTitle = getTranslation("app.localeSelectorModalTitle", "Change language");

export default function LocaleSelectorModal() {
  return (
    <LocaleContext.Consumer>
      {locale => (
        <div id="locale-selector-modal" uk-modal="">
          <div className="uk-modal-dialog uk-modal-body">
            <h2 className="uk-modal-title">{localeSelectorModalTitle}</h2>
            <select
              defaultValue={locale.is}
              className="uk-select"
              onChange={event => {
                locale.change(event.target.value as AvailableLanguages);
              }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">Français</option>
              <option value="ch">简体中文</option>
              <option value="de">Deutsch</option>
              <option value="tr">Türkçe</option>
              {/* Add language here with the name of the language in his native name */}
            </select>
          </div>
        </div>
      )}
    </LocaleContext.Consumer>
  );
}
