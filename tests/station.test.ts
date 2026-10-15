import { describe, expect, it } from 'vitest';import { gate, EAT_MS, shouldAutoOpen } from '../src/ui/StationPanel';
describe('station click guard',()=>{const t0=1000;
it('eats clicks inside window',()=>{expect(gate(t0,t0+10,true,t0+EAT_MS-1)).toBe(false);});
it('accepts real in-modal click after window',()=>{expect(gate(t0,t0+300,true,t0+300)).toBe(true);});
it('rejects fire-through (down before open / outside)',()=>{expect(gate(t0,t0-500,true,t0+500)).toBe(false);expect(gate(t0,t0+300,false,t0+300)).toBe(false);});});
describe('station auto-open once per wave',()=>{
it('opens on new intermission wave',()=>{expect(shouldAutoOpen('INTERMISSION',false,0,1)).toBe(true);});
it('stays shut after manual close until next wave',()=>{expect(shouldAutoOpen('INTERMISSION',false,1,1)).toBe(false);expect(shouldAutoOpen('INTERMISSION',false,1,2)).toBe(true);});
it('never auto-opens mid-fight or when already open',()=>{expect(shouldAutoOpen('PLAYING',false,0,1)).toBe(false);expect(shouldAutoOpen('INTERMISSION',true,0,1)).toBe(false);expect(shouldAutoOpen('STATION',false,0,1)).toBe(false);});});