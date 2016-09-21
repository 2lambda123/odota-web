# ui

Web UI for Dota 2 data.  This is a SPA (single-page application) built with React, Redux, and React-Router.

Quickstart
----
* Install Node.js (6.0.0 or greater) (on Ubuntu, `curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - && sudo apt-get install -y nodejs`)
* `npm install`
* `npm start`
* Visit port 8080 on your development machine.  You can configure the port used by webpack-dev-server in `webpack.config.js`.
* Ready to make a pull request? Run `npm run lint` to make sure there are no linting errors.

Tech Stack
----
* View layer: React
* State management: Redux
* CSS: css-modules/postcss

Notes
----
* All you need is Node.js to get started working on the UI!
* You can develop the UI against the production API.  This is on by default, and means you don't have to set up the entire stack/backend.
  * You can configure it to point to your own instance (if you are working on a backend feature) in `config.js`.
* API Documentation: https://odota.github.io/docs
* Discord: https://discord.gg/0o5SQGbXuWCNDcaF
  * Strongly recommended to join for active developers!
  * You can get help rapidly and coordinate with others.

Development Guides
----
* New to React/Redux? Read these articles on React and watch these egghead series by Redux creator Dan Abramov.
  * Thinking in React: https://facebook.github.io/react/docs/thinking-in-react.html
  * Getting started with Redux: https://egghead.io/courses/getting-started-with-redux
  * Idiomatic Redux: https://egghead.io/courses/building-react-applications-with-idiomatic-redux
  * ES6 guide: https://github.com/lukehoban/es6features
  * Adding new components with Redux: https://github.com/odota/ui/wiki/Adding-new-components-with-redux
