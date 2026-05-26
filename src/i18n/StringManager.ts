/**
 * StringManager.ts
 *
 * Centralizes string management for Electric Field of Dreams.
 * Provides access to localized strings for all components.
 */

import { LocalizedString, type ReadOnlyProperty } from "scenerystack";
import electricFieldOfDreams from "../ElectricFieldOfDreamsNamespace.js";
import stringsEn from "./strings_en.json";
import stringsFr from "./strings_fr.json";

// ── Compile-time key-parity check ─────────────────────────────────────────────
// satisfies errors immediately if either locale file is missing keys from the other.
// biome-ignore lint/complexity/noVoid: intentional compile-time type assertion
void (stringsEn satisfies typeof stringsFr);
// biome-ignore lint/complexity/noVoid: intentional compile-time type assertion
void (stringsFr satisfies typeof stringsEn);

export class StringManager {
  private static instance: StringManager;
  private readonly stringProperties;

  private constructor() {
    this.stringProperties = LocalizedString.getNestedStringProperties({
      en: stringsEn,
      fr: stringsFr,
    });
  }

  public static getInstance(): StringManager {
    if (!StringManager.instance) {
      StringManager.instance = new StringManager();
      electricFieldOfDreams.register("StringManager", StringManager.instance);
    }
    return StringManager.instance;
  }

  public getTitleStringProperty(): ReadOnlyProperty<string> {
    return this.stringProperties.titleStringProperty;
  }

  public getScreenNames(): { electricFieldOfDreamsStringProperty: ReadOnlyProperty<string> } {
    return {
      electricFieldOfDreamsStringProperty: this.stringProperties.screens.electricFieldOfDreamsStringProperty,
    };
  }

  public getParticleStrings() {
    return this.stringProperties.particles;
  }

  public getExternalFieldStrings() {
    return this.stringProperties.externalField;
  }

  public getFieldDensityStrings() {
    return this.stringProperties.fieldDensity;
  }
}
