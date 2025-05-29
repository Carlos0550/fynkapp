import "dotenv/config";

const nodeEnv = process.env.NODE_ENV;

const domains: Record<string, string> = {
  production: "https://api.fynkapp.com.ar",
  development: "http://localhost:5000",
};

export const getDomain = (): string => {
  return domains[nodeEnv || "development"];
};
