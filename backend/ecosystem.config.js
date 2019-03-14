module.exports = {
  apps : [
      {
        name: "backend",
        script: "./server.js",
        watch: true,
        env: {
            "PORT": 1337,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 1337,
            "NODE_ENV": "production",
        }
      }
  ]
}