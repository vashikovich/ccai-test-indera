import { assert } from "console";
import { TestCase } from "../../test-framework/TestCase";
import { TestSuite } from "../../test-framework/TestSuite";

export default () => {
  return new TestSuite("Video Converter", [
    new TestCase(
      "It successfully uploads mp4 > avi in HD",
      async (page, steps, assertTrue) => {
        steps.push("Open page");
        await page.goto("https://video-converter.com/");
        assertTrue(
          await page
            .getByRole("link", { name: "Video Converter online" })
            .isVisible()
        );
        assertTrue(await page.locator("#upload_button").isVisible());

        steps.push("Choose file to upload");
        await page.locator("#upload_button").click();
        await page
          .locator("input[type='file']")
          .setInputFiles(
            "./src/test-suites/samples/SampleVideo_360x240_1mb.mp4"
          );

        steps.push("Choose conversion settings");
        assertTrue(await page.getByText("avi", { exact: true }).isVisible());
        await page.getByText("avi", { exact: true }).click();

        await page.locator("#preset_dropdown").click();
        assertTrue(await page.getByText("1280x720HD 720p").isVisible());
        await page.getByText("1280x720HD 720p").click();

        steps.push("Start conversion");
        await page
          .locator("a")
          .filter({ hasText: /^Convert$/ })
          .click();

        steps.push("Download converted file");
        assertTrue(
          await page.getByRole("link", { name: "Download" }).isVisible()
        );
        // const downloadPromise = page.waitForEvent("download");
        await page.getByRole("link", { name: "Download" }).click();
        // const download = await downloadPromise;
        // assertTrue(Boolean(await download.path()));
        // should also check details of downloaded file
      }
    ),
    new TestCase(
      "It should fail using YouTube video",
      async (page, steps, assertTrue) => {
        steps.push("Open page");
        await page.goto("https://video-converter.com/");
        assertTrue(
          await page
            .getByRole("link", { name: "Video Converter online" })
            .isVisible()
        );

        steps.push("Click and input URL link");
        await page.locator("#open_link").click();
        page.on("dialog", (dialog) => {
          assertTrue(dialog.message() === "Open file from URL");
          dialog.accept("https://www.youtube.com/watch?v=aWk2XZ_8IhA");
        });

        steps.push("Shows error message");
        assertTrue(
          await page
            .getByText("Unable to open file", { exact: true })
            .isVisible()
        );
      }
    ),
    // new TestCase(
    //   "It should not success uploading above 4GB",
    //   async (page, steps, assertTrue) => {}
    // ),
  ]);
};
