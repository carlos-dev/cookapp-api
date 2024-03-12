import Router from "@koa/router";

export const router = new Router();

router.post("/", async (ctx) => {
  console.log(ctx.response);

  ctx.body = "Hello World";
});
