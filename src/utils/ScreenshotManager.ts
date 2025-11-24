import { ICustomWorld } from '../support/world';
import fs from 'fs';
import path from 'path';

export class ScreenshotManager {
  static async capture(world: ICustomWorld, name: string = 'screenshot') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${name}-${timestamp}.png`;
    const filePath = path.join('screenshots', fileName);

    if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots', { recursive: true });

    const buffer = await world.page.screenshot({ path: filePath, fullPage: true });

    // Attach to Allure via Cucumber
    await world.attach(buffer, 'image/png');

    return filePath;
  }
}
