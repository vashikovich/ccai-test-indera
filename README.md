# Carbon Copies Coding Test

## Setup

- Clone the repository.
- Navigate to the `server` directory and run the following commands to prepare:
```
  cd server
  npm install
  ```
- Add `.env` file with Google Gemini API key (see `.env.sample` for details)
- To test large file upload, please provide your own file and put it into `server/src/test-suites/samples/LargeFile.mp4`
	-  You may edit the code to change hard-coded file name in `server/src/test-suites/video-converter/test-suite.ts:96`
- Run server with the following commands:
```
  npm run dev
```
- In a separate terminal window, navigate to the `client` directory and run the following commands:
```
  cd client
  npm install
  npm run start
  ```

### Server-side Implementation

- Web driver for testing is using Playwright library.
- LLM model for generating testing result description is using Google Gemini.
	- The prompt is still coarse as it needs more details requirements.
- CSV file uses pipe (`|`) as delimiter.
	- Using the default comma (`,`) would break the format since the generated description by LLM contains commas. It heavily impacts user experience, so it needs further requirements to mitigate this.
	- The data format is still unpolished as it needs further requirements.
- Web API framework uses Express.js for simplicity and the endpoints currently assumes there is only 1 test suite.
	- For scalability, it should use better framework (e.g., NestJS) and create API structure accordingly.
- The test progress is currently stored in-memory for simplicity.
	- For scalability, intermediate results should be stored on cache storage (e.g., Redis, and deleted after it is finished) so that it works with multi-instances server.
	- The finished result should be stored on NoSQL database (e.g., MongoDB, because the test cases might change so the structure must be flexible)
- Checking test progress currently uses HTTP polling
	- For efficiency, it should use websocket.

### Client-side Implementation

- Framework used is vanilla React with CSS Module and Material UI
	- I don't know why, but the styling is inconsistent and breaking while I was developing it with CSS Module and Material UI. I usually prefer Tailwind CSS. However, for this project, I initially decided to use Material UI because I thought it would give quick, clean, and pretty UI.

### P.S.:
- To be honest, within ~3 hours of development, I was still:
	- Having only the first test case
	- Able to generate CSV, but it showed on the browser tab instead of being downloaded as a file
	- Cramming everything into a single UI component (in the end, only separated it into 2 components though)
	- Failing to assert downloaded file (and I still am. Also, the second test case is not perfect yet, but I keep it that way so that I can test failed test case)
- I was then being carried out and continued to improve it in additional 1 hour (mostly bugfixing and adding the remaining test cases)