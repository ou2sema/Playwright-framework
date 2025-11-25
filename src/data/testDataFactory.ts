import { DataLoader } from "./dataLoader";

export class TestDataFactory {
  static getLoginTestData() {
    return DataLoader.loadLoginData(process.env.TEST_ENV);
  }
}
