'use strict'

const fs = require('fs')

module.exports = function (karma) {
  const glob = 'tests/browser/*.js'
  const files = [{pattern: glob}]

  const customLaunchers = {
    SL_Edge: {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'microsoftedge'
    },
    SL_Firefox: {
      base: 'SauceLabs',
      browserName: 'Firefox'
    },
    SL_Chrome: {
      base: 'SauceLabs',
      browserName: 'Chrome',
      platform: 'Windows 10'
    },
    SL_Safari: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OSX 10.11'
    },
    SL_IE11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11'
    },
    SL_IE10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10'
    },
    SL_IE9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '9'
    }
  }

  const sauceConfig = {
    sauceLabs: {
      testName: 'choo browser tests',
      recordScreenshots: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers)
  }

  let config = {
    frameworks: ['tap', 'browserify'],
    preprocessors: {
      [glob]: ['browserify']
    },
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: karma.LOG_INFO,
    files: files,
    browserify: {
      debug: true,
      transform: ['sheetify/transform', 'es2020']
    },
    singleRun: true,
    browsers: ['Chrome'],
    captureTimeout: 10000000,
    browserNoActivityTimeout: 1000000
  }

  // always run coverage in Travis and use sauce labs to launch browsers
  if (process.env.TRAVIS) {
    process.env.COVERAGE = true
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
      const sauce = JSON.parse(fs.readFileSync('.sauce-credentials.json', 'utf8'))
      process.env.SAUCE_USERNAME = sauce.user
      process.env.SAUCE_ACCESS_KEY = sauce.key
    }
    config = Object.assign(config, sauceConfig)
  }

  // add coverage
  if (process.env.COVERAGE) {
    config.reporters.push('coverage')
    config.browserify.transform.push(['browserify-istanbul', {instrumenterConfig: { embedSource: true }}])
    config.coverageReporter = {type: 'lcov'}
  }

  // for development setting this variable will open karma and continously
  // run the test suite when files have changed
  if (process.env.MULTI_RUN === 'true') {
    config.singleRun = false
  }

  if (process.env.IE === 'true') {
    config.browsers = ['IE']
  }

  if (process.env.SAFARI === 'true') {
    config.browsers = ['Safari']
  }

  karma.set(config)
}
