/**
 * Cucumber Configuration File
 * Uses the new 'allure-cucumberjs/reporter' format for Allure integration.
 */

const common = {
    // Specify the location of feature files
    paths: [
        "src/features/**/*.feature"
    ],
    
    // Specify the location of step definitions and support files
    require: [
        "src/steps/**/*.ts",
        "src/support/world.ts",
        "src/support/hooks.ts"
    ],
    
    // Configure the Allure reporter
    format: [
        "allure-cucumberjs/reporter"
    ],
    
    // Configure Allure reporter options
    formatOptions: {
        resultsDir: "allure-results",
        
        // Example of how to map tags to Allure labels
        labels: [
            {
                pattern: [/@epic:(.*)/],
                name: "epic",
            },
            {
                pattern: [/@severity:(.*)/],
                name: "severity",
            },
            {
                pattern: [/@owner:(.*)/],
                name: "owner",
            },
        ],
        
        // Example of how to map tags to Allure links
        links: {
            issue: {
                pattern: [/@issue:(.*)/],
                urlTemplate: "https://issues.example.com/%s",
                nameTemplate: "ISSUE %s",
            },
            tms: {
                pattern: [/@tms:(.*)/],
                urlTemplate: "https://tms.example.com/%s",
            },
        },
        
        // Example of how to categorize test failures
        categories: [
            {
                name: "Product Bug",
                messageRegex: ".*expected.*but got.*",
                matchedStatuses: ["failed"],
            },
            {
                name: "Test Infrastructure Issue",
                messageRegex: ".*timeout.*|.*network.*|.*browser.*",
                matchedStatuses: ["broken"],
            },
        ],
        
        // Environment information (will be automatically added by allure-cucumberjs)
        // environmentInfo: {
        //     os_platform: os.platform(),
        //     os_release: os.release(),
        //     node_version: process.version,
        // },
    },
    
    // Transpile TypeScript files
    requireModule: [
        "ts-node/register"
    ],
    
    // Tags to run (e.g., '@smoke and not @skip')
    tags: process.env.CUCUMBER_TAGS || "",
    
    // Other options
    strict: true,
    publishQuiet: true,
    retry: 0,
    worldParameters: {
        // Pass any global parameters to the World constructor
    }
};

module.exports = {
    default: common
};
