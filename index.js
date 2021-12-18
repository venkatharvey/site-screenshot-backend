

const Hapi = require("@hapi/hapi");
const puppeteer = require("puppeteer");

const init = async () => {
  
  
  const server = Hapi.Server({
    port: process.env.PORT || "5000",
    routes: {
      cors: true,
    },
  });
  

  server.route([{
      method: "POST",
      path: "/screenshot",
      handler: async (request, response) => {
        const { url, height, width, format ,quality,fullscreen} = request.payload;
        const fulscr= fullscreen==="yes"?true:false;
        const browser = await puppeteer.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          waitUntil:'domcontentloaded'
        });
        const page = await browser.newPage();
        try{
        await page.goto(`${url}`);
        await page.setViewport({
          quality:quality,
          height: height,
          width: width,
          deviceScaleFactor: 1,
        });

        const image= await setTimeout(async()=>await page.screenshot({
          type:`${format}`,
          fullPage:fulscr,
        }),30*1000);
        await browser.close();
        return image;
      }
        catch{
          await browser.close();
          return;
        }
      },
    },
    {
      method: "GET",
      path: "/",
      handler: (request, h) => {
        return "screenshot-api";
      },
    },
  ]);
  await server.start();
  console.log(`Server started in: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
init();
