/**
 * main.ts
 *
 * Entry point for the Electric Field of Dreams application. Initializes the
 * simulation, creates the screen, and starts the main event loop.
 */

// NOTE: brand.js needs to be the first import. SceneryStack sims require a specific load order:
// init.ts => assert.ts => splash.ts => brand.ts => everything else (here).
import "./brand.js";

import { onReadyToLaunch, PreferencesModel, Sim } from "scenerystack/sim";
import { Tandem } from "scenerystack/tandem";
import ElectricFieldOfDreamsColors from "./ElectricFieldOfDreamsColors.js";
import electricFieldOfDreams from "./ElectricFieldOfDreamsNamespace.js";
import { ElectricFieldOfDreamsScreen } from "./electric-field-of-dreams/ElectricFieldOfDreamsScreen.js";
import { StringManager } from "./i18n/StringManager.js";

onReadyToLaunch(() => {
  const stringManager = StringManager.getInstance();

  const screens = [
    new ElectricFieldOfDreamsScreen({
      name: stringManager.getScreenNames().electricFieldOfDreamsStringProperty,
      tandem: Tandem.ROOT.createTandem("electricFieldOfDreamsScreen"),
      backgroundColorProperty: ElectricFieldOfDreamsColors.backgroundColorProperty,
    }),
  ];

  const simOptions = {
    preferencesModel: new PreferencesModel({
      visualOptions: {
        supportsProjectorMode: true,
        supportsInteractiveHighlights: true,
      },
      localizationOptions: {
        supportsDynamicLocale: true,
      },
    }),
  };

  const sim = new Sim(stringManager.getTitleStringProperty(), screens, simOptions);
  electricFieldOfDreams.register("sim", sim);
  sim.start();
});
