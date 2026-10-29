import next from "eslint-config-next";

const config = [...next, { ignores: ["prototype/**", ".next/**"] }];

export default config;
