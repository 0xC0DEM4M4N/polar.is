import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en-gb", "en-us", "fr-fr"],
  defaultLocale: "en-gb",
  localePrefix: "always",
});
