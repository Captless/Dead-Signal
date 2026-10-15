import { describe, expect, it } from 'vitest';
// auto-deploy: wave clears, short beat, next wave deploys without a shop
export const AUTO_DEPLOY_DELAY=2.5;
describe('stage',()=>{it('auto deploy delay sane',()=>{expect(AUTO_DEPLOY_DELAY).toBeGreaterThan(1);expect(AUTO_DEPLOY_DELAY).toBeLessThan(10);});});
