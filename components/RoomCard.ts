import { Locator } from '@playwright/test';
 
/** One room card on the home page. */
export class RoomCard {
  readonly container: Locator;
  readonly tvIndicator: Locator;
 
  constructor(root: Locator) {
    this.container = root;
    // Any element on the card that represents the TV feature (icon or label)
    
    this.tvIndicator = root.locator('i.bi.bi-tv.me-1');
  }
}