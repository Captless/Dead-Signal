// A zombie kind is a VARIANT of the single rigged GLB character. Every variant shares
// the same skeleton + clip set (walk / attack / death) so animation stays consistent;
// variants differ by height, girth (body shape), palette and optional gear pieces.
export interface ZVariant {
  id: string;
  height: number;   // total height in meters
  girth: number;    // XZ bulk multiplier (body shape: thin runner < 1 < bulky brute)
  skin: number;     // body tint multiplied over the model's texture
  shirt: number;
  pants: number;
  gear: number;
  eye: number;
  cap?: boolean;      // add a head cap piece
  pauldron?: number;  // shoulder pad radius multiplier (undefined = default 1)
  rag?: number;       // number of extra hanging tatters
}
