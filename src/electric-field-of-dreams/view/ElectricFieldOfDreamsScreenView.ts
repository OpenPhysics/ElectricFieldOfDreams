/**
 * ElectricFieldOfDreamsScreenView.ts
 *
 * Lays out the play area (field-arrow grid, bounding box, draggable particles), the
 * right-hand control column (particle, external-field, and field-density panels), the
 * bottom play/step controls, and the Reset All button. Builds the model-view transform
 * that maps the model's box to the play area. Ported from `views/scene.js` + `sim.js`.
 */

import { DerivedProperty } from "scenerystack/axon";
import { Dimension2, Vector2 } from "scenerystack/dot";
import { ModelViewTransform2 } from "scenerystack/phetcommon";
import { HBox, Node } from "scenerystack/scenery";
import { NumberControl, PhetFont, PlayPauseButton, ResetAllButton, StepForwardButton } from "scenerystack/scenery-phet";
import { ScreenView, type ScreenViewOptions } from "scenerystack/sim";
import { Panel } from "scenerystack/sun";
import type { Tandem } from "scenerystack/tandem";
import { FLAT_RESET_ALL_BUTTON_OPTIONS } from "../../common/ElectricFieldOfDreamsButtonOptions.js";
import ElectricFieldOfDreamsColors from "../../ElectricFieldOfDreamsColors.js";
import Constants from "../../ElectricFieldOfDreamsConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";
import type Particle from "../model/Particle.js";
import BoundsNode from "./BoundsNode.js";
import { ElectricFieldOfDreamsScreenSummaryContent } from "./ElectricFieldOfDreamsScreenSummaryContent.js";
import ExternalFieldControlPanel from "./ExternalFieldControlPanel.js";
import FieldGridNode from "./FieldGridNode.js";
import ParticleControlPanel from "./ParticleControlPanel.js";
import ParticleNode from "./ParticleNode.js";

type ElectricFieldOfDreamsScreenViewOptions = ScreenViewOptions & { tandem: Tandem };

// Pixel margin around the play area and between adjacent UI elements.
const MARGIN = 14;

// Pixel height reserved at the bottom for the play/step controls.
const BOTTOM_CONTROLS_HEIGHT = 70;

export class ElectricFieldOfDreamsScreenView extends ScreenView {
  private readonly fieldGridNode: FieldGridNode;

  public constructor(model: ElectricFieldOfDreamsModel, providedOptions: ElectricFieldOfDreamsScreenViewOptions) {
    super({
      ...providedOptions,
      screenSummaryContent: new ElectricFieldOfDreamsScreenSummaryContent(model),
    });

    const layoutBounds = this.layoutBounds;

    // ── Right-hand control column ────────────────────────────────────────────
    // These two panels are independent of the model-view transform, so they can be
    // measured before it exists. The external-field panel needs the transform (created
    // below), but its width is a fixed constant (the drag pad), so we fold that constant
    // into the column width here to reserve the right space.
    const particleControlPanel = new ParticleControlPanel(model);
    const fieldDensityPanel = ElectricFieldOfDreamsScreenView.createFieldDensityPanel(model);
    const columnWidth = Math.max(
      particleControlPanel.width,
      fieldDensityPanel.width,
      ExternalFieldControlPanel.ESTIMATED_WIDTH,
    );

    // ── Play area geometry ───────────────────────────────────────────────────
    const usableWidth = layoutBounds.width - columnWidth - 3 * MARGIN;
    const usableHeight = layoutBounds.height - BOTTOM_CONTROLS_HEIGHT - 2 * MARGIN;
    const playAreaCenterX = MARGIN + usableWidth / 2;
    const playAreaCenterY = MARGIN + usableHeight / 2;

    // Fit the box (dilated by one particle radius so the wall is fully visible).
    const boxExtent = Constants.SYSTEM_WIDTH + 2 * Constants.PARTICLE_RADIUS;
    const scale = Math.min(usableWidth, usableHeight) / boxExtent;

    // Non-inverted Y (model +y is down on screen), matching the original PIXI sim so the
    // wall-bounce and field math behave identically.
    const modelViewTransform = ModelViewTransform2.createSinglePointScaleMapping(
      model.center,
      new Vector2(playAreaCenterX, playAreaCenterY),
      scale,
    );

    const externalFieldControlPanel = new ExternalFieldControlPanel(model, modelViewTransform);

    // ── Play-area nodes ──────────────────────────────────────────────────────
    const arrowMargin = modelViewTransform.modelToViewDeltaX(Constants.MAX_ARROW_LENGTH);
    const fieldCanvasBounds = modelViewTransform.modelToViewBounds(model.bounds).dilated(arrowMargin);
    const fieldGridNode = new FieldGridNode(model, modelViewTransform, fieldCanvasBounds);
    this.fieldGridNode = fieldGridNode;

    const boundsNode = new BoundsNode(model, modelViewTransform);

    const particleLayer = new Node();
    const particleNodes = new Map<Particle, ParticleNode>();
    const addParticleNode = (particle: Particle): void => {
      const node = new ParticleNode(particle, model, modelViewTransform);
      particleNodes.set(particle, node);
      particleLayer.addChild(node);
    };
    const removeParticleNode = (particle: Particle): void => {
      const node = particleNodes.get(particle);
      if (node) {
        particleLayer.removeChild(node);
        node.dispose();
        particleNodes.delete(particle);
      }
    };
    model.particles.forEach(addParticleNode);
    model.particles.elementAddedEmitter.addListener(addParticleNode);
    model.particles.elementRemovedEmitter.addListener(removeParticleNode);

    // ── Bottom play/step controls ────────────────────────────────────────────
    const playPauseButton = new PlayPauseButton(model.timer.isPlayingProperty, { radius: 22 });
    const stepForwardButton = new StepForwardButton({
      radius: 18,
      enabledProperty: DerivedProperty.not(model.timer.isPlayingProperty),
      listener: () => model.stepOnce(),
    });
    const playbackControls = new HBox({
      spacing: 16,
      align: "center",
      children: [playPauseButton, stepForwardButton],
    });

    const resetAllButton = new ResetAllButton({
      ...FLAT_RESET_ALL_BUTTON_OPTIONS,
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
      },
      right: layoutBounds.maxX - MARGIN,
      bottom: layoutBounds.maxY - MARGIN,
      tandem: providedOptions.tandem.createTandem("resetAllButton"),
    });

    // ── Positioning ──────────────────────────────────────────────────────────
    particleControlPanel.right = layoutBounds.maxX - MARGIN;
    particleControlPanel.top = MARGIN;
    externalFieldControlPanel.right = layoutBounds.maxX - MARGIN;
    externalFieldControlPanel.top = particleControlPanel.bottom + MARGIN;
    fieldDensityPanel.right = layoutBounds.maxX - MARGIN;
    fieldDensityPanel.top = externalFieldControlPanel.bottom + MARGIN;

    playbackControls.centerX = playAreaCenterX;
    playbackControls.bottom = layoutBounds.maxY - MARGIN;

    this.children = [
      fieldGridNode,
      particleLayer,
      boundsNode,
      particleControlPanel,
      externalFieldControlPanel,
      fieldDensityPanel,
      playbackControls,
      resetAllButton,
    ];

    // ── Accessibility: keyboard / reading traversal order ───────────────────────
    // Deterministic Tab/reading order: the draggable charges first, then the
    // control panels, playback controls, and Reset All last. ScreenView throws if
    // you set pdomOrder on itself, so use a wrapper Node.
    this.addChild(
      new Node({
        pdomOrder: [
          particleLayer,
          particleControlPanel,
          externalFieldControlPanel,
          fieldDensityPanel,
          playbackControls,
          resetAllButton,
        ],
      }),
    );
  }

  private static createFieldDensityPanel(model: ElectricFieldOfDreamsModel): Panel {
    const strings = StringManager.getInstance().getFieldDensityStrings();
    const font = new PhetFont(13);
    const control = new NumberControl(
      strings.titleStringProperty,
      model.fieldLatticeWidthProperty,
      Constants.DISCRETENESS_RANGE,
      {
        titleNodeOptions: { font, fill: ElectricFieldOfDreamsColors.foregroundColorProperty },
        numberDisplayOptions: { textOptions: { font }, decimalPlaces: 0 },
        sliderOptions: { trackSize: new Dimension2(120, 3), constrainValue: (value: number) => Math.round(value) },
        delta: 1,
      },
    );
    return new Panel(control, {
      fill: ElectricFieldOfDreamsColors.panelFillProperty,
      stroke: ElectricFieldOfDreamsColors.panelStrokeProperty,
      cornerRadius: 6,
      xMargin: 12,
      yMargin: 10,
    });
  }

  public override step(_dt: number): void {
    // Repaint the field grid each frame so it tracks the moving charges.
    this.fieldGridNode.update();
  }
}
