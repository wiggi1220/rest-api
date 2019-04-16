module.exports = {
  apps: [
    {
      name: "REST API",
      script: "bootstrap.js",
      instances: 1,
      exec_mode: "cluster",
      watch: ["./server"],
      ignore_watch: ["node_modules", "./data"],
      watch_options: {
        followSymlinks: false
      }
    }
  ]
};
