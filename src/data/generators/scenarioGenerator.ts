import fs from "fs";
import path from "path";
import { TestDataFactory } from "../testDataFactory";

export function generateLoginFeature() {
  const data = TestDataFactory.getLoginTestData();

  let featureContent = `Feature: Login DDT Tests\n`;

  data.forEach((row, index) => {
    featureContent += `
  Scenario: Login test #${index + 1} (${row.username})
    Given I login with username "${row.username}" and password "${row.password}"
    Then Login should be successful\n`;
  });

  const outputPath = path.join(process.cwd(), "src", "features", "generated", "loginDDT.feature");
  fs.writeFileSync(outputPath, featureContent);
}
