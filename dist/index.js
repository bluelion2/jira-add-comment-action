/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 450:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 177:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 645:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(450)
const github = __nccwpck_require__(177)
const axios = __nccwpck_require__(645)

try {
  const changedComment = github.context.payload.comment.body
  const prBody = github.context.payload.issue.body
  const jiraToken = core.getInput('jira-token')
  const baseURL = core.getInput('jira-url')
  const vercelRegExp = changedComment.match(/review.+(https?\S+\.vercel\.app)/)
  const jiraRegExp = prBody.match(/(https?:\/\/freewheelin\.atlassian\.net\/browse\/(\S+\-[0-9]+))/)

  if (vercelRegExp && jiraRegExp) {
    const [, vercelUrl] = vercelRegExp
    const [, jiraUrl, issueKey] = jiraRegExp

    if (vercelUrl && jiraUrl) {
      const auth = `Basic ${Buffer.from(`dev@mathflat.com:${jiraToken}`).toString('base64')}`

      const body = `{
        "body": {
          "type": "doc",
          "version": 1,
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": "preview url : ${vercelUrl}",
                  "type": "text"
                }
              ]
            }
          ]
        }
      }`

      const action = axios.create({
        baseURL,
        headers: {
          Authorization: auth,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      action.post(`/issue/${issueKey}/comment`, body)
    }
  }
} catch (error) {
  core.setFailed(error.message)
}

})();

module.exports = __webpack_exports__;
/******/ })()
;